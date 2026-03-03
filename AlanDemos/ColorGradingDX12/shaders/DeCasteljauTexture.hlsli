void DeCasteljauTexture_Write_Linear(RWTexture2D<float4> tex, float3 CP1, float3 CP2)
{
    // we only need the top 2 pixels. could be a 1d texture
    tex[uint2(0, 0)] = float4(CP1, 1.0f);
    tex[uint2(1, 0)] = float4(CP2, 1.0f);
}

void DeCasteljauTexture_Write_Linear(RWTexture2D<float> tex, float CP1, float CP2)
{
    // we only need the top 2 pixels. could be a 1d texture
    tex[uint2(0, 0)] = CP1;
    tex[uint2(1, 0)] = CP2;
}

void DeCasteljauTexture_Write_Quadratic(RWTexture2D<float> tex, float CP1, float CP2, float CP3)
{
    tex[uint2(0, 0)] = CP1;
    tex[uint2(1, 0)] = CP2;

    tex[uint2(0, 1)] = CP2;
    tex[uint2(1, 1)] = CP3;
}

void DeCasteljauTexture_Write_Quadratic(RWTexture2D<float4> tex, float3 CP1, float3 CP2, float3 CP3)
{
    tex[uint2(0, 0)] = float4(CP1, 1.0f);
    tex[uint2(1, 0)] = float4(CP2, 1.0f);

    tex[uint2(0, 1)] = float4(CP2, 1.0f);
    tex[uint2(1, 1)] = float4(CP3, 1.0f);
}

void DeCasteljauTexture_Write_Cubic(RWTexture3D<float> tex, float CP1, float CP2, float CP3, float CP4)
{
    tex[uint3(0, 0, 0)] = CP1;
    tex[uint3(1, 0, 0)] = CP2;
    tex[uint3(0, 1, 0)] = CP2;
    tex[uint3(1, 1, 0)] = CP3;

    tex[uint3(0, 0, 1)] = CP2;
    tex[uint3(1, 0, 1)] = CP3;
    tex[uint3(0, 1, 1)] = CP3;
    tex[uint3(1, 1, 1)] = CP4;
}

void DeCasteljauTexture_Write_Cubic(RWTexture3D<float4> tex, float3 CP1, float3 CP2, float3 CP3, float3 CP4)
{
    tex[uint3(0, 0, 0)] = float4(CP1, 1.0f);
    tex[uint3(1, 0, 0)] = float4(CP2, 1.0f);
    tex[uint3(0, 1, 0)] = float4(CP2, 1.0f);
    tex[uint3(1, 1, 0)] = float4(CP3, 1.0f);

    tex[uint3(0, 0, 1)] = float4(CP2, 1.0f);
    tex[uint3(1, 0, 1)] = float4(CP3, 1.0f);
    tex[uint3(0, 1, 1)] = float4(CP3, 1.0f);
    tex[uint3(1, 1, 1)] = float4(CP4, 1.0f);
}

void DeCasteljauTexture_Write_Quartic(RWTexture3D<float> tex, float CP1, float CP2, float CP3, float CP4, float CP5)
{
    tex[uint3(0, 0, 0)] = CP1;
    tex[uint3(1, 0, 0)] = CP2;
    tex[uint3(0, 1, 0)] = CP2;
    tex[uint3(1, 1, 0)] = CP3;

    tex[uint3(0, 0, 1)] = CP2;
    tex[uint3(1, 0, 1)] = CP3;
    tex[uint3(0, 1, 1)] = CP3;
    tex[uint3(1, 1, 1)] = CP4;

    tex[uint3(0, 0, 2)] = CP3;
    tex[uint3(1, 0, 2)] = CP4;
    tex[uint3(0, 1, 2)] = CP4;
    tex[uint3(1, 1, 2)] = CP5;
}

void DeCasteljauTexture_Write_Quartic(RWTexture3D<float4> tex, float3 CP1, float3 CP2, float3 CP3, float3 CP4, float3 CP5)
{
    tex[uint3(0, 0, 0)] = float4(CP1, 1.0f);
    tex[uint3(1, 0, 0)] = float4(CP2, 1.0f);
    tex[uint3(0, 1, 0)] = float4(CP2, 1.0f);
    tex[uint3(1, 1, 0)] = float4(CP3, 1.0f);

    tex[uint3(0, 0, 1)] = float4(CP2, 1.0f);
    tex[uint3(1, 0, 1)] = float4(CP3, 1.0f);
    tex[uint3(0, 1, 1)] = float4(CP3, 1.0f);
    tex[uint3(1, 1, 1)] = float4(CP4, 1.0f);

    tex[uint3(0, 0, 2)] = float4(CP3, 1.0f);
    tex[uint3(1, 0, 2)] = float4(CP4, 1.0f);
    tex[uint3(0, 1, 2)] = float4(CP4, 1.0f);
    tex[uint3(1, 1, 2)] = float4(CP5, 1.0f);
}

