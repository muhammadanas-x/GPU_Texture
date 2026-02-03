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

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    uint2 px = DTid.xy;
    float3 color = Input[px].rgb;

    switch (/*$(Variable:CurveType)*/)
    {
        case CurveTypes::Polynomial: color = EvaluatePolynomial(color); break;
        case CurveTypes::TextureDeCasteljau: color = EvaluateTextureDeCasteljau(color); break;
        case CurveTypes::TextureSeiler: color = EvaluateTextureSeiler(color); break;
        default: color = float3(1.0f, 0.0f, 1.0f); break;
    }

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
*/
