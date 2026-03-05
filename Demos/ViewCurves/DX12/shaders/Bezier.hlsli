
float EvaluateBezier_Linear(float t, float CP1, float CP2)
{
    // 1 1
    float s = 1.0f - t;
    return
        1.0f * CP1 * s +
        1.0f * CP2 * t
    ;
}

float3 EvaluateBezier_Linear(float3 t, float3 CP1, float3 CP2)
{
    // 1 1
    float3 s = 1.0f - t;
    return
        1.0f * CP1 * s +
        1.0f * CP2 * t
    ;
}

float EvaluateBezier_Quadratic(float t, float CP1, float CP2, float CP3)
{
    // 1 2 1
    float s = 1.0f - t;
    return
        1.0f * CP1 * s * s +
        2.0f * CP2 * s * t +
        1.0f * CP3 * t * t
    ;
}

float3 EvaluateBezier_Quadratic(float3 t, float3 CP1, float3 CP2, float3 CP3)
{
    // 1 2 1
    float3 s = 1.0f - t;
    return
        1.0f * CP1 * s * s +
        2.0f * CP2 * s * t +
        1.0f * CP3 * t * t
    ;
}

float EvaluateBezier_Cubic(float t, float CP1, float CP2, float CP3, float CP4)
{
    // 1 3 3 1
    float s = 1.0f - t;
    return
        1.0f * CP1 * s * s * s +
        3.0f * CP2 * s * s * t +
        3.0f * CP3 * s * t * t +
        1.0f * CP4 * t * t * t
    ;
}

float3 EvaluateBezier_Cubic(float3 t, float3 CP1, float3 CP2, float3 CP3, float3 CP4)
{
    // 1 3 3 1
    float3 s = 1.0f - t;
    return
        1.0f * CP1 * s * s * s +
        3.0f * CP2 * s * s * t +
        3.0f * CP3 * s * t * t +
        1.0f * CP4 * t * t * t
    ;
}

float EvaluateBezier_Quartic(float t, float CP1, float CP2, float CP3, float CP4, float CP5)
{
    // 1 4 6 4 1
    float s = 1.0f - t;
    return
        1.0f * CP1 * s * s * s * s +
        4.0f * CP2 * s * s * t * s +
        6.0f * CP3 * s * t * t * s +
        4.0f * CP4 * s * t * t * t +
        1.0f * CP5 * t * t * t * t
    ;
}

float3 EvaluateBezier_Quartic(float3 t, float3 CP1, float3 CP2, float3 CP3, float3 CP4, float3 CP5)
{
    // 1 4 6 4 1
    float3 s = 1.0f - t;
    return
        1.0f * CP1 * s * s * s * s +
        4.0f * CP2 * s * s * t * s +
        6.0f * CP3 * s * t * t * s +
        4.0f * CP4 * s * t * t * t +
        1.0f * CP5 * t * t * t * t
    ;
}

float EvaluateBezier_Quintic(float t, float CP1, float CP2, float CP3, float CP4, float CP5, float CP6)
{
    // 1 5 10 10 5 1
    float s = 1.0f - t;
    return
         1.0f * CP1 * s * s * s * s * s +
         5.0f * CP2 * s * s * s * t * s +
        10.0f * CP3 * s * s * t * t * s +
        10.0f * CP4 * s * s * t * t * t +
         5.0f * CP5 * s * t * t * t * t +
         1.0f * CP6 * t * t * t * t * t
    ;
}

float3 EvaluateBezier_Quintic(float3 t, float3 CP1, float3 CP2, float3 CP3, float3 CP4, float3 CP5, float3 CP6)
{
    // 1 5 10 10 5 1
    float3 s = 1.0f - t;
    return
         1.0f * CP1 * s * s * s * s * s +
         5.0f * CP2 * s * s * s * t * s +
        10.0f * CP3 * s * s * t * t * s +
        10.0f * CP4 * s * s * t * t * t +
         5.0f * CP5 * s * t * t * t * t +
         1.0f * CP6 * t * t * t * t * t
    ;
}
