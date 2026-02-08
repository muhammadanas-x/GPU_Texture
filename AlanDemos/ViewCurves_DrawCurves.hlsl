// Unnamed technique, shader DrawCurves
/*$(ShaderResources)*/

#include "sRGB.hlsli"
#include "Bezier.hlsli"
#include "DeCasteljauTexture.hlsli"
#include "SeilerTexture.hlsli"

static const bool UseF32()
{
    return /*$(Variable:TextureFormat)*/ == TextureFormats::F32;
}

float EvaluateBezierPolynomial(float t)
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

float EvaluateSeilerTexture(float t)
{
    if (UseF32())
    {
        switch (/*$(Variable:CurveOrder)*/)
        {
            case CurveOrders::Linear: return SeilerTexture_Read_Linear(SeilerTexture2D, t, LinearSampler);
            case CurveOrders::Quadratic: return SeilerTexture_Read_Quadratic(SeilerTexture2D, t, LinearSampler);
            case CurveOrders::Cubic: return SeilerTexture_Read_Cubic(SeilerTexture2D, t, LinearSampler);
            case CurveOrders::Quartic: return SeilerTexture_Read_Quartic(SeilerTexture3D, t, LinearSampler);
            case CurveOrders::Quintic: return SeilerTexture_Read_Quintic(SeilerTexture3D, t, LinearSampler);
        }
    }
    else
    {
        switch (/*$(Variable:CurveOrder)*/)
        {
            case CurveOrders::Linear: return SeilerTexture_Read_Linear(SeilerTexture2DU8, t, LinearSampler);
            case CurveOrders::Quadratic: return SeilerTexture_Read_Quadratic(SeilerTexture2DU8, t, LinearSampler);
            case CurveOrders::Cubic: return SeilerTexture_Read_Cubic(SeilerTexture2DU8, t, LinearSampler);
            case CurveOrders::Quartic: return SeilerTexture_Read_Quartic(SeilerTexture3DU8, t, LinearSampler);
            case CurveOrders::Quintic: return SeilerTexture_Read_Quintic(SeilerTexture3DU8, t, LinearSampler);
        }
    }
    return 0.0f;
}

float EvaluateDeCasteljauTexture(float t)
{
    if (UseF32())
    {
        switch (/*$(Variable:CurveOrder)*/)
        {
            case CurveOrders::Linear: return DeCasteljauTexture_Read_Linear(DCTexture2D, t, LinearSampler);
            case CurveOrders::Quadratic: return DeCasteljauTexture_Read_Quadratic(DCTexture2D, t, LinearSampler);
            case CurveOrders::Cubic: return DeCasteljauTexture_Read_Cubic(DCTexture3D, t, LinearSampler);
            case CurveOrders::Quartic: return DeCasteljauTexture_Read_Quartic(DCTexture3D, t, LinearSampler);
            case CurveOrders::Quintic: return DeCasteljauTexture_Read_Quintic(DCTexture3D, t, LinearSampler);
        }
    }
    else
    {
        switch (/*$(Variable:CurveOrder)*/)
        {
            case CurveOrders::Linear: return DeCasteljauTexture_Read_Linear(DCTexture2DU8, t, LinearSampler);
            case CurveOrders::Quadratic: return DeCasteljauTexture_Read_Quadratic(DCTexture2DU8, t, LinearSampler);
            case CurveOrders::Cubic: return DeCasteljauTexture_Read_Cubic(DCTexture3DU8, t, LinearSampler);
            case CurveOrders::Quartic: return DeCasteljauTexture_Read_Quartic(DCTexture3DU8, t, LinearSampler);
            case CurveOrders::Quintic: return DeCasteljauTexture_Read_Quintic(DCTexture3DU8, t, LinearSampler);
        }
    }
    return 0.0f;
}

