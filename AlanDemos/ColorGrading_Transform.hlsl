// Unnamed technique, shader Transform
/*$(ShaderResources)*/

#include "sRGB.hlsli"
#include "Bezier.hlsli"
#include "SeilerTexture.hlsli"
#include "DeCasteljauTexture.hlsli"

float3 EvaluateBezier_Linear_float3(float3 t, float3 CP1, float3 CP2)
{
    return float3(
        EvaluateBezier_Linear(t.x, CP1.x, CP2.x),
        EvaluateBezier_Linear(t.y, CP1.y, CP2.y),
        EvaluateBezier_Linear(t.z, CP1.z, CP2.z)
    );
}

float3 EvaluateBezier_Quadratic_float3(float3 t, float3 CP1, float3 CP2, float3 CP3)
{
    return float3(
        EvaluateBezier_Quadratic(t.x, CP1.x, CP2.x, CP3.x),
        EvaluateBezier_Quadratic(t.y, CP1.y, CP2.y, CP3.y),
        EvaluateBezier_Quadratic(t.z, CP1.z, CP2.z, CP3.z)
    );
}

float3 EvaluateBezier_Cubic_float3(float3 t, float3 CP1, float3 CP2, float3 CP3, float3 CP4)
{
    return float3(
        EvaluateBezier_Cubic(t.x, CP1.x, CP2.x, CP3.x, CP4.x),
        EvaluateBezier_Cubic(t.y, CP1.y, CP2.y, CP3.y, CP4.y),
        EvaluateBezier_Cubic(t.z, CP1.z, CP2.z, CP3.z, CP4.z)
    );
}

float3 EvaluateBezier_Quartic_float3(float3 t, float3 CP1, float3 CP2, float3 CP3, float3 CP4, float3 CP5)
{
    return float3(
        EvaluateBezier_Quartic(t.x, CP1.x, CP2.x, CP3.x, CP4.x, CP5.x),
        EvaluateBezier_Quartic(t.y, CP1.y, CP2.y, CP3.y, CP4.y, CP5.y),
        EvaluateBezier_Quartic(t.z, CP1.z, CP2.z, CP3.z, CP4.z, CP5.z)
    );
}

float3 EvaluateBezier_Quintic_float3(float3 t, float3 CP1, float3 CP2, float3 CP3, float3 CP4, float3 CP5, float3 CP6)
{
    return float3(
        EvaluateBezier_Quintic(t.x, CP1.x, CP2.x, CP3.x, CP4.x, CP5.x, CP6.x),
        EvaluateBezier_Quintic(t.y, CP1.y, CP2.y, CP3.y, CP4.y, CP5.y, CP6.y),
        EvaluateBezier_Quintic(t.z, CP1.z, CP2.z, CP3.z, CP4.z, CP5.z, CP6.z)
    );
}

float3 EvaluatePolynomial(float3 t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return EvaluateBezier_Linear_float3(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/);
        case CurveOrders::Quadratic: return EvaluateBezier_Quadratic_float3(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/);
        case CurveOrders::Cubic: return EvaluateBezier_Cubic_float3(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/);
        case CurveOrders::Quartic: return EvaluateBezier_Quartic_float3(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/);
        case CurveOrders::Quintic: return EvaluateBezier_Quintic_float3(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/, /*$(Variable:CP6)*/);
    }
    return 0.0f;
}

float3 DeCasteljauTexture_Read_Linear_float3(float3 t)
{
    return float3(
        DeCasteljauTexture_Read_Linear(DCTexture2D, t.x, LinearSampler),
        DeCasteljauTexture_Read_Linear(DCTexture2D, t.y, LinearSampler),
        DeCasteljauTexture_Read_Linear(DCTexture2D, t.z, LinearSampler)
    );
}

float3 DeCasteljauTexture_Read_Quadratic_float3(float3 t)
{
    return float3(
        DeCasteljauTexture_Read_Quadratic(DCTexture2D, t.x, LinearSampler),
        DeCasteljauTexture_Read_Quadratic(DCTexture2D, t.y, LinearSampler),
        DeCasteljauTexture_Read_Quadratic(DCTexture2D, t.z, LinearSampler)
    );
}

