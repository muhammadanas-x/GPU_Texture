// Unnamed technique, shader DrawCurves
/*$(ShaderResources)*/

#include "sRGB.hlsli"
#include "Bezier.hlsli"

float EvaluateBezier(float t)
{
    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: return EvaluateBezier_Linear(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/);
        case CurveOrders::Quadratic: return EvaluateBezier_Quadratic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/);
        case CurveOrders::Cubic: return EvaluateBezier_Cubic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/);
        case CurveOrders::Quartic: return EvaluateBezier_Quartic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/);
        case CurveOrders::Quintic: return EvaluateBezier_Quintic(t, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/, /*$(Variable:CP6)*/);
    }
    return 0.5f;
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
        color = float3(1.0f, 1.0f, 1.0f);
}

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    uint2 dimensions;
    Output.GetDimensions(dimensions.x, dimensions.y);

    uint2 px = DTid.xy;
    float2 uv = (float2(px) + float2(0.5f, 0.5f)) / float2(dimensions);
    uv.y = 1.0f - uv.y;

    float3 color = float3(0.1f, 0.1f, 0.1f);

    float t = uv.x;
    if (/*$(Variable:ShowPolynomial)*/ && uv.y < EvaluateBezier(t))
        color.b = 0.9f;

    if (/*$(Variable:ShowControlPoints)*/)
        ShowControlPoints(color, uv);

    Output[px] = float4(LinearToSRGB(color), 1.0f);
}

/*
Shader Resources:
    Texture Output (as UAV)
*/