void DeCasteljauTexture_Write_Quintic(RWTexture3D<float> tex, float CP1, float CP2, float CP3, float CP4, float CP5, float CP6)
{
    tex[uint3(0, 0, 0)] = CP1;
    tex[uint3(1, 0, 0)] = CP2;
    tex[uint3(0, 1, 0)] = CP2;
    tex[uint3(1, 1, 0)] = CP3;

    tex[uint3(0, 0, 1)] = CP2;
    tex[uint3(1, 0, 1)] = CP3;
    tex[uint3(0, 1, 1)] = CP3;
    tex[uint3(1, 1, 1)] = CP4;

    tex[uint3(0, 0, 2)] = CP3;
    tex[uint3(1, 0, 2)] = CP4;
    tex[uint3(0, 1, 2)] = CP4;
    tex[uint3(1, 1, 2)] = CP5;

    tex[uint3(0, 0, 3)] = CP4;
    tex[uint3(1, 0, 3)] = CP5;
    tex[uint3(0, 1, 3)] = CP5;
    tex[uint3(1, 1, 3)] = CP6;
}

void DeCasteljauTexture_Write_Quintic(RWTexture3D<float4> tex, float3 CP1, float3 CP2, float3 CP3, float3 CP4, float3 CP5, float3 CP6)
{
    tex[uint3(0, 0, 0)] = float4(CP1, 1.0f);
    tex[uint3(1, 0, 0)] = float4(CP2, 1.0f);
    tex[uint3(0, 1, 0)] = float4(CP2, 1.0f);
    tex[uint3(1, 1, 0)] = float4(CP3, 1.0f);

    tex[uint3(0, 0, 1)] = float4(CP2, 1.0f);
    tex[uint3(1, 0, 1)] = float4(CP3, 1.0f);
    tex[uint3(0, 1, 1)] = float4(CP3, 1.0f);
    tex[uint3(1, 1, 1)] = float4(CP4, 1.0f);

    tex[uint3(0, 0, 2)] = float4(CP3, 1.0f);
    tex[uint3(1, 0, 2)] = float4(CP4, 1.0f);
    tex[uint3(0, 1, 2)] = float4(CP4, 1.0f);
    tex[uint3(1, 1, 2)] = float4(CP5, 1.0f);

    tex[uint3(0, 0, 3)] = float4(CP4, 1.0f);
    tex[uint3(1, 0, 3)] = float4(CP5, 1.0f);
    tex[uint3(0, 1, 3)] = float4(CP5, 1.0f);
    tex[uint3(1, 1, 3)] = float4(CP6, 1.0f);
}

float DeCasteljauTexture_Read_Linear(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    // change percentage into uv
    float2 uv = lerp(float2(0.25f, 0.25f), float2(0.75f, 0.25f), t);
    return tex.SampleLevel(LinearSampler, uv, 0);
}

float DeCasteljauTexture_Read_Linear_Hybrid(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    float A = tex[uint2(0, 0)];
    float B = tex[uint2(1, 0)];
    return lerp(A, B, t);
}

float3 DeCasteljauTexture_Read_Linear(in Texture2D<float4> tex, float3 t, in SamplerState LinearSampler)
{
    return float3(
        tex.SampleLevel(LinearSampler, lerp(float2(0.25f, 0.25f), float2(0.75f, 0.25f), t.x), 0).r,
        tex.SampleLevel(LinearSampler, lerp(float2(0.25f, 0.25f), float2(0.75f, 0.25f), t.y), 0).g,
        tex.SampleLevel(LinearSampler, lerp(float2(0.25f, 0.25f), float2(0.75f, 0.25f), t.z), 0).b
    );
}

float DeCasteljauTexture_Read_Quadratic(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    // change percentage into uv
    float2 uv = lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), t);
    return tex.SampleLevel(LinearSampler, uv, 0);
}

float DeCasteljauTexture_Read_Quadratic_Hybrid(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    // change percentage into uv
    float2 uvA = lerp(float2(0.25f, 0.25f), float2(0.75f, 0.25f), t);
    float2 uvB = lerp(float2(0.25f, 0.75f), float2(0.75f, 0.75f), t);
    float A = tex.SampleLevel(LinearSampler, uvA, 0);
    float B = tex.SampleLevel(LinearSampler, uvB, 0);
    return lerp(A, B, t);
}

