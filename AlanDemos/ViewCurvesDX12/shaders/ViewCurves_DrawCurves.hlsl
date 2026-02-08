// Unnamed technique, shader DrawCurves


struct CurveOrders
{
    static const int Linear = 0;
    static const int Quadratic = 1;
    static const int Cubic = 2;
    static const int Quartic = 3;
    static const int Quintic = 4;
};

struct TextureFormats
{
    static const int F32 = 0;
    static const int U8 = 1;
};

struct Struct__DrawCurves_0CB
{
    float CP1;
    float CP2;
    float CP3;
    float CP4;
    float CP5;
    float CP6;
    int CurveOrder;
    float _padding0;
    float3 DeCasteljauColor;
    float _padding1;
    float3 HybridColor;
    float _padding2;
    float3 PolynomialColor;
    float _padding3;
    float3 SeilerColor;
    uint ShowControlPoints;
    uint ShowDeCasteljauTexture;
    uint ShowHybrid;
    uint ShowPolynomial;
    uint ShowSeilerTexture;
    int TextureFormat;
    float3 _padding4;
};

SamplerState LinearSampler : register(s0);
RWTexture2D<float4> Output : register(u0);
Texture2D<float> DCTexture2D : register(t0);
Texture3D<float> DCTexture3D : register(t1);
Texture2D<float> SeilerTexture2D : register(t2);
Texture3D<float> SeilerTexture3D : register(t3);
Texture2D<float> DCTexture2DU8 : register(t4);
Texture3D<float> DCTexture3DU8 : register(t5);
Texture2D<float> SeilerTexture2DU8 : register(t6);
Texture3D<float> SeilerTexture3DU8 : register(t7);
ConstantBuffer<Struct__DrawCurves_0CB> _DrawCurves_0CB : register(b0);

#line 2


#include "sRGB.hlsli"
#include "Bezier.hlsli"
#include "DeCasteljauTexture.hlsli"
#include "SeilerTexture.hlsli"

static const bool UseF32()
{
    return _DrawCurves_0CB.TextureFormat == TextureFormats::F32;
}

float EvaluateBezierPolynomial(float t)
{
    switch (_DrawCurves_0CB.CurveOrder)
    {
        case CurveOrders::Linear: return EvaluateBezier_Linear(t, _DrawCurves_0CB.CP1, _DrawCurves_0CB.CP2);
        case CurveOrders::Quadratic: return EvaluateBezier_Quadratic(t, _DrawCurves_0CB.CP1, _DrawCurves_0CB.CP2, _DrawCurves_0CB.CP3);
        case CurveOrders::Cubic: return EvaluateBezier_Cubic(t, _DrawCurves_0CB.CP1, _DrawCurves_0CB.CP2, _DrawCurves_0CB.CP3, _DrawCurves_0CB.CP4);
        case CurveOrders::Quartic: return EvaluateBezier_Quartic(t, _DrawCurves_0CB.CP1, _DrawCurves_0CB.CP2, _DrawCurves_0CB.CP3, _DrawCurves_0CB.CP4, _DrawCurves_0CB.CP5);
        case CurveOrders::Quintic: return EvaluateBezier_Quintic(t, _DrawCurves_0CB.CP1, _DrawCurves_0CB.CP2, _DrawCurves_0CB.CP3, _DrawCurves_0CB.CP4, _DrawCurves_0CB.CP5, _DrawCurves_0CB.CP6);
    }
    return 0.0f;
}

float EvaluateSeilerTexture(float t)
{
    if (UseF32())
    {
        switch (_DrawCurves_0CB.CurveOrder)
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
        switch (_DrawCurves_0CB.CurveOrder)
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
        switch (_DrawCurves_0CB.CurveOrder)
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
        switch (_DrawCurves_0CB.CurveOrder)
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
        switch (_DrawCurves_0CB.CurveOrder)
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
        switch (_DrawCurves_0CB.CurveOrder)
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
    int numControlPoints = (_DrawCurves_0CB.CurveOrder + 2);
    float CPXSpacing = 1.0f / float(numControlPoints - 1);

    static const float c_radius = 0.01f;

    float minDist = 0.0f;
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 0, _DrawCurves_0CB.CP1), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 1, _DrawCurves_0CB.CP2), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 2, _DrawCurves_0CB.CP3), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 3, _DrawCurves_0CB.CP4), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 4, _DrawCurves_0CB.CP5), c_radius));
    minDist = min(minDist, SDFCircle(uv, float2(CPXSpacing * 5, _DrawCurves_0CB.CP6), c_radius));

    if (minDist < 0.0f)
        color = float3(0.0f, 0.0f, 0.0f);
}

[numthreads(8, 8, 1)]
#line 136
void main(uint3 DTid : SV_DispatchThreadID)
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
        if ((bool)_DrawCurves_0CB.ShowDeCasteljauTexture && uv.y < EvaluateDeCasteljauTexture(t))
            color += _DrawCurves_0CB.DeCasteljauColor;

        if ((bool)_DrawCurves_0CB.ShowPolynomial && uv.y < EvaluateBezierPolynomial(t))
            color += _DrawCurves_0CB.PolynomialColor;

        if ((bool)_DrawCurves_0CB.ShowSeilerTexture && uv.y < EvaluateSeilerTexture(t))
            color += _DrawCurves_0CB.SeilerColor;

        if ((bool)_DrawCurves_0CB.ShowHybrid && uv.y < EvaluateHybrid(t))
            color += _DrawCurves_0CB.HybridColor;
    }

    if ((bool)_DrawCurves_0CB.ShowControlPoints)
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