float EvaluateHybrid(float t)
{
    if (UseF32())
    {
        switch (/*$(Variable:CurveOrder)*/)
        {
            case CurveOrders::Linear: return DeCasteljauTexture_Read_Linear_Hybrid(DCTexture2D, t, LinearSampler);
            case CurveOrders::Quadratic: return DeCasteljauTexture_Read_Quadratic_Hybrid(DCTexture2D, t, LinearSampler);
            case CurveOrders::Cubic: return DeCasteljauTexture_Read_Cubic_Hybrid(DCTexture3D, t, LinearSampler);

            // Already hybrid!
            case CurveOrders::Quartic: return DeCasteljauTexture_Read_Quartic(DCTexture3D, t, LinearSampler);
            case CurveOrders::Quintic: return DeCasteljauTexture_Read_Quintic(DCTexture3D, t, LinearSampler);
        }
    }
    else
    {
        switch (/*$(Variable:CurveOrder)*/)
        {
            case CurveOrders::Linear: return DeCasteljauTexture_Read_Linear_Hybrid(DCTexture2DU8, t, LinearSampler);
            case CurveOrders::Quadratic: return DeCasteljauTexture_Read_Quadratic_Hybrid(DCTexture2DU8, t, LinearSampler);
            case CurveOrders::Cubic: return DeCasteljauTexture_Read_Cubic_Hybrid(DCTexture3DU8, t, LinearSampler);

            // Already hybrid!
            case CurveOrders::Quartic: return DeCasteljauTexture_Read_Quartic(DCTexture3DU8, t, LinearSampler);
            case CurveOrders::Quintic: return DeCasteljauTexture_Read_Quintic(DCTexture3DU8, t, LinearSampler);
        }
    }
    return 0.0f;
}

float SDFCircle(float2 uv, float2 center, float radius)
{
    return length(uv - center) - radius;
}

void ShowControlPoints(inout float3 color, float2 uv)
{
    int numControlPoints = (/*$(Variable:CurveOrder)*/ + 2);
    float CPXSpacing = 1.0f / float(numControlPoints - 1);

    static const float c_radius = 0.01f;

    float minDist = 0.0f;
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 0, /*$(Variable:CP1)*/), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 1, /*$(Variable:CP2)*/), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 2, /*$(Variable:CP3)*/), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 3, /*$(Variable:CP4)*/), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 4, /*$(Variable:CP5)*/), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 5, /*$(Variable:CP6)*/), c_radius));

    if (minDist < 0.0f)
        color = float3(0.0f, 0.0f, 0.0f);
}

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    uint2 dimensions;
    Output.GetDimensions(dimensions.x, dimensions.y);

    uint2 px = DTid.xy;
    float2 uv = (float2(px) + float2(0.5f, 0.5f)) / float2(dimensions);
    uv.y = 1.0f - uv.y;

    uv = ((uv - 0.5f) * 1.05f) + 0.5f;

    float3 color = float3(0.2f, 0.2f, 0.2f);

    float t = uv.x;

    if (uv.x >= 0.0f && uv.x <= 1.0f && uv.y >= 0.0f && uv.y <= 1.0f)
    {
        if (/*$(Variable:ShowDeCasteljauTexture)*/ && uv.y < EvaluateDeCasteljauTexture(t))
            color += /*$(Variable:DeCasteljauColor)*/;

        if (/*$(Variable:ShowPolynomial)*/ && uv.y < EvaluateBezierPolynomial(t))
            color += /*$(Variable:PolynomialColor)*/;

        if (/*$(Variable:ShowSeilerTexture)*/ && uv.y < EvaluateSeilerTexture(t))
            color += /*$(Variable:SeilerColor)*/;

        if (/*$(Variable:ShowHybrid)*/ && uv.y < EvaluateHybrid(t))
            color += /*$(Variable:HybridColor)*/;
    }

    if (/*$(Variable:ShowControlPoints)*/)
        ShowControlPoints(color, uv);

    Output[px] = float4(LinearToSRGB(color), 1.0f);
}

/*
Shader Resources:
    Texture Output (as UAV)
    Texture DCTexture2D (as SRV)
    Texture DCTexture3D (as SRV)
    Texture SeilerTexture2D (as SRV)
    Texture SeilerTexture3D (as SRV)
    Texture DCTexture2DU8 (as SRV)
    Texture DCTexture3DU8 (as SRV)
    Texture SeilerTexture2DU8 (as SRV)
    Texture SeilerTexture3DU8 (as SRV)
*/