float3 DeCasteljauTexture_Read_Cubic_float3(float3 t)
{
    return float3(
        DeCasteljauTexture_Read_Cubic(DCTexture3D, t.x, LinearSampler),
        DeCasteljauTexture_Read_Cubic(DCTexture3D, t.y, LinearSampler),
        DeCasteljauTexture_Read_Cubic(DCTexture3D, t.z, LinearSampler)
    );
}

float3 DeCasteljauTexture_Read_Quartic_float3(float3 t)
{
    return float3(
        DeCasteljauTexture_Read_Quartic(DCTexture3D, t.x, LinearSampler),
        DeCasteljauTexture_Read_Quartic(DCTexture3D, t.y, LinearSampler),
        DeCasteljauTexture_Read_Quartic(DCTexture3D, t.z, LinearSampler)
    );
}

float3 DeCasteljauTexture_Read_Quintic_float3(float3 t)
{
    return float3(
        DeCasteljauTexture_Read_Quintic(DCTexture3D, t.x, LinearSampler),
        DeCasteljauTexture_Read_Quintic(DCTexture3D, t.y, LinearSampler),
        DeCasteljauTexture_Read_Quintic(DCTexture3D, t.z, LinearSampler)
    );
}

float3 EvaluateTextureDeCasteljau(float3 t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return DeCasteljauTexture_Read_Linear_float3(t);
        case CurveOrders::Quadratic: return DeCasteljauTexture_Read_Quadratic_float3(t);
        case CurveOrders::Cubic: return DeCasteljauTexture_Read_Cubic_float3(t);
        case CurveOrders::Quartic: return DeCasteljauTexture_Read_Quartic_float3(t);
        case CurveOrders::Quintic: return DeCasteljauTexture_Read_Quintic_float3(t);
    }
    return 0.0f;
}

float3 SeilerTexture_Read_Linear_float3(float3 t)
{
    return float3(
        SeilerTexture_Read_Linear(SeilerTexture2D, t.x, LinearSampler),
        SeilerTexture_Read_Linear(SeilerTexture2D, t.y, LinearSampler),
        SeilerTexture_Read_Linear(SeilerTexture2D, t.z, LinearSampler)
    );
}

float3 SeilerTexture_Read_Quadratic_float3(float3 t)
{
    return float3(
        SeilerTexture_Read_Quadratic(SeilerTexture2D, t.x, LinearSampler),
        SeilerTexture_Read_Quadratic(SeilerTexture2D, t.y, LinearSampler),
        SeilerTexture_Read_Quadratic(SeilerTexture2D, t.z, LinearSampler)
    );
}

float3 SeilerTexture_Read_Cubic_float3(float3 t)
{
    return float3(
        SeilerTexture_Read_Cubic(SeilerTexture2D, t.x, LinearSampler),
        SeilerTexture_Read_Cubic(SeilerTexture2D, t.y, LinearSampler),
        SeilerTexture_Read_Cubic(SeilerTexture2D, t.z, LinearSampler)
    );
}

float3 SeilerTexture_Read_Quartic_float3(float3 t)
{
    return float3(
        SeilerTexture_Read_Quartic(SeilerTexture3D, t.x, LinearSampler),
        SeilerTexture_Read_Quartic(SeilerTexture3D, t.y, LinearSampler),
        SeilerTexture_Read_Quartic(SeilerTexture3D, t.z, LinearSampler)
    );
}

float3 SeilerTexture_Read_Quintic_float3(float3 t)
{
    return float3(
        SeilerTexture_Read_Quintic(SeilerTexture3D, t.x, LinearSampler),
        SeilerTexture_Read_Quintic(SeilerTexture3D, t.y, LinearSampler),
        SeilerTexture_Read_Quintic(SeilerTexture3D, t.z, LinearSampler)
    );
}

float3 EvaluateTextureSeiler(float3 t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return SeilerTexture_Read_Linear_float3(t);
        case CurveOrders::Quadratic: return SeilerTexture_Read_Quadratic_float3(t);
        case CurveOrders::Cubic: return SeilerTexture_Read_Cubic_float3(t);
        case CurveOrders::Quartic: return SeilerTexture_Read_Quartic_float3(t);
        case CurveOrders::Quintic: return SeilerTexture_Read_Quintic_float3(t);
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
