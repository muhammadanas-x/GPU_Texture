// Unnamed technique, shader Transform
/*$(ShaderResources)*/

#include "sRGB.hlsli"
#include "Bezier.hlsli"

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

float3 EvaluateBezierPolynomial(float3 t)
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

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    uint2 px = DTid.xy;
    float3 color = Input[px].rgb;

    switch (/*$(Variable:CurveType)*/)
    {
        case CurveTypes::Polynomial: color = EvaluateBezierPolynomial(color); break;
    }

    // TODO: continue!

    Output[px] = float4(LinearToSRGB(color), 1.0f);
}

/*
Shader Resources:
	Texture Input (as SRV)
	Texture Output (as UAV)
*/
