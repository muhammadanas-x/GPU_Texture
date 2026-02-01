void SeilerTexture_Write_Linear(RWTexture2D<float> tex, float CP1, float CP2)
{
    // we only need the top 2 pixels. could be a 1d texture
    tex[uint2(0, 0)] = CP1;
    tex[uint2(1, 0)] = CP2;
}

void SeilerTexture_Write_Quadratic(RWTexture2D<float> tex, float CP1, float CP2, float CP3)
{
    float b0 = CP1;
    float b1 = CP2;
    float b2 = CP3;

    float d1 = 2.0f * (b1 - b0) - (b2 - b0);

    tex[uint2(0, 0)] = b0;
    tex[uint2(1, 0)] = b2;

    tex[uint2(0, 1)] = b0 + d1;
    tex[uint2(1, 1)] = b2 + d1;
}

void SeilerTexture_Write_Cubic(RWTexture2D<float> tex, float CP1, float CP2, float CP3, float CP4)
{
    float b0 = CP1;
    float b1 = CP2;
    float b2 = CP3;
    float b3 = CP4;

    float d1 = 3.0f * (b1 - b0) - (b3 - b0);
    float d2 = 3.0f * (b2 - b3) - (b0 - b3);

    tex[uint2(0, 0)] = b0;
    tex[uint2(1, 0)] = b3;

    tex[uint2(0, 1)] = b0 + d1;
    tex[uint2(1, 1)] = b3 + d2;
}

void SeilerTexture_Write_Quartic(RWTexture3D<float> tex, float CP1, float CP2, float CP3, float CP4, float CP5)
{
    float b0 = CP1;
    float b1 = CP2;
    float b2 = CP3;
    float b3 = CP4;
    float b4 = CP5;

    float d1 = 4.0f * (b1 - b0) - (b4 - b0);
    float d3 = 4.0f * (b3 - b4) - (b0 - b4);
    float d2 = 6.0f * (b2 - b1) - (b1 - b0) - (b3 - b4) - 3.0f * (b3 - b1);

    tex[uint3(0, 0, 0)] = b0;
    tex[uint3(1, 0, 0)] = b4;
    tex[uint3(0, 1, 0)] = b0;
    tex[uint3(1, 1, 0)] = b4;

    tex[uint3(0, 0, 1)] = b0 + d1;
    tex[uint3(1, 0, 1)] = b4 + d3;
    tex[uint3(0, 1, 1)] = b0 + d1 + d2;
    tex[uint3(1, 1, 1)] = b4 + d3 + d2;
}

void SeilerTexture_Write_Quintic(RWTexture3D<float> tex, float CP1, float CP2, float CP3, float CP4, float CP5, float CP6)
{
    float b0 = CP1;
    float b1 = CP2;
    float b2 = CP3;
    float b3 = CP4;
    float b4 = CP5;
    float b5 = CP6;

    float d1 = 5.0f * (b1 - b0) - (b5 - b0);
    float d4 = 5.0f * (b4 - b5) - (b0 - b5);
    float d2 = 10.0f * (b2 - b1) - 3.0f * (b1 - b0) - 2.0f * (b4 - b5) - 3.0f * (b4 - b1);
    float d3 = 10.0f * (b3 - b4) - 3.0f * (b4 - b5) - 2.0f * (b1 - b0) - 3.0f * (b1 - b4);

    tex[uint3(0, 0, 0)] = b0;
    tex[uint3(1, 0, 0)] = b5;
    tex[uint3(0, 1, 0)] = b0;
    tex[uint3(1, 1, 0)] = b5;

    tex[uint3(0, 0, 1)] = b0 + d1;
    tex[uint3(1, 0, 1)] = b5 + d4;
    tex[uint3(0, 1, 1)] = b0 + d1 + d2;
    tex[uint3(1, 1, 1)] = b5 + d4 + d3;
}

float SeilerTexture_Read_Linear(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    // change percentage into uv
    float2 uv = lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), float2(t, 0.0f));
    return tex.SampleLevel(LinearSampler, uv, 0);
}

float SeilerTexture_Read_Quadratic(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    // change percentage into uv
    float s = 1.0f - t;
    float2 uv = lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), float2(t, s*t));
    return tex.SampleLevel(LinearSampler, uv, 0);
}

float SeilerTexture_Read_Cubic(in Texture2D<float> tex, float t, in SamplerState LinearSampler)
{
    // change percentage into uv
    float s = 1.0f - t;
    float2 uv = lerp(float2(0.25f, 0.25f), float2(0.75f, 0.75f), float2(t, s * t));
    return tex.SampleLevel(LinearSampler, uv, 0);
}

float SeilerTexture_Read_Quartic(in Texture3D<float> tex, float t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // change percentage into uv
    float s = 1.0f - t;
    float3 samplePosPx = lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), float3(t, s * t, s * t));
    float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
    return tex.SampleLevel(LinearSampler, uvw, 0);
}

float SeilerTexture_Read_Quintic(in Texture3D<float> tex, float t, in SamplerState LinearSampler)
{
    uint3 dims;
    tex.GetDimensions(dims.x, dims.y, dims.z);

    // change percentage into uv
    float s = 1.0f - t;
    float3 samplePosPx = lerp(float3(0.0f, 0.0f, 0.0f), float3(1.0f, 1.0f, 1.0f), float3(t, s * t, s * t));
    float3 uvw = (samplePosPx + float3(0.5f, 0.5f, 0.5f)) / float3(dims);
    return tex.SampleLevel(LinearSampler, uvw, 0);
}