float3 DeCasteljauTexture_Read_Quadratic(in Texture2D<float4> tex, float3 t, in SamplerState LinearSampler)
{
    return float3(
        tex.SampleLevel(LinearSampler, lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), t.x), 0).r,
        tex.SampleLevel(LinearSampler, lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), t.y), 0).g,
        tex.SampleLevel(LinearSampler, lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), t.z), 0).b
    );
}

float DeCasteljauTexture_Read_Cubic(in Texture3D<float> tex, float t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // change percentage into uv
    float3 samplePosPx = lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t);
    float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
    return tex.SampleLevel(LinearSampler, uvw, 0);
}

float DeCasteljauTexture_Read_Cubic_Hybrid(in Texture3D<float> tex, float t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // change percentage into uv
    float3 samplePosPxA = lerp(float3(0.0f, 0.0f, 0.0f), float3(0.0f, 1.0f, 1.0f), t);
    float3 uvwA = (samplePosPxA + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
    float3 samplePosPxB = lerp(float3(1.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t);
    float3 uvwB = (samplePosPxB + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
    float A = tex.SampleLevel(LinearSampler, uvwA, 0);
    float B = tex.SampleLevel(LinearSampler, uvwB, 0);
    return lerp(A, B, t);
}

float3 DeCasteljauTexture_Read_Cubic(in Texture3D<float4> tex, float3 t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    return float3(
        tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.x) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).r,
        tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.y) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).g,
        tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.z) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).b
    );
}

float DeCasteljauTexture_Read_Quartic(in Texture3D<float> tex, float t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // Get the first cubic curve
    float A;
    {
        // change percentage into uv
        float3 samplePosPx = lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t);
        float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
        A = tex.SampleLevel(LinearSampler, uvw, 0);
    }

    // Get the second cubic curve
    float B;
    {
        // change percentage into uv
        float3 samplePosPx = lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t);
        float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
        B = tex.SampleLevel(LinearSampler, uvw, 0);
    }

    // lerp in shaders to make a quartic from these 2 cubics.
    return lerp(A, B, t);
}

float3 DeCasteljauTexture_Read_Quartic(in Texture3D<float4> tex, float3 t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // Get the first cubic curve
    float3 A;
    A.x = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.x) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).r;
    A.y = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.y) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).g;
    A.z = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.z) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).b;

    // Get the second cubic curve
    float3 B;
    B.x = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t.x) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).r;
    B.y = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t.y) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).g;
    B.z = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t.z) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).b;

    // lerp in shaders to make a quartic from these 2 cubics.
    return lerp(A, B, t);
}

float DeCasteljauTexture_Read_Quintic(in Texture3D<float> tex, float t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // Get the first cubic curve
    float A;
    {
        // change percentage into uv
        float3 samplePosPx = lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t);
        float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
        A = tex.SampleLevel(LinearSampler, uvw, 0);
    }

    // Get the second cubic curve
    float B;
    {
        // change percentage into uv
        float3 samplePosPx = lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t);
        float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
        B = tex.SampleLevel(LinearSampler, uvw, 0);
    }

    // Get the third cubic curve
    float C;
    {
        // change percentage into uv
        float3 samplePosPx = lerp(float3(0.0f, 0.0f, 2.0f), float3(1.0f, 1.0f, 3.0f), t);
        float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
        C = tex.SampleLevel(LinearSampler, uvw, 0);
    }

    // Use the quadratic bezier formulate in shaders, to make a quintic from these 3 cubics.
    // We could also do a lerp of 2 lerps instead.
    float s = 1.0f - t;
    return A * s * s + 2.0f * B * s * t + C * t * t;
}

float3 DeCasteljauTexture_Read_Quintic(in Texture3D<float4> tex, float3 t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // Get the first cubic curve
    float3 A;
    A.x = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.x) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).r;
    A.y = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.y) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).g;
    A.z = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), t.z) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).b;

    // Get the second cubic curve
    float3 B;
    B.x = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t.x) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).r;
    B.y = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t.y) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).g;
    B.z = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 1.0f), float3(1.0f, 1.0f, 2.0f), t.z) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).b;

    // Get the third cubic curve
    float3 C;
    C.x = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 2.0f), float3(1.0f, 1.0f, 3.0f), t.x) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).r;
    C.y = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 2.0f), float3(1.0f, 1.0f, 3.0f), t.y) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).g;
    C.z = tex.SampleLevel(LinearSampler, (lerp(float3(0.0f, 0.0f, 2.0f), float3(1.0f, 1.0f, 3.0f), t.z) + float3(0.5f, 0.5f, 0.5f)) / float3(dims), 0).b;

    // Use the quadratic bezier formulate in shaders, to make a quintic from these 3 cubics.
    // We could also do a lerp of 2 lerps instead.
    float3 s = 1.0f - t;
    return A * s * s + 2.0f * B * s * t + C * t * t;
}