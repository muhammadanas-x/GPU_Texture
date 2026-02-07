// Unnamed technique, shader Transform
/*$(ShaderResources)*/

#include "sRGB.hlsli"
#include "Bezier.hlsli"
#include "SeilerTexture.hlsli"
#include "DeCasteljauTexture.hlsli"

float3 EvaluatePolynomial(float3 t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return EvaluateBezier_Linear(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/);
        case CurveOrders::Quadratic: return EvaluateBezier_Quadratic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/);
        case CurveOrders::Cubic: return EvaluateBezier_Cubic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/);
        case CurveOrders::Quartic: return EvaluateBezier_Quartic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/);
        case CurveOrders::Quintic: return EvaluateBezier_Quintic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/, /*$(Variable:CP6)*/);
    }
    return 0.0f;
}

float3 EvaluateTextureDeCasteljau(float3 t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return DeCasteljauTexture_Read_Linear(DCTexture2D, t, LinearSampler);
        case CurveOrders::Quadratic: return DeCasteljauTexture_Read_Quadratic(DCTexture2D, t, LinearSampler);
        case CurveOrders::Cubic: return DeCasteljauTexture_Read_Cubic(DCTexture3D, t, LinearSampler);
        case CurveOrders::Quartic: return DeCasteljauTexture_Read_Quartic(DCTexture3D, t, LinearSampler);
        case CurveOrders::Quintic: return DeCasteljauTexture_Read_Quintic(DCTexture3D, t, LinearSampler);
    }
    return 0.0f;
}

float3 EvaluateTextureSeiler(float3 t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return SeilerTexture_Read_Linear(SeilerTexture2D, t, LinearSampler);
        case CurveOrders::Quadratic: return SeilerTexture_Read_Quadratic(SeilerTexture2D, t, LinearSampler);
        case CurveOrders::Cubic: return SeilerTexture_Read_Cubic(SeilerTexture2D, t, LinearSampler);
        case CurveOrders::Quartic: return SeilerTexture_Read_Quartic(SeilerTexture3D, t, LinearSampler);
        case CurveOrders::Quintic: return SeilerTexture_Read_Quintic(SeilerTexture3D, t, LinearSampler);
    }
    return 0.0f;
}

void ColorGrade(inout float3 color)
{
    switch (/*$(Variable:CurveType)*/)
    {
        case CurveTypes::Polynomial: color = EvaluatePolynomial(color); break;
        case CurveTypes::TextureDeCasteljau: color = EvaluateTextureDeCasteljau(color); break;
        case CurveTypes::TextureSeiler: color = EvaluateTextureSeiler(color); break;
        default: color = float3(1.0f, 0.0f, 1.0f); break;
    }
}

/*$(Embed:DemofoxNeonDesert_common.hlsl)*/

float3 RenderScene(uint2 px)
{
    static const int c_numBounces = 4;
    static const float c_apertureRadius = 0.4f;
    static const float c_focalPlaneDistance = 80.0f;
    static const bool c_reset = false;
    static const uint c_rayMarchSteps = 256;
    static const float c_minStepDistance = 0.1f;
    static const int c_raysPerFrame = /*$(Variable:RaysPerPixelPerFrame)*/;

    // initialize a random number state based on frag coord and frame
    uint rngState = uint(uint(px.x) * uint(1973) + uint(px.y) * uint(9277) + uint(/*$(Variable:iFrame)*/) * uint(26699)) | uint(1);

    float3 color = float3(0.0f, 0.0f, 0.0f);
    for (int rayIndex = 0; rayIndex < c_raysPerFrame; ++rayIndex)
    {
        // add sub pixel jitter for anti aliasing
        float2 fragCoordJittered = float2(px) + (float2(RandomFloat01(rngState), RandomFloat01(rngState)) - 0.5f);

        // get the camera vectors
        float3 rayOrigin;
        float3 rayDirection;
        {
            uint w, h;
            Accumulation.GetDimensions(w, h);
            float2 dimensions = float2(w, h);

            float2 screenPos = fragCoordJittered / dimensions * 2.0 - 1.0;
            screenPos.y = -screenPos.y;

            float4 world = mul(float4(screenPos, 0.0f, 1), /*$(Variable:InvViewProjMtx)*/);
            world.xyz /= world.w;

            rayOrigin = /*$(Variable:CameraPos)*/;
            rayDirection = normalize(world.xyz - rayOrigin);
        }

        // simulate a thin lens (depth of field and circular bokeh)
        if (c_apertureRadius > 0.0f)
        {
            float3 cameraRight = mul(float4(1.0f, 0.0f, 0.0f, 0.0f), /*$(Variable:InvViewMtx)*/).xyz;
            float3 cameraUp = mul(float4(0.0f, 1.0f, 0.0f, 0.0f), /*$(Variable:InvViewMtx)*/).xyz;

            // calculate point on the focal plane
            float3 focalPlanePoint = rayOrigin + rayDirection * c_focalPlaneDistance;

            // calculate a random point on the aperture
            float angle = RandomFloat01(rngState) * 2.0f * c_pi;
            float radius = sqrt(RandomFloat01(rngState)) * c_apertureRadius;
            float2 offset = float2(cos(angle), sin(angle)) * radius;

            // update the camera pos
            rayOrigin += offset.x * cameraRight + offset.y * cameraUp;

            // update the ray direction
            rayDirection = normalize(focalPlanePoint - rayOrigin);
        }

        // get the linear color of the ray
        color = lerp(color, GetColorForRay(rayOrigin, rayDirection, rngState, c_numBounces, c_rayMarchSteps, c_minStepDistance), 1.0f / float(rayIndex + 1));
    }

    if (/*$(Variable:ColorGrade)*/ == ColorGradeTimings::OncePerFrame)
        ColorGrade(color);

    float blend;
    if (c_raysPerFrame > 0)
    {
        // average the frames together
        float4 lastFrameColor = /*$(RWTextureR:Accumulation)*/[px];
        blend = (/*$(Variable:iFrame)*/ < 2 || c_reset || lastFrameColor.a == 0.0f || /*$(Variable:CameraChanged)*/) ? 1.0f : 1.0f / (1.0f + (1.0f / lastFrameColor.a));
        color = lerp(lastFrameColor.rgb, color, blend);
    }
    else
    {
        float4 lastFrameColor = /*$(RWTextureR:Accumulation)*/[px];
        color = /*$(RWTextureR:Accumulation)*/[px].rgb;
        blend = lastFrameColor.a;
    }

    if (/*$(Variable:ResetAccumulation)*/)
        blend = 1.0f;

    // accumulate the result
    Accumulation[px] = float4(color, blend);

     return ACESFilm(color / 0.6f);
}

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    uint2 px = DTid.xy;
    float3 color = RenderScene(px);
    Output[px] = float4(LinearToSRGB(color), 1.0f);
}

/*
Shader Resources:
    Texture Input (as SRV)
    Texture Output (as UAV)
    Texture DCTexture2D (as SRV)
    Texture DCTexture3D (as SRV)
    Texture SeilerTexture2D (as SRV)
    Texture SeilerTexture3D (as SRV)
    Texture Accumulation (as UAV)
*/
