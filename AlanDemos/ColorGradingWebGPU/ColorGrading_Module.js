import * as Shared from './Shared.js';

function isNode() {
    return typeof process !== 'undefined' && process.versions?.node;
}

let fs;
let PNG;
if (isNode()) {
    await import('webgpu')
        .then((module) => { Object.assign(globalThis, module.globals); })
        .catch((error) => console.error('Error loading module:', error));

    fs = await import('node:fs');

    await import('pngjs')
        .then((module) => {PNG = module.PNG;})
        .catch((error) => console.error('Error loading module:', error));
}

String.prototype.hashCode = function ()
{
    let hash = 0;
    for (let i = 0; i < this.length; i++)
    {
        let chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

class class_ColorGrading
{
loadingPromises = new Set();
waitingOnPromises = false;

// -------------------- Shaders
// Shader code for Compute shader "Transform_0", node "Transform"
static ShaderCode_Transform_Transform_0 = `
@binding(0) @group(0) var Input : texture_2d<f32>;

struct Struct_Transform_0CB_std140_0
{
    @align(16) CP1_0 : vec3<f32>,
    @align(4) _padding0_0 : f32,
    @align(16) CP2_0 : vec3<f32>,
    @align(4) _padding1_0 : f32,
    @align(16) CP3_0 : vec3<f32>,
    @align(4) _padding2_0 : f32,
    @align(16) CP4_0 : vec3<f32>,
    @align(4) _padding3_0 : f32,
    @align(16) CP5_0 : vec3<f32>,
    @align(4) _padding4_0 : f32,
    @align(16) CP6_0 : vec3<f32>,
    @align(4) CurveOrder_0 : i32,
    @align(16) CurveType_0 : i32,
    @align(4) _padding5_0 : f32,
    @align(8) _padding6_0 : f32,
    @align(4) _padding7_0 : f32,
};

@binding(7) @group(0) var<uniform> _Transform_0CB : Struct_Transform_0CB_std140_0;
@binding(2) @group(0) var DCTexture2D : texture_2d<f32>;

@binding(8) @group(0) var LinearSampler : sampler;

@binding(3) @group(0) var DCTexture3D : texture_3d<f32>;

@binding(4) @group(0) var SeilerTexture2D : texture_2d<f32>;

@binding(5) @group(0) var SeilerTexture3D : texture_3d<f32>;

@binding(1) @group(0) var Output : texture_storage_2d</*(Output_format)*/, write>;

fn EvaluateBezier_Linear_0( t_0 : f32,  CP1_1 : f32,  CP2_1 : f32) -> f32
{
    return CP1_1 * (1.0f - t_0) + CP2_1 * t_0;
}

fn EvaluateBezier_Linear_float3_0( t_1 : vec3<f32>,  CP1_2 : vec3<f32>,  CP2_2 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(EvaluateBezier_Linear_0(t_1.x, CP1_2.x, CP2_2.x), EvaluateBezier_Linear_0(t_1.y, CP1_2.y, CP2_2.y), EvaluateBezier_Linear_0(t_1.z, CP1_2.z, CP2_2.z));
}

fn EvaluateBezier_Quadratic_0( t_2 : f32,  CP1_3 : f32,  CP2_3 : f32,  CP3_1 : f32) -> f32
{
    var s_0 : f32 = 1.0f - t_2;
    return CP1_3 * s_0 * s_0 + 2.0f * CP2_3 * s_0 * t_2 + CP3_1 * t_2 * t_2;
}

fn EvaluateBezier_Quadratic_float3_0( t_3 : vec3<f32>,  CP1_4 : vec3<f32>,  CP2_4 : vec3<f32>,  CP3_2 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(EvaluateBezier_Quadratic_0(t_3.x, CP1_4.x, CP2_4.x, CP3_2.x), EvaluateBezier_Quadratic_0(t_3.y, CP1_4.y, CP2_4.y, CP3_2.y), EvaluateBezier_Quadratic_0(t_3.z, CP1_4.z, CP2_4.z, CP3_2.z));
}

fn EvaluateBezier_Cubic_0( t_4 : f32,  CP1_5 : f32,  CP2_5 : f32,  CP3_3 : f32,  CP4_1 : f32) -> f32
{
    var s_1 : f32 = 1.0f - t_4;
    return CP1_5 * s_1 * s_1 * s_1 + 3.0f * CP2_5 * s_1 * s_1 * t_4 + 3.0f * CP3_3 * s_1 * t_4 * t_4 + CP4_1 * t_4 * t_4 * t_4;
}

fn EvaluateBezier_Cubic_float3_0( t_5 : vec3<f32>,  CP1_6 : vec3<f32>,  CP2_6 : vec3<f32>,  CP3_4 : vec3<f32>,  CP4_2 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(EvaluateBezier_Cubic_0(t_5.x, CP1_6.x, CP2_6.x, CP3_4.x, CP4_2.x), EvaluateBezier_Cubic_0(t_5.y, CP1_6.y, CP2_6.y, CP3_4.y, CP4_2.y), EvaluateBezier_Cubic_0(t_5.z, CP1_6.z, CP2_6.z, CP3_4.z, CP4_2.z));
}

fn EvaluateBezier_Quartic_0( t_6 : f32,  CP1_7 : f32,  CP2_7 : f32,  CP3_5 : f32,  CP4_3 : f32,  CP5_1 : f32) -> f32
{
    var s_2 : f32 = 1.0f - t_6;
    return CP1_7 * s_2 * s_2 * s_2 * s_2 + 4.0f * CP2_7 * s_2 * s_2 * t_6 * s_2 + 6.0f * CP3_5 * s_2 * t_6 * t_6 * s_2 + 4.0f * CP4_3 * s_2 * t_6 * t_6 * t_6 + CP5_1 * t_6 * t_6 * t_6 * t_6;
}

fn EvaluateBezier_Quartic_float3_0( t_7 : vec3<f32>,  CP1_8 : vec3<f32>,  CP2_8 : vec3<f32>,  CP3_6 : vec3<f32>,  CP4_4 : vec3<f32>,  CP5_2 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(EvaluateBezier_Quartic_0(t_7.x, CP1_8.x, CP2_8.x, CP3_6.x, CP4_4.x, CP5_2.x), EvaluateBezier_Quartic_0(t_7.y, CP1_8.y, CP2_8.y, CP3_6.y, CP4_4.y, CP5_2.y), EvaluateBezier_Quartic_0(t_7.z, CP1_8.z, CP2_8.z, CP3_6.z, CP4_4.z, CP5_2.z));
}

fn EvaluateBezier_Quintic_0( t_8 : f32,  CP1_9 : f32,  CP2_9 : f32,  CP3_7 : f32,  CP4_5 : f32,  CP5_3 : f32,  CP6_1 : f32) -> f32
{
    var s_3 : f32 = 1.0f - t_8;
    return CP1_9 * s_3 * s_3 * s_3 * s_3 * s_3 + 5.0f * CP2_9 * s_3 * s_3 * s_3 * t_8 * s_3 + 10.0f * CP3_7 * s_3 * s_3 * t_8 * t_8 * s_3 + 10.0f * CP4_5 * s_3 * s_3 * t_8 * t_8 * t_8 + 5.0f * CP5_3 * s_3 * t_8 * t_8 * t_8 * t_8 + CP6_1 * t_8 * t_8 * t_8 * t_8 * t_8;
}

fn EvaluateBezier_Quintic_float3_0( t_9 : vec3<f32>,  CP1_10 : vec3<f32>,  CP2_10 : vec3<f32>,  CP3_8 : vec3<f32>,  CP4_6 : vec3<f32>,  CP5_4 : vec3<f32>,  CP6_2 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(EvaluateBezier_Quintic_0(t_9.x, CP1_10.x, CP2_10.x, CP3_8.x, CP4_6.x, CP5_4.x, CP6_2.x), EvaluateBezier_Quintic_0(t_9.y, CP1_10.y, CP2_10.y, CP3_8.y, CP4_6.y, CP5_4.y, CP6_2.y), EvaluateBezier_Quintic_0(t_9.z, CP1_10.z, CP2_10.z, CP3_8.z, CP4_6.z, CP5_4.z, CP6_2.z));
}

fn EvaluatePolynomial_0( t_10 : vec3<f32>) -> vec3<f32>
{
    switch(_Transform_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return EvaluateBezier_Linear_float3_0(t_10, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0);
        }
    case i32(1), :
        {
            return EvaluateBezier_Quadratic_float3_0(t_10, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0);
        }
    case i32(2), :
        {
            return EvaluateBezier_Cubic_float3_0(t_10, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0, _Transform_0CB.CP4_0);
        }
    case i32(3), :
        {
            return EvaluateBezier_Quartic_float3_0(t_10, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0, _Transform_0CB.CP4_0, _Transform_0CB.CP5_0);
        }
    case i32(4), :
        {
            return EvaluateBezier_Quintic_float3_0(t_10, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0, _Transform_0CB.CP4_0, _Transform_0CB.CP5_0, _Transform_0CB.CP6_0);
        }
    case default, :
        {
            break;
        }
    }
    return vec3<f32>(0.0f);
}

fn DeCasteljauTexture_Read_Linear_0( tex_0 : texture_2d<f32>,  t_11 : f32,  LinearSampler_0 : sampler) -> f32
{
    return (textureSampleLevel((tex_0), (LinearSampler_0), (mix(vec2<f32>(0.25f, 0.25f), vec2<f32>(0.75f, 0.25f), vec2<f32>(t_11))), (0.0f)).x);
}

fn DeCasteljauTexture_Read_Linear_float3_0( t_12 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(DeCasteljauTexture_Read_Linear_0(DCTexture2D, t_12.x, LinearSampler), DeCasteljauTexture_Read_Linear_0(DCTexture2D, t_12.y, LinearSampler), DeCasteljauTexture_Read_Linear_0(DCTexture2D, t_12.z, LinearSampler));
}

fn DeCasteljauTexture_Read_Quadratic_0( tex_1 : texture_2d<f32>,  t_13 : f32,  LinearSampler_1 : sampler) -> f32
{
    return (textureSampleLevel((tex_1), (LinearSampler_1), (mix(vec2<f32>(0.25f, 0.25f), vec2<f32>(0.75f, 0.75f), vec2<f32>(t_13))), (0.0f)).x);
}

fn DeCasteljauTexture_Read_Quadratic_float3_0( t_14 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(DeCasteljauTexture_Read_Quadratic_0(DCTexture2D, t_14.x, LinearSampler), DeCasteljauTexture_Read_Quadratic_0(DCTexture2D, t_14.y, LinearSampler), DeCasteljauTexture_Read_Quadratic_0(DCTexture2D, t_14.z, LinearSampler));
}

fn DeCasteljauTexture_Read_Cubic_0( tex_2 : texture_3d<f32>,  t_15 : f32,  LinearSampler_2 : sampler) -> f32
{
    var dims_0 : vec3<u32>;
    var _S1 : u32 = dims_0[i32(0)];
    var _S2 : u32 = dims_0[i32(1)];
    var _S3 : u32 = dims_0[i32(2)];
    {var dim = textureDimensions((tex_2));((_S1)) = dim.x;((_S2)) = dim.y;((_S3)) = dim.z;};
    dims_0[i32(0)] = _S1;
    dims_0[i32(1)] = _S2;
    dims_0[i32(2)] = _S3;
    return (textureSampleLevel((tex_2), (LinearSampler_2), ((mix(vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>(1.0f, 1.0f, 1.0f), vec3<f32>(t_15)) + vec3<f32>(0.5f, 0.5f, 0.5f)) / vec3<f32>(dims_0)), (0.0f)).x);
}

fn DeCasteljauTexture_Read_Cubic_float3_0( t_16 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(DeCasteljauTexture_Read_Cubic_0(DCTexture3D, t_16.x, LinearSampler), DeCasteljauTexture_Read_Cubic_0(DCTexture3D, t_16.y, LinearSampler), DeCasteljauTexture_Read_Cubic_0(DCTexture3D, t_16.z, LinearSampler));
}

fn DeCasteljauTexture_Read_Quartic_0( tex_3 : texture_3d<f32>,  t_17 : f32,  LinearSampler_3 : sampler) -> f32
{
    var dims_1 : vec3<u32>;
    var _S4 : u32 = dims_1[i32(0)];
    var _S5 : u32 = dims_1[i32(1)];
    var _S6 : u32 = dims_1[i32(2)];
    {var dim = textureDimensions((tex_3));((_S4)) = dim.x;((_S5)) = dim.y;((_S6)) = dim.z;};
    dims_1[i32(0)] = _S4;
    dims_1[i32(1)] = _S5;
    dims_1[i32(2)] = _S6;
    var _S7 : vec3<f32> = vec3<f32>(t_17);
    const _S8 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    return mix((textureSampleLevel((tex_3), (LinearSampler_3), ((mix(vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>(1.0f, 1.0f, 1.0f), _S7) + _S8) / vec3<f32>(dims_1)), (0.0f)).x), (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(vec3<f32>(0.0f, 0.0f, 1.0f), vec3<f32>(1.0f, 1.0f, 2.0f), _S7) + _S8) / vec3<f32>(dims_1)), (0.0f)).x), t_17);
}

fn DeCasteljauTexture_Read_Quartic_float3_0( t_18 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(DeCasteljauTexture_Read_Quartic_0(DCTexture3D, t_18.x, LinearSampler), DeCasteljauTexture_Read_Quartic_0(DCTexture3D, t_18.y, LinearSampler), DeCasteljauTexture_Read_Quartic_0(DCTexture3D, t_18.z, LinearSampler));
}

fn DeCasteljauTexture_Read_Quintic_0( tex_4 : texture_3d<f32>,  t_19 : f32,  LinearSampler_4 : sampler) -> f32
{
    var dims_2 : vec3<u32>;
    var _S9 : u32 = dims_2[i32(0)];
    var _S10 : u32 = dims_2[i32(1)];
    var _S11 : u32 = dims_2[i32(2)];
    {var dim = textureDimensions((tex_4));((_S9)) = dim.x;((_S10)) = dim.y;((_S11)) = dim.z;};
    dims_2[i32(0)] = _S9;
    dims_2[i32(1)] = _S10;
    dims_2[i32(2)] = _S11;
    var _S12 : vec3<f32> = vec3<f32>(t_19);
    const _S13 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    var s_4 : f32 = 1.0f - t_19;
    return (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>(1.0f, 1.0f, 1.0f), _S12) + _S13) / vec3<f32>(dims_2)), (0.0f)).x) * s_4 * s_4 + 2.0f * (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(vec3<f32>(0.0f, 0.0f, 1.0f), vec3<f32>(1.0f, 1.0f, 2.0f), _S12) + _S13) / vec3<f32>(dims_2)), (0.0f)).x) * s_4 * t_19 + (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(vec3<f32>(0.0f, 0.0f, 2.0f), vec3<f32>(1.0f, 1.0f, 3.0f), _S12) + _S13) / vec3<f32>(dims_2)), (0.0f)).x) * t_19 * t_19;
}

fn DeCasteljauTexture_Read_Quintic_float3_0( t_20 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(DeCasteljauTexture_Read_Quintic_0(DCTexture3D, t_20.x, LinearSampler), DeCasteljauTexture_Read_Quintic_0(DCTexture3D, t_20.y, LinearSampler), DeCasteljauTexture_Read_Quintic_0(DCTexture3D, t_20.z, LinearSampler));
}

fn EvaluateTextureDeCasteljau_0( t_21 : vec3<f32>) -> vec3<f32>
{
    switch(_Transform_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return DeCasteljauTexture_Read_Linear_float3_0(t_21);
        }
    case i32(1), :
        {
            return DeCasteljauTexture_Read_Quadratic_float3_0(t_21);
        }
    case i32(2), :
        {
            return DeCasteljauTexture_Read_Cubic_float3_0(t_21);
        }
    case i32(3), :
        {
            return DeCasteljauTexture_Read_Quartic_float3_0(t_21);
        }
    case i32(4), :
        {
            return DeCasteljauTexture_Read_Quintic_float3_0(t_21);
        }
    case default, :
        {
            break;
        }
    }
    return vec3<f32>(0.0f);
}

fn SeilerTexture_Read_Linear_0( tex_5 : texture_2d<f32>,  t_22 : f32,  LinearSampler_5 : sampler) -> f32
{
    return (textureSampleLevel((tex_5), (LinearSampler_5), (mix(vec2<f32>(0.25f, 0.25f), vec2<f32>(0.75f, 0.75f), vec2<f32>(t_22, 0.0f))), (0.0f)).x);
}

fn SeilerTexture_Read_Linear_float3_0( t_23 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(SeilerTexture_Read_Linear_0(SeilerTexture2D, t_23.x, LinearSampler), SeilerTexture_Read_Linear_0(SeilerTexture2D, t_23.y, LinearSampler), SeilerTexture_Read_Linear_0(SeilerTexture2D, t_23.z, LinearSampler));
}

fn SeilerTexture_Read_Quadratic_0( tex_6 : texture_2d<f32>,  t_24 : f32,  LinearSampler_6 : sampler) -> f32
{
    return (textureSampleLevel((tex_6), (LinearSampler_6), (mix(vec2<f32>(0.25f, 0.25f), vec2<f32>(0.75f, 0.75f), vec2<f32>(t_24, (1.0f - t_24) * t_24))), (0.0f)).x);
}

fn SeilerTexture_Read_Quadratic_float3_0( t_25 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(SeilerTexture_Read_Quadratic_0(SeilerTexture2D, t_25.x, LinearSampler), SeilerTexture_Read_Quadratic_0(SeilerTexture2D, t_25.y, LinearSampler), SeilerTexture_Read_Quadratic_0(SeilerTexture2D, t_25.z, LinearSampler));
}

fn SeilerTexture_Read_Cubic_0( tex_7 : texture_2d<f32>,  t_26 : f32,  LinearSampler_7 : sampler) -> f32
{
    return (textureSampleLevel((tex_7), (LinearSampler_7), (mix(vec2<f32>(0.25f, 0.25f), vec2<f32>(0.75f, 0.75f), vec2<f32>(t_26, (1.0f - t_26) * t_26))), (0.0f)).x);
}

fn SeilerTexture_Read_Cubic_float3_0( t_27 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(SeilerTexture_Read_Cubic_0(SeilerTexture2D, t_27.x, LinearSampler), SeilerTexture_Read_Cubic_0(SeilerTexture2D, t_27.y, LinearSampler), SeilerTexture_Read_Cubic_0(SeilerTexture2D, t_27.z, LinearSampler));
}

fn SeilerTexture_Read_Quartic_0( tex_8 : texture_3d<f32>,  t_28 : f32,  LinearSampler_8 : sampler) -> f32
{
    var dims_3 : vec3<u32>;
    var _S14 : u32 = dims_3[i32(0)];
    var _S15 : u32 = dims_3[i32(1)];
    var _S16 : u32 = dims_3[i32(2)];
    {var dim = textureDimensions((tex_8));((_S14)) = dim.x;((_S15)) = dim.y;((_S16)) = dim.z;};
    dims_3[i32(0)] = _S14;
    dims_3[i32(1)] = _S15;
    dims_3[i32(2)] = _S16;
    var _S17 : f32 = (1.0f - t_28) * t_28;
    return (textureSampleLevel((tex_8), (LinearSampler_8), ((mix(vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>(1.0f, 1.0f, 1.0f), vec3<f32>(t_28, _S17, _S17)) + vec3<f32>(0.5f, 0.5f, 0.5f)) / vec3<f32>(dims_3)), (0.0f)).x);
}

fn SeilerTexture_Read_Quartic_float3_0( t_29 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(SeilerTexture_Read_Quartic_0(SeilerTexture3D, t_29.x, LinearSampler), SeilerTexture_Read_Quartic_0(SeilerTexture3D, t_29.y, LinearSampler), SeilerTexture_Read_Quartic_0(SeilerTexture3D, t_29.z, LinearSampler));
}

fn SeilerTexture_Read_Quintic_0( tex_9 : texture_3d<f32>,  t_30 : f32,  LinearSampler_9 : sampler) -> f32
{
    var dims_4 : vec3<u32>;
    var _S18 : u32 = dims_4[i32(0)];
    var _S19 : u32 = dims_4[i32(1)];
    var _S20 : u32 = dims_4[i32(2)];
    {var dim = textureDimensions((tex_9));((_S18)) = dim.x;((_S19)) = dim.y;((_S20)) = dim.z;};
    dims_4[i32(0)] = _S18;
    dims_4[i32(1)] = _S19;
    dims_4[i32(2)] = _S20;
    var _S21 : f32 = (1.0f - t_30) * t_30;
    return (textureSampleLevel((tex_9), (LinearSampler_9), ((mix(vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>(1.0f, 1.0f, 1.0f), vec3<f32>(t_30, _S21, _S21)) + vec3<f32>(0.5f, 0.5f, 0.5f)) / vec3<f32>(dims_4)), (0.0f)).x);
}

fn SeilerTexture_Read_Quintic_float3_0( t_31 : vec3<f32>) -> vec3<f32>
{
    return vec3<f32>(SeilerTexture_Read_Quintic_0(SeilerTexture3D, t_31.x, LinearSampler), SeilerTexture_Read_Quintic_0(SeilerTexture3D, t_31.y, LinearSampler), SeilerTexture_Read_Quintic_0(SeilerTexture3D, t_31.z, LinearSampler));
}

fn EvaluateTextureSeiler_0( t_32 : vec3<f32>) -> vec3<f32>
{
    switch(_Transform_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return SeilerTexture_Read_Linear_float3_0(t_32);
        }
    case i32(1), :
        {
            return SeilerTexture_Read_Quadratic_float3_0(t_32);
        }
    case i32(2), :
        {
            return SeilerTexture_Read_Cubic_float3_0(t_32);
        }
    case i32(3), :
        {
            return SeilerTexture_Read_Quartic_float3_0(t_32);
        }
    case i32(4), :
        {
            return SeilerTexture_Read_Quintic_float3_0(t_32);
        }
    case default, :
        {
            break;
        }
    }
    return vec3<f32>(0.0f);
}

fn LinearToSRGB_0( linearCol_0 : vec3<f32>) -> vec3<f32>
{
    var sRGBLo_0 : vec3<f32> = linearCol_0 * vec3<f32>(12.92000007629394531f);
    var sRGBHi_0 : vec3<f32> = pow(abs(linearCol_0), vec3<f32>(0.4166666567325592f, 0.4166666567325592f, 0.4166666567325592f)) * vec3<f32>(1.0549999475479126f) - vec3<f32>(0.05499999970197678f);
    var sRGB_0 : vec3<f32>;
    var _S22 : f32;
    if((linearCol_0.x) <= 0.00313080009073019f)
    {
        _S22 = sRGBLo_0.x;
    }
    else
    {
        _S22 = sRGBHi_0.x;
    }
    sRGB_0[i32(0)] = _S22;
    if((linearCol_0.y) <= 0.00313080009073019f)
    {
        _S22 = sRGBLo_0.y;
    }
    else
    {
        _S22 = sRGBHi_0.y;
    }
    sRGB_0[i32(1)] = _S22;
    if((linearCol_0.z) <= 0.00313080009073019f)
    {
        _S22 = sRGBLo_0.z;
    }
    else
    {
        _S22 = sRGBHi_0.z;
    }
    sRGB_0[i32(2)] = _S22;
    return sRGB_0;
}

@compute
@workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) DTid_0 : vec3<u32>)
{
    var px_0 : vec2<u32> = DTid_0.xy;
    var _S23 : vec3<i32> = vec3<i32>(vec3<u32>(px_0, u32(0)));
    var color_0 : vec3<f32> = (textureLoad((Input), ((_S23)).xy, ((_S23)).z)).xyz;
    var color_1 : vec3<f32>;
    switch(_Transform_0CB.CurveType_0)
    {
    case i32(0), :
        {
            color_1 = EvaluatePolynomial_0(color_0);
            break;
        }
    case i32(1), :
        {
            color_1 = EvaluateTextureDeCasteljau_0(color_0);
            break;
        }
    case i32(2), :
        {
            color_1 = EvaluateTextureSeiler_0(color_0);
            break;
        }
    case default, :
        {
            color_1 = vec3<f32>(1.0f, 0.0f, 1.0f);
            break;
        }
    }
    textureStore((Output), (px_0), (vec4<f32>(LinearToSRGB_0(color_1), 1.0f)));
    return;
}

`;

// Shader code for Compute shader "MakeCurveTextures_0", node "MakeCurveTextures"
static ShaderCode_MakeCurveTextures_MakeCurveTextures_0 = `
#define __GigiDispatchMultiply uint3(1,1,1)
#define __GigiDispatchDivide uint3(1,1,1)
#define __GigiDispatchPreAdd uint3(0,0,0)
#define __GigiDispatchPostAdd uint3(0,0,0)
#define GIGI_SCENE_IS_BVH 0
// Unnamed technique, shader MakeCurveTextures
#define InterlockedAdd(value, param, oldValue) oldValue = value.add(param)
#define InterlockedAnd(value, param, oldValue) oldValue = value.and(param)
#define InterlockedMax(value, param, oldValue) oldValue = value.max(param)
#define InterlockedMin(value, param, oldValue) oldValue = value.min(param)
#define InterlockedOr(value, param, oldValue) oldValue = value.or(param)
#define InterlockedXor(value, param, oldValue) oldValue = value.xor(param)


struct CurveOrders
{
    static const int Linear = 0;
    static const int Quadratic = 1;
    static const int Cubic = 2;
    static const int Quartic = 3;
    static const int Quintic = 4;
};

struct CurveTypes
{
    static const int Polynomial = 0;
    static const int TextureDeCasteljau = 1;
    static const int TextureSeiler = 2;
};

struct Struct__MakeCurveTextures_0CB
{
    float3 CP1;
    float _padding0;
    float3 CP2;
    float _padding1;
    float3 CP3;
    float _padding2;
    float3 CP4;
    float _padding3;
    float3 CP5;
    float _padding4;
    float3 CP6;
    int CurveOrder;
};

[[vk::binding(0)]]
RWTexture2D<float> DCTexture2D : register(u0);
[[vk::binding(1)]]
RWTexture3D<float> DCTexture3D : register(u1);
[[vk::binding(2)]]
RWTexture2D<float> SeilerTexture2D : register(u2);
[[vk::binding(3)]]
RWTexture3D<float> SeilerTexture3D : register(u3);
[[vk::binding(4)]]
RWTexture2D<float> DCTexture2DReadOnly : register(u4);
[[vk::binding(5)]]
RWTexture3D<float> DCTexture3DReadOnly : register(u5);
[[vk::binding(6)]]
RWTexture2D<float> SeilerTexture2DReadOnly : register(u6);
[[vk::binding(7)]]
RWTexture3D<float> SeilerTexture3DReadOnly : register(u7);
[[vk::binding(8)]]
ConstantBuffer<Struct__MakeCurveTextures_0CB> _MakeCurveTextures_0CB : register(b8);

#line 2


#include "DeCasteljauTexture.hlsli"
#include "SeilerTexture.hlsli"

void MakeLinear()
{
    DeCasteljauTexture_Write_Linear(DCTexture2D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2);
    SeilerTexture_Write_Linear(SeilerTexture2D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2);
}

void MakeQuadratic()
{
    DeCasteljauTexture_Write_Quadratic(DCTexture2D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3);
    SeilerTexture_Write_Quadratic(SeilerTexture2D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3);
}

void MakeCubic()
{
    DeCasteljauTexture_Write_Cubic(DCTexture3D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3, _MakeCurveTextures_0CB.CP4);
    SeilerTexture_Write_Cubic(SeilerTexture2D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3, _MakeCurveTextures_0CB.CP4);
}

void MakeQuartic()
{
    DeCasteljauTexture_Write_Quartic(DCTexture3D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3, _MakeCurveTextures_0CB.CP4, _MakeCurveTextures_0CB.CP5);
    SeilerTexture_Write_Quartic(SeilerTexture3D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3, _MakeCurveTextures_0CB.CP4, _MakeCurveTextures_0CB.CP5);
}

void MakeQuintic()
{
    DeCasteljauTexture_Write_Quintic(DCTexture3D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3, _MakeCurveTextures_0CB.CP4, _MakeCurveTextures_0CB.CP5, _MakeCurveTextures_0CB.CP6);
    SeilerTexture_Write_Quintic(SeilerTexture3D, _MakeCurveTextures_0CB.CP1, _MakeCurveTextures_0CB.CP2, _MakeCurveTextures_0CB.CP3, _MakeCurveTextures_0CB.CP4, _MakeCurveTextures_0CB.CP5, _MakeCurveTextures_0CB.CP6);
}

[numthreads(1, 1, 1)]
#line 37
void main(uint3 DTid : SV_DispatchThreadID)
{
    if (DTid.x > 0 || DTid.y > 0 || DTid.z > 0)
        return;

    switch (_MakeCurveTextures_0CB.CurveOrder)
    {
        case CurveOrders::Linear: MakeLinear(); break;
        case CurveOrders::Quadratic: MakeQuadratic(); break;
        case CurveOrders::Cubic: MakeCubic(); break;
        case CurveOrders::Quartic: MakeQuartic(); break;
        case CurveOrders::Quintic: MakeQuintic(); break;
    }
}

/*
Shader Resources:
    Texture DCTexture2D (as UAV)
    Texture DCTexture3D (as UAV)
    Texture SeilerTexture2D (as UAV)
    Texture SeilerTexture3D (as UAV)
*/
`;

// -------------------- Enums

static Enum_CurveOrders =
{
    Linear: 0,
    Quadratic: 1,
    Cubic: 2,
    Quartic: 3,
    Quintic: 4,
    _count: 5,
}

static Enum_CurveTypes =
{
    Polynomial: 0,
    TextureDeCasteljau: 1,
    TextureSeiler: 2,
    _count: 3,
}

// -------------------- Private Members

// Texture Output
texture_Output = null;
texture_Output_size = [0, 0, 0];
texture_Output_format = "";
texture_Output_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture DCTexture2D
texture_DCTexture2D = null;
texture_DCTexture2D_size = [0, 0, 0];
texture_DCTexture2D_format = "";
texture_DCTexture2D_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING;

// Texture SeilerTexture2D
texture_SeilerTexture2D = null;
texture_SeilerTexture2D_size = [0, 0, 0];
texture_SeilerTexture2D_format = "";
texture_SeilerTexture2D_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING;

// Texture SeilerTexture3D
texture_SeilerTexture3D = null;
texture_SeilerTexture3D_size = [0, 0, 0];
texture_SeilerTexture3D_format = "";
texture_SeilerTexture3D_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING;

// Texture DCTexture3D
texture_DCTexture3D = null;
texture_DCTexture3D_size = [0, 0, 0];
texture_DCTexture3D_format = "";
texture_DCTexture3D_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING;

// Texture Transform_Output_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_Transform_Output_ReadOnly = null;
texture_Transform_Output_ReadOnly_size = [0, 0, 0];
texture_Transform_Output_ReadOnly_format = "";
texture_Transform_Output_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture MakeCurveTextures_DCTexture2D_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_MakeCurveTextures_DCTexture2D_ReadOnly = null;
texture_MakeCurveTextures_DCTexture2D_ReadOnly_size = [0, 0, 0];
texture_MakeCurveTextures_DCTexture2D_ReadOnly_format = "";
texture_MakeCurveTextures_DCTexture2D_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture MakeCurveTextures_DCTexture3D_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_MakeCurveTextures_DCTexture3D_ReadOnly = null;
texture_MakeCurveTextures_DCTexture3D_ReadOnly_size = [0, 0, 0];
texture_MakeCurveTextures_DCTexture3D_ReadOnly_format = "";
texture_MakeCurveTextures_DCTexture3D_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture MakeCurveTextures_SeilerTexture2D_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_MakeCurveTextures_SeilerTexture2D_ReadOnly = null;
texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_size = [0, 0, 0];
texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format = "";
texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture MakeCurveTextures_SeilerTexture3D_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_MakeCurveTextures_SeilerTexture3D_ReadOnly = null;
texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_size = [0, 0, 0];
texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format = "";
texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Constant buffer _Transform_0CB
constantBuffer__Transform_0CB = null;
constantBuffer__Transform_0CB_size = 112;
constantBuffer__Transform_0CB_usageFlags = GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM;

// Constant buffer _MakeCurveTextures_0CB
constantBuffer__MakeCurveTextures_0CB = null;
constantBuffer__MakeCurveTextures_0CB_size = 96;
constantBuffer__MakeCurveTextures_0CB_usageFlags = GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM;

// Compute Shader MakeCurveTextures
Hash_Compute_MakeCurveTextures = 0;
ShaderModule_Compute_MakeCurveTextures = null;
BindGroupLayout_Compute_MakeCurveTextures = null;
PipelineLayout_Compute_MakeCurveTextures = null;
Pipeline_Compute_MakeCurveTextures = null;

// Compute Shader Transform
Hash_Compute_Transform = 0;
ShaderModule_Compute_Transform = null;
BindGroupLayout_Compute_Transform = null;
PipelineLayout_Compute_Transform = null;
Pipeline_Compute_Transform = null;

// -------------------- Imported Members

// Texture Input
texture_Input = null;
texture_Input_size = [0, 0, 0];
texture_Input_format = "";
texture_Input_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING;

// -------------------- Public Variables

variable_CurveType = this.constructor.Enum_CurveTypes.Polynomial;
variableDefault_CurveType = this.constructor.Enum_CurveTypes.Polynomial;
variableChanged_CurveType = false;
variable_CurveOrder = this.constructor.Enum_CurveOrders.Quintic;
variableDefault_CurveOrder = this.constructor.Enum_CurveOrders.Quintic;
variableChanged_CurveOrder = false;
variable_CP1 = [ 0., 0., 0. ];
variableDefault_CP1 = [ 0., 0., 0. ];
variableChanged_CP1 = [ false, false, false ];
variable_CP2 = [ 0.200000003, 0.200000003, 0.200000003 ];
variableDefault_CP2 = [ 0.200000003, 0.200000003, 0.200000003 ];
variableChanged_CP2 = [ false, false, false ];
variable_CP3 = [ 0.400000006, 0.400000006, 0.400000006 ];
variableDefault_CP3 = [ 0.400000006, 0.400000006, 0.400000006 ];
variableChanged_CP3 = [ false, false, false ];
variable_CP4 = [ 0.600000024, 0.600000024, 0.600000024 ];
variableDefault_CP4 = [ 0.600000024, 0.600000024, 0.600000024 ];
variableChanged_CP4 = [ false, false, false ];
variable_CP5 = [ 0.800000012, 0.800000012, 0.800000012 ];
variableDefault_CP5 = [ 0.800000012, 0.800000012, 0.800000012 ];
variableChanged_CP5 = [ false, false, false ];
variable_CP6 = [ 1., 1., 1. ];
variableDefault_CP6 = [ 1., 1., 1. ];
variableChanged_CP6 = [ false, false, false ];
variable_NormalizedCPs = false;  // When clicked, makes a linear no-op curve out of the control points
variableDefault_NormalizedCPs = false;  // When clicked, makes a linear no-op curve out of the control points
variableChanged_NormalizedCPs = false;

// -------------------- Private Variables

variable_NumCPsMinus1Float = 0.;
variableDefault_NumCPsMinus1Float = 0.;
variableChanged_NumCPsMinus1Float = false;
// -------------------- Structs

static StructOffsets__Transform_0CB =
{
    CP1_0: 0,
    CP1_1: 4,
    CP1_2: 8,
    _padding0: 12,
    CP2_0: 16,
    CP2_1: 20,
    CP2_2: 24,
    _padding1: 28,
    CP3_0: 32,
    CP3_1: 36,
    CP3_2: 40,
    _padding2: 44,
    CP4_0: 48,
    CP4_1: 52,
    CP4_2: 56,
    _padding3: 60,
    CP5_0: 64,
    CP5_1: 68,
    CP5_2: 72,
    _padding4: 76,
    CP6_0: 80,
    CP6_1: 84,
    CP6_2: 88,
    CurveOrder: 92,
    CurveType: 96,
    _padding5: 100,
    _padding6: 104,
    _padding7: 108,
    _size: 112,
}

static StructOffsets__MakeCurveTextures_0CB =
{
    CP1_0: 0,
    CP1_1: 4,
    CP1_2: 8,
    _padding0: 12,
    CP2_0: 16,
    CP2_1: 20,
    CP2_2: 24,
    _padding1: 28,
    CP3_0: 32,
    CP3_1: 36,
    CP3_2: 40,
    _padding2: 44,
    CP4_0: 48,
    CP4_1: 52,
    CP4_2: 56,
    _padding3: 60,
    CP5_0: 64,
    CP5_1: 68,
    CP5_2: 72,
    _padding4: 76,
    CP6_0: 80,
    CP6_1: 84,
    CP6_2: 88,
    CurveOrder: 92,
    _size: 96,
}


async SetVarsBefore()
{
    if (this.variable_CurveOrder == this.constructor.Enum_CurveOrders.Linear)
    {
        this.variableChanged_NumCPsMinus1Float = true;
        this.variable_NumCPsMinus1Float = 1;
    }

    if (this.variable_CurveOrder == this.constructor.Enum_CurveOrders.Quadratic)
    {
        this.variableChanged_NumCPsMinus1Float = true;
        this.variable_NumCPsMinus1Float = 2;
    }

    if (this.variable_CurveOrder == this.constructor.Enum_CurveOrders.Cubic)
    {
        this.variableChanged_NumCPsMinus1Float = true;
        this.variable_NumCPsMinus1Float = 3;
    }

    if (this.variable_CurveOrder == this.constructor.Enum_CurveOrders.Quartic)
    {
        this.variableChanged_NumCPsMinus1Float = true;
        this.variable_NumCPsMinus1Float = 4;
    }

    if (this.variable_CurveOrder == this.constructor.Enum_CurveOrders.Quintic)
    {
        this.variableChanged_NumCPsMinus1Float = true;
        this.variable_NumCPsMinus1Float = 5;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP1[0] = true;
        this.variable_CP1[0] = 0.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP1[1] = true;
        this.variable_CP1[1] = 0.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP1[2] = true;
        this.variable_CP1[2] = 0.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP2[0] = true;
        this.variable_CP2[0] = 1.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP2[1] = true;
        this.variable_CP2[1] = 1.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP2[2] = true;
        this.variable_CP2[2] = 1.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP3[0] = true;
        this.variable_CP3[0] = 2.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP3[1] = true;
        this.variable_CP3[1] = 2.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP3[2] = true;
        this.variable_CP3[2] = 2.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP4[0] = true;
        this.variable_CP4[0] = 3.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP4[1] = true;
        this.variable_CP4[1] = 3.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP4[2] = true;
        this.variable_CP4[2] = 3.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP5[0] = true;
        this.variable_CP5[0] = 4.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP5[1] = true;
        this.variable_CP5[1] = 4.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP5[2] = true;
        this.variable_CP5[2] = 4.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP6[0] = true;
        this.variable_CP6[0] = 5.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP6[1] = true;
        this.variable_CP6[1] = 5.0 /     this.variable_NumCPsMinus1Float;
    }

    if (this.variable_NormalizedCPs)
    {
        this.variableChanged_CP6[2] = true;
        this.variable_CP6[2] = 5.0 /     this.variable_NumCPsMinus1Float;
    }


}

async SetVarsAfter()
{

}

async ValidateImports()
{
    // Validate texture Input
    if (this.texture_Input === null)
    {
        Shared.LogError("Imported resource texture_Input was not provided");
        return false;
    }

    return true;
}

async Init(device, encoder, useBlockingAPIs)
{
    // Handle (re)creation of texture Output
    {
        const baseSize = this.texture_Input_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_Input_format;
        if (this.texture_Output !== null && (this.texture_Output_format != desiredFormat || this.texture_Output_size[0] != desiredSize[0] || this.texture_Output_size[1] != desiredSize[1] || this.texture_Output_size[2] != desiredSize[2]))
        {
            this.texture_Output.destroy();
            this.texture_Output = null;
        }

        if (this.texture_Output === null)
        {
            this.texture_Output_size = desiredSize.slice();
            this.texture_Output_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_Output_format))
                viewFormats.push(this.texture_Output_format);

            this.texture_Output = device.createTexture({
                label: "texture ColorGrading.Output",
                size: this.texture_Output_size,
                format: Shared.GetNonSRGBFormat(this.texture_Output_format),
                usage: this.texture_Output_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture DCTexture2D
    {
        const baseSize = [ 1, 1, 1 ];
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = "r32float";
        if (this.texture_DCTexture2D !== null && (this.texture_DCTexture2D_format != desiredFormat || this.texture_DCTexture2D_size[0] != desiredSize[0] || this.texture_DCTexture2D_size[1] != desiredSize[1] || this.texture_DCTexture2D_size[2] != desiredSize[2]))
        {
            this.texture_DCTexture2D.destroy();
            this.texture_DCTexture2D = null;
        }

        if (this.texture_DCTexture2D === null)
        {
            this.texture_DCTexture2D_size = desiredSize.slice();
            this.texture_DCTexture2D_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_DCTexture2D_format))
                viewFormats.push(this.texture_DCTexture2D_format);

            this.texture_DCTexture2D = device.createTexture({
                label: "texture ColorGrading.DCTexture2D",
                size: this.texture_DCTexture2D_size,
                format: Shared.GetNonSRGBFormat(this.texture_DCTexture2D_format),
                usage: this.texture_DCTexture2D_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture SeilerTexture2D
    {
        const baseSize = [ 1, 1, 1 ];
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_DCTexture2D_format;
        if (this.texture_SeilerTexture2D !== null && (this.texture_SeilerTexture2D_format != desiredFormat || this.texture_SeilerTexture2D_size[0] != desiredSize[0] || this.texture_SeilerTexture2D_size[1] != desiredSize[1] || this.texture_SeilerTexture2D_size[2] != desiredSize[2]))
        {
            this.texture_SeilerTexture2D.destroy();
            this.texture_SeilerTexture2D = null;
        }

        if (this.texture_SeilerTexture2D === null)
        {
            this.texture_SeilerTexture2D_size = desiredSize.slice();
            this.texture_SeilerTexture2D_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_SeilerTexture2D_format))
                viewFormats.push(this.texture_SeilerTexture2D_format);

            this.texture_SeilerTexture2D = device.createTexture({
                label: "texture ColorGrading.SeilerTexture2D",
                size: this.texture_SeilerTexture2D_size,
                format: Shared.GetNonSRGBFormat(this.texture_SeilerTexture2D_format),
                usage: this.texture_SeilerTexture2D_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture SeilerTexture3D
    {
        const baseSize = [ 1, 1, 1 ];
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 2) / 1) + 0
        ];
        const desiredFormat = this.texture_DCTexture2D_format;
        if (this.texture_SeilerTexture3D !== null && (this.texture_SeilerTexture3D_format != desiredFormat || this.texture_SeilerTexture3D_size[0] != desiredSize[0] || this.texture_SeilerTexture3D_size[1] != desiredSize[1] || this.texture_SeilerTexture3D_size[2] != desiredSize[2]))
        {
            this.texture_SeilerTexture3D.destroy();
            this.texture_SeilerTexture3D = null;
        }

        if (this.texture_SeilerTexture3D === null)
        {
            this.texture_SeilerTexture3D_size = desiredSize.slice();
            this.texture_SeilerTexture3D_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_SeilerTexture3D_format))
                viewFormats.push(this.texture_SeilerTexture3D_format);

            this.texture_SeilerTexture3D = device.createTexture({
                label: "texture ColorGrading.SeilerTexture3D",
                size: this.texture_SeilerTexture3D_size,
                format: Shared.GetNonSRGBFormat(this.texture_SeilerTexture3D_format),
                usage: this.texture_SeilerTexture3D_usageFlags,
                viewFormats: viewFormats,
                dimension: "3d",
            });
        }
    }

    // Handle (re)creation of texture DCTexture3D
    {
        const baseSize = [ 1, 1, 1 ];
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 2) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 4) / 1) + 0
        ];
        const desiredFormat = this.texture_DCTexture2D_format;
        if (this.texture_DCTexture3D !== null && (this.texture_DCTexture3D_format != desiredFormat || this.texture_DCTexture3D_size[0] != desiredSize[0] || this.texture_DCTexture3D_size[1] != desiredSize[1] || this.texture_DCTexture3D_size[2] != desiredSize[2]))
        {
            this.texture_DCTexture3D.destroy();
            this.texture_DCTexture3D = null;
        }

        if (this.texture_DCTexture3D === null)
        {
            this.texture_DCTexture3D_size = desiredSize.slice();
            this.texture_DCTexture3D_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_DCTexture3D_format))
                viewFormats.push(this.texture_DCTexture3D_format);

            this.texture_DCTexture3D = device.createTexture({
                label: "texture ColorGrading.DCTexture3D",
                size: this.texture_DCTexture3D_size,
                format: Shared.GetNonSRGBFormat(this.texture_DCTexture3D_format),
                usage: this.texture_DCTexture3D_usageFlags,
                viewFormats: viewFormats,
                dimension: "3d",
            });
        }
    }

    // Handle (re)creation of texture Transform_Output_ReadOnly
    {
        const baseSize = this.texture_Output_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_Output_format;
        if (this.texture_Transform_Output_ReadOnly !== null && (this.texture_Transform_Output_ReadOnly_format != desiredFormat || this.texture_Transform_Output_ReadOnly_size[0] != desiredSize[0] || this.texture_Transform_Output_ReadOnly_size[1] != desiredSize[1] || this.texture_Transform_Output_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_Transform_Output_ReadOnly.destroy();
            this.texture_Transform_Output_ReadOnly = null;
        }

        if (this.texture_Transform_Output_ReadOnly === null)
        {
            this.texture_Transform_Output_ReadOnly_size = desiredSize.slice();
            this.texture_Transform_Output_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_Transform_Output_ReadOnly_format))
                viewFormats.push(this.texture_Transform_Output_ReadOnly_format);

            this.texture_Transform_Output_ReadOnly = device.createTexture({
                label: "texture ColorGrading.Transform_Output_ReadOnly",
                size: this.texture_Transform_Output_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_Transform_Output_ReadOnly_format),
                usage: this.texture_Transform_Output_ReadOnly_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture MakeCurveTextures_DCTexture2D_ReadOnly
    {
        const baseSize = this.texture_DCTexture2D_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_DCTexture2D_format;
        if (this.texture_MakeCurveTextures_DCTexture2D_ReadOnly !== null && (this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format != desiredFormat || this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_size[0] != desiredSize[0] || this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_size[1] != desiredSize[1] || this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_MakeCurveTextures_DCTexture2D_ReadOnly.destroy();
            this.texture_MakeCurveTextures_DCTexture2D_ReadOnly = null;
        }

        if (this.texture_MakeCurveTextures_DCTexture2D_ReadOnly === null)
        {
            this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_size = desiredSize.slice();
            this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format))
                viewFormats.push(this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format);

            this.texture_MakeCurveTextures_DCTexture2D_ReadOnly = device.createTexture({
                label: "texture ColorGrading.MakeCurveTextures_DCTexture2D_ReadOnly",
                size: this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format),
                usage: this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture MakeCurveTextures_DCTexture3D_ReadOnly
    {
        const baseSize = this.texture_DCTexture3D_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_DCTexture3D_format;
        if (this.texture_MakeCurveTextures_DCTexture3D_ReadOnly !== null && (this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format != desiredFormat || this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_size[0] != desiredSize[0] || this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_size[1] != desiredSize[1] || this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_MakeCurveTextures_DCTexture3D_ReadOnly.destroy();
            this.texture_MakeCurveTextures_DCTexture3D_ReadOnly = null;
        }

        if (this.texture_MakeCurveTextures_DCTexture3D_ReadOnly === null)
        {
            this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_size = desiredSize.slice();
            this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format))
                viewFormats.push(this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format);

            this.texture_MakeCurveTextures_DCTexture3D_ReadOnly = device.createTexture({
                label: "texture ColorGrading.MakeCurveTextures_DCTexture3D_ReadOnly",
                size: this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format),
                usage: this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_usageFlags,
                viewFormats: viewFormats,
                dimension: "3d",
            });
        }
    }

    // Handle (re)creation of texture MakeCurveTextures_SeilerTexture2D_ReadOnly
    {
        const baseSize = this.texture_SeilerTexture2D_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_SeilerTexture2D_format;
        if (this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly !== null && (this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format != desiredFormat || this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_size[0] != desiredSize[0] || this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_size[1] != desiredSize[1] || this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly.destroy();
            this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly = null;
        }

        if (this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly === null)
        {
            this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_size = desiredSize.slice();
            this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format))
                viewFormats.push(this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format);

            this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly = device.createTexture({
                label: "texture ColorGrading.MakeCurveTextures_SeilerTexture2D_ReadOnly",
                size: this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format),
                usage: this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture MakeCurveTextures_SeilerTexture3D_ReadOnly
    {
        const baseSize = this.texture_SeilerTexture3D_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_SeilerTexture3D_format;
        if (this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly !== null && (this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format != desiredFormat || this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_size[0] != desiredSize[0] || this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_size[1] != desiredSize[1] || this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly.destroy();
            this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly = null;
        }

        if (this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly === null)
        {
            this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_size = desiredSize.slice();
            this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format))
                viewFormats.push(this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format);

            this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly = device.createTexture({
                label: "texture ColorGrading.MakeCurveTextures_SeilerTexture3D_ReadOnly",
                size: this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format),
                usage: this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_usageFlags,
                viewFormats: viewFormats,
                dimension: "3d",
            });
        }
    }

    // (Re)create compute shader MakeCurveTextures
    {
        const bindGroupEntries =
        [
            {
                // DCTexture2D
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_DCTexture2D_format), viewDimension: "2d" }
            },
            {
                // DCTexture3D
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_DCTexture3D_format), viewDimension: "3d" }
            },
            {
                // SeilerTexture2D
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_SeilerTexture2D_format), viewDimension: "2d" }
            },
            {
                // SeilerTexture3D
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_SeilerTexture3D_format), viewDimension: "3d" }
            },
            {
                // DCTexture2DReadOnly
                binding: 4,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // DCTexture3DReadOnly
                binding: 5,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format), viewDimension: "3d" }
            },
            {
                // SeilerTexture2DReadOnly
                binding: 6,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // SeilerTexture3DReadOnly
                binding: 7,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format), viewDimension: "3d" }
            },
            {
                // _MakeCurveTextures_0CB
                binding: 8,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "uniform" }
            },
        ];

        let hashString = JSON.stringify(bindGroupEntries);
        const newHash = hashString.hashCode();

        if (this.ShaderModule_Compute_MakeCurveTextures === null || newHash !== this.Hash_Compute_MakeCurveTextures)
        {
            this.Hash_Compute_MakeCurveTextures = newHash;

            let shaderCode = class_ColorGrading.ShaderCode_MakeCurveTextures_MakeCurveTextures_0;
            shaderCode = shaderCode.replace("/*(DCTexture2D_format)*/", Shared.GetNonSRGBFormat(this.texture_DCTexture2D_format));
            shaderCode = shaderCode.replace("/*(DCTexture3D_format)*/", Shared.GetNonSRGBFormat(this.texture_DCTexture3D_format));
            shaderCode = shaderCode.replace("/*(SeilerTexture2D_format)*/", Shared.GetNonSRGBFormat(this.texture_SeilerTexture2D_format));
            shaderCode = shaderCode.replace("/*(SeilerTexture3D_format)*/", Shared.GetNonSRGBFormat(this.texture_SeilerTexture3D_format));
            shaderCode = shaderCode.replace("/*(DCTexture2DReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_DCTexture2D_ReadOnly_format));
            shaderCode = shaderCode.replace("/*(DCTexture3DReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_DCTexture3D_ReadOnly_format));
            shaderCode = shaderCode.replace("/*(SeilerTexture2DReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly_format));
            shaderCode = shaderCode.replace("/*(SeilerTexture3DReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly_format));

            this.ShaderModule_Compute_MakeCurveTextures = device.createShaderModule({ code: shaderCode, label: "Compute Shader MakeCurveTextures"});
            this.BindGroupLayout_Compute_MakeCurveTextures = device.createBindGroupLayout({
                label: "Compute Bind Group Layout MakeCurveTextures",
                entries: bindGroupEntries
            });

            this.PipelineLayout_Compute_MakeCurveTextures = device.createPipelineLayout({
                label: "Compute Pipeline Layout MakeCurveTextures",
                bindGroupLayouts: [this.BindGroupLayout_Compute_MakeCurveTextures],
            });

            if (useBlockingAPIs)
            {
                this.Pipeline_Compute_MakeCurveTextures = device.createComputePipeline({
                    label: "Compute Pipeline MakeCurveTextures",
                    layout: this.PipelineLayout_Compute_MakeCurveTextures,
                    compute: {
                        module: this.ShaderModule_Compute_MakeCurveTextures,
                        entryPoint: "main",
                    }
                });
            }
            else
            {
                this.loadingPromises.add("MakeCurveTextures");

                device.createComputePipelineAsync({
                    label: "Compute Pipeline MakeCurveTextures",
                    layout: this.PipelineLayout_Compute_MakeCurveTextures,
                    compute: {
                        module: this.ShaderModule_Compute_MakeCurveTextures,
                        entryPoint: "main",
                    }
                }).then( handle => { this.Pipeline_Compute_MakeCurveTextures = handle; this.loadingPromises.delete("MakeCurveTextures"); } );
            }
        }
    }

    // (Re)create compute shader Transform
    {
        const bindGroupEntries =
        [
            {
                // Input
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                texture : { viewDimension: "2d", sampleType: Shared.GetTextureFormatInfo(this.texture_Input_format).sampleType }
            },
            {
                // Output
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_Output_format), viewDimension: "2d" }
            },
            {
                // DCTexture2D
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                texture : { viewDimension: "2d", sampleType: Shared.GetTextureFormatInfo(this.texture_DCTexture2D_format).sampleType }
            },
            {
                // DCTexture3D
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                texture : { viewDimension: "3d", sampleType: Shared.GetTextureFormatInfo(this.texture_DCTexture3D_format).sampleType }
            },
            {
                // SeilerTexture2D
                binding: 4,
                visibility: GPUShaderStage.COMPUTE,
                texture : { viewDimension: "2d", sampleType: Shared.GetTextureFormatInfo(this.texture_SeilerTexture2D_format).sampleType }
            },
            {
                // SeilerTexture3D
                binding: 5,
                visibility: GPUShaderStage.COMPUTE,
                texture : { viewDimension: "3d", sampleType: Shared.GetTextureFormatInfo(this.texture_SeilerTexture3D_format).sampleType }
            },
            {
                // OutputReadOnly
                binding: 6,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_Transform_Output_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // _Transform_0CB
                binding: 7,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "uniform" }
            },
            {
                // LinearSampler
                binding: 8,
                visibility: GPUShaderStage.COMPUTE,
                sampler: { },
            },
        ];

        let hashString = JSON.stringify(bindGroupEntries);
        const newHash = hashString.hashCode();

        if (this.ShaderModule_Compute_Transform === null || newHash !== this.Hash_Compute_Transform)
        {
            this.Hash_Compute_Transform = newHash;

            let shaderCode = class_ColorGrading.ShaderCode_Transform_Transform_0;
            shaderCode = shaderCode.replace("/*(Output_format)*/", Shared.GetNonSRGBFormat(this.texture_Output_format));
            shaderCode = shaderCode.replace("/*(OutputReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_Transform_Output_ReadOnly_format));

            this.ShaderModule_Compute_Transform = device.createShaderModule({ code: shaderCode, label: "Compute Shader Transform"});
            this.BindGroupLayout_Compute_Transform = device.createBindGroupLayout({
                label: "Compute Bind Group Layout Transform",
                entries: bindGroupEntries
            });

            this.PipelineLayout_Compute_Transform = device.createPipelineLayout({
                label: "Compute Pipeline Layout Transform",
                bindGroupLayouts: [this.BindGroupLayout_Compute_Transform],
            });

            if (useBlockingAPIs)
            {
                this.Pipeline_Compute_Transform = device.createComputePipeline({
                    label: "Compute Pipeline Transform",
                    layout: this.PipelineLayout_Compute_Transform,
                    compute: {
                        module: this.ShaderModule_Compute_Transform,
                        entryPoint: "main",
                    }
                });
            }
            else
            {
                this.loadingPromises.add("Transform");

                device.createComputePipelineAsync({
                    label: "Compute Pipeline Transform",
                    layout: this.PipelineLayout_Compute_Transform,
                    compute: {
                        module: this.ShaderModule_Compute_Transform,
                        entryPoint: "main",
                    }
                }).then( handle => { this.Pipeline_Compute_Transform = handle; this.loadingPromises.delete("Transform"); } );
            }
        }
    }

}

async FillEncoder(device, encoder)
{
    encoder.pushDebugGroup("ColorGrading.Input");

    encoder.popDebugGroup(); // "ColorGrading.Input"

    encoder.pushDebugGroup("ColorGrading.Output");

    encoder.popDebugGroup(); // "ColorGrading.Output"

    encoder.pushDebugGroup("ColorGrading.DCTexture2D");

    encoder.popDebugGroup(); // "ColorGrading.DCTexture2D"

    encoder.pushDebugGroup("ColorGrading.SeilerTexture2D");

    encoder.popDebugGroup(); // "ColorGrading.SeilerTexture2D"

    encoder.pushDebugGroup("ColorGrading.SeilerTexture3D");

    encoder.popDebugGroup(); // "ColorGrading.SeilerTexture3D"

    encoder.pushDebugGroup("ColorGrading.DCTexture3D");

    encoder.popDebugGroup(); // "ColorGrading.DCTexture3D"

    encoder.pushDebugGroup("ColorGrading.Transform_Output_ReadOnly");

    encoder.popDebugGroup(); // "ColorGrading.Transform_Output_ReadOnly"

    encoder.pushDebugGroup("ColorGrading.Copy_Transform_Output");

    // Copy texture Output to texture Transform_Output_ReadOnly
    {
        const numMips = Math.min(this.texture_Output.mipLevelCount, this.texture_Transform_Output_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_Output.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_Output.height >> mipIndex, 1);
            let mipDepth = this.texture_Output.depthOrArrayLayers;

            if (this.texture_Output.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_Output, mipLevel: mipIndex },
                { texture: this.texture_Transform_Output_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Copy_Transform_Output"

    encoder.pushDebugGroup("ColorGrading.MakeCurveTextures_DCTexture2D_ReadOnly");

    encoder.popDebugGroup(); // "ColorGrading.MakeCurveTextures_DCTexture2D_ReadOnly"

    encoder.pushDebugGroup("ColorGrading.Copy_MakeCurveTextures_DCTexture2D");

    // Copy texture DCTexture2D to texture MakeCurveTextures_DCTexture2D_ReadOnly
    {
        const numMips = Math.min(this.texture_DCTexture2D.mipLevelCount, this.texture_MakeCurveTextures_DCTexture2D_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_DCTexture2D.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_DCTexture2D.height >> mipIndex, 1);
            let mipDepth = this.texture_DCTexture2D.depthOrArrayLayers;

            if (this.texture_DCTexture2D.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_DCTexture2D, mipLevel: mipIndex },
                { texture: this.texture_MakeCurveTextures_DCTexture2D_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Copy_MakeCurveTextures_DCTexture2D"

    encoder.pushDebugGroup("ColorGrading.MakeCurveTextures_DCTexture3D_ReadOnly");

    encoder.popDebugGroup(); // "ColorGrading.MakeCurveTextures_DCTexture3D_ReadOnly"

    encoder.pushDebugGroup("ColorGrading.Copy_MakeCurveTextures_DCTexture3D");

    // Copy texture DCTexture3D to texture MakeCurveTextures_DCTexture3D_ReadOnly
    {
        const numMips = Math.min(this.texture_DCTexture3D.mipLevelCount, this.texture_MakeCurveTextures_DCTexture3D_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_DCTexture3D.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_DCTexture3D.height >> mipIndex, 1);
            let mipDepth = this.texture_DCTexture3D.depthOrArrayLayers;

            if (this.texture_DCTexture3D.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_DCTexture3D, mipLevel: mipIndex },
                { texture: this.texture_MakeCurveTextures_DCTexture3D_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Copy_MakeCurveTextures_DCTexture3D"

    encoder.pushDebugGroup("ColorGrading.MakeCurveTextures_SeilerTexture2D_ReadOnly");

    encoder.popDebugGroup(); // "ColorGrading.MakeCurveTextures_SeilerTexture2D_ReadOnly"

    encoder.pushDebugGroup("ColorGrading.Copy_MakeCurveTextures_SeilerTexture2D");

    // Copy texture SeilerTexture2D to texture MakeCurveTextures_SeilerTexture2D_ReadOnly
    {
        const numMips = Math.min(this.texture_SeilerTexture2D.mipLevelCount, this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_SeilerTexture2D.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_SeilerTexture2D.height >> mipIndex, 1);
            let mipDepth = this.texture_SeilerTexture2D.depthOrArrayLayers;

            if (this.texture_SeilerTexture2D.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_SeilerTexture2D, mipLevel: mipIndex },
                { texture: this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Copy_MakeCurveTextures_SeilerTexture2D"

    encoder.pushDebugGroup("ColorGrading.MakeCurveTextures_SeilerTexture3D_ReadOnly");

    encoder.popDebugGroup(); // "ColorGrading.MakeCurveTextures_SeilerTexture3D_ReadOnly"

    encoder.pushDebugGroup("ColorGrading.Copy_MakeCurveTextures_SeilerTexture3D");

    // Copy texture SeilerTexture3D to texture MakeCurveTextures_SeilerTexture3D_ReadOnly
    {
        const numMips = Math.min(this.texture_SeilerTexture3D.mipLevelCount, this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_SeilerTexture3D.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_SeilerTexture3D.height >> mipIndex, 1);
            let mipDepth = this.texture_SeilerTexture3D.depthOrArrayLayers;

            if (this.texture_SeilerTexture3D.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_SeilerTexture3D, mipLevel: mipIndex },
                { texture: this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Copy_MakeCurveTextures_SeilerTexture3D"

    encoder.pushDebugGroup("ColorGrading._Transform_0CB");

    // Create constant buffer _Transform_0CB
    if (this.constantBuffer__Transform_0CB === null)
    {
        this.constantBuffer__Transform_0CB = device.createBuffer({
            label: "ColorGrading._Transform_0CB",
            size: Shared.Align(16, this.constructor.StructOffsets__Transform_0CB._size),
            usage: this.constantBuffer__Transform_0CB_usageFlags,
        });
    }

    // Upload values to constant buffer _Transform_0CB
    {
        const bufferCPU = new ArrayBuffer(Shared.Align(16, this.constructor.StructOffsets__Transform_0CB._size));
        const view = new DataView(bufferCPU);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP1_0, this.variable_CP1[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP1_1, this.variable_CP1[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP1_2, this.variable_CP1[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP2_0, this.variable_CP2[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP2_1, this.variable_CP2[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP2_2, this.variable_CP2[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP3_0, this.variable_CP3[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP3_1, this.variable_CP3[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP3_2, this.variable_CP3[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP4_0, this.variable_CP4[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP4_1, this.variable_CP4[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP4_2, this.variable_CP4[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP5_0, this.variable_CP5[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP5_1, this.variable_CP5[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP5_2, this.variable_CP5[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP6_0, this.variable_CP6[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP6_1, this.variable_CP6[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CP6_2, this.variable_CP6[2], true);
        view.setInt32(this.constructor.StructOffsets__Transform_0CB.CurveOrder, this.variable_CurveOrder, true);
        view.setInt32(this.constructor.StructOffsets__Transform_0CB.CurveType, this.variable_CurveType, true);
        device.queue.writeBuffer(this.constantBuffer__Transform_0CB, 0, bufferCPU);
    }

    encoder.popDebugGroup(); // "ColorGrading._Transform_0CB"

    encoder.pushDebugGroup("ColorGrading._MakeCurveTextures_0CB");

    // Create constant buffer _MakeCurveTextures_0CB
    if (this.constantBuffer__MakeCurveTextures_0CB === null)
    {
        this.constantBuffer__MakeCurveTextures_0CB = device.createBuffer({
            label: "ColorGrading._MakeCurveTextures_0CB",
            size: Shared.Align(16, this.constructor.StructOffsets__MakeCurveTextures_0CB._size),
            usage: this.constantBuffer__MakeCurveTextures_0CB_usageFlags,
        });
    }

    // Upload values to constant buffer _MakeCurveTextures_0CB
    {
        const bufferCPU = new ArrayBuffer(Shared.Align(16, this.constructor.StructOffsets__MakeCurveTextures_0CB._size));
        const view = new DataView(bufferCPU);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP1_0, this.variable_CP1[0], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP1_1, this.variable_CP1[1], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP1_2, this.variable_CP1[2], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP2_0, this.variable_CP2[0], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP2_1, this.variable_CP2[1], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP2_2, this.variable_CP2[2], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP3_0, this.variable_CP3[0], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP3_1, this.variable_CP3[1], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP3_2, this.variable_CP3[2], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP4_0, this.variable_CP4[0], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP4_1, this.variable_CP4[1], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP4_2, this.variable_CP4[2], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP5_0, this.variable_CP5[0], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP5_1, this.variable_CP5[1], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP5_2, this.variable_CP5[2], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP6_0, this.variable_CP6[0], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP6_1, this.variable_CP6[1], true);
        view.setFloat32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CP6_2, this.variable_CP6[2], true);
        view.setInt32(this.constructor.StructOffsets__MakeCurveTextures_0CB.CurveOrder, this.variable_CurveOrder, true);
        device.queue.writeBuffer(this.constantBuffer__MakeCurveTextures_0CB, 0, bufferCPU);
    }

    encoder.popDebugGroup(); // "ColorGrading._MakeCurveTextures_0CB"

    encoder.pushDebugGroup("ColorGrading.MakeCurveTextures");

    // Run compute shader MakeCurveTextures
    {
        const bindGroup = device.createBindGroup({
            label: "Compute Bind Group MakeCurveTextures",
            layout: this.BindGroupLayout_Compute_MakeCurveTextures,
            entries: [
                {
                    // DCTexture2D
                    binding: 0,
                    resource: this.texture_DCTexture2D.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // DCTexture3D
                    binding: 1,
                    resource: this.texture_DCTexture3D.createView({ dimension: "3d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // SeilerTexture2D
                    binding: 2,
                    resource: this.texture_SeilerTexture2D.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // SeilerTexture3D
                    binding: 3,
                    resource: this.texture_SeilerTexture3D.createView({ dimension: "3d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // DCTexture2DReadOnly
                    binding: 4,
                    resource: this.texture_MakeCurveTextures_DCTexture2D_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // DCTexture3DReadOnly
                    binding: 5,
                    resource: this.texture_MakeCurveTextures_DCTexture3D_ReadOnly.createView({ dimension: "3d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // SeilerTexture2DReadOnly
                    binding: 6,
                    resource: this.texture_MakeCurveTextures_SeilerTexture2D_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // SeilerTexture3DReadOnly
                    binding: 7,
                    resource: this.texture_MakeCurveTextures_SeilerTexture3D_ReadOnly.createView({ dimension: "3d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // _MakeCurveTextures_0CB
                    binding: 8,
                    resource: { buffer: this.constantBuffer__MakeCurveTextures_0CB }
                },
            ]
        });

        // Calculate dispatch size
        const baseDispatchSize = [1, 1, 1];
        const dispatchSize = [
            Math.floor((Math.floor(((parseInt(baseDispatchSize[0]) + 0) * 1) / 1) + 0 + 1 - 1) / 1),
            Math.floor((Math.floor(((parseInt(baseDispatchSize[1]) + 0) * 1) / 1) + 0 + 1 - 1) / 1),
            Math.floor((Math.floor(((parseInt(baseDispatchSize[2]) + 0) * 1) / 1) + 0 + 1 - 1) / 1)
        ];

        if (this.Pipeline_Compute_MakeCurveTextures !== null)
        {
            const computePass = encoder.beginComputePass();
                computePass.setPipeline(this.Pipeline_Compute_MakeCurveTextures);
                computePass.setBindGroup(0, bindGroup);
                computePass.dispatchWorkgroups(dispatchSize[0], dispatchSize[1], dispatchSize[2]);
            computePass.end();
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.MakeCurveTextures"

    encoder.pushDebugGroup("ColorGrading.Transform");

    // Run compute shader Transform
    {
        const bindGroup = device.createBindGroup({
            label: "Compute Bind Group Transform",
            layout: this.BindGroupLayout_Compute_Transform,
            entries: [
                {
                    // Input
                    binding: 0,
                    resource: this.texture_Input.createView({ dimension: "2d", format: this.texture_Input_format, usage: GPUTextureUsage.TEXTURE_BINDING })
                },
                {
                    // Output
                    binding: 1,
                    resource: this.texture_Output.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // DCTexture2D
                    binding: 2,
                    resource: this.texture_DCTexture2D.createView({ dimension: "2d", format: this.texture_DCTexture2D_format, usage: GPUTextureUsage.TEXTURE_BINDING })
                },
                {
                    // DCTexture3D
                    binding: 3,
                    resource: this.texture_DCTexture3D.createView({ dimension: "3d", format: this.texture_DCTexture3D_format, usage: GPUTextureUsage.TEXTURE_BINDING })
                },
                {
                    // SeilerTexture2D
                    binding: 4,
                    resource: this.texture_SeilerTexture2D.createView({ dimension: "2d", format: this.texture_SeilerTexture2D_format, usage: GPUTextureUsage.TEXTURE_BINDING })
                },
                {
                    // SeilerTexture3D
                    binding: 5,
                    resource: this.texture_SeilerTexture3D.createView({ dimension: "3d", format: this.texture_SeilerTexture3D_format, usage: GPUTextureUsage.TEXTURE_BINDING })
                },
                {
                    // OutputReadOnly
                    binding: 6,
                    resource: this.texture_Transform_Output_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // _Transform_0CB
                    binding: 7,
                    resource: { buffer: this.constantBuffer__Transform_0CB }
                },
                {
                    // LinearSampler
                    binding: 8,
                    resource: device.createSampler({
                        label: "Sampler LinearSampler",
                        addressModeU: "repeat",
                        addressModeV: "repeat",
                        addressModeW: "repeat",
                        magFilter: "linear",
                        minFilter: "linear",
                        mipmapFilter: "linear",
                    }),
                },
            ]
        });

        // Calculate dispatch size
        const baseDispatchSize = this.texture_Input_size;
        const dispatchSize = [
            Math.floor((Math.floor(((parseInt(baseDispatchSize[0]) + 0) * 1) / 1) + 0 + 8 - 1) / 8),
            Math.floor((Math.floor(((parseInt(baseDispatchSize[1]) + 0) * 1) / 1) + 0 + 8 - 1) / 8),
            Math.floor((Math.floor(((parseInt(baseDispatchSize[2]) + 0) * 1) / 1) + 0 + 1 - 1) / 1)
        ];

        if (this.Pipeline_Compute_Transform !== null)
        {
            const computePass = encoder.beginComputePass();
                computePass.setPipeline(this.Pipeline_Compute_Transform);
                computePass.setBindGroup(0, bindGroup);
                computePass.dispatchWorkgroups(dispatchSize[0], dispatchSize[1], dispatchSize[2]);
            computePass.end();
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Transform"

}

/*
When useBlockingAPIs is false, this function works differently:
1) When first called, it does frame start SetVariables, and starts asynchronous operations.
2) If any async operations are in flight, it exits out.
3) When this function is called again, if there are still async operations in flight it will do nothing.
4) if there are not async operations in flight, it will add passes to the encoder and do end frame SetVariables.

This dance is needed because we don't want to block the main thread in browsers.
However, some logic in the render graph may only happen during the first execution (driven by variables) which
could cause it never to happen if the async operation took longer than one Execute() call, and the start frame
set variables were allowed to be called more than once before execution, or the end frame variables were allowed
to be called at all.

When useBlockingAPIs is true, this function does everything every frame, blocking as needed.
Node.js has useBlockingAPIs=true to simplify logic. Node has no shader compilation timeouts, unlike the browser.

*/
async Execute(device, encoder, useBlockingAPIs = false)
{
    // Always make sure we have our required imported resources
    if (!await this.ValidateImports())
        return false;

    // If we are waiting on promises it means we've already done these steps and are waiting for the promises to be done
    if (!this.waitingOnPromises)
    {
        await this.SetVarsBefore();
        await this.Init(device, encoder, useBlockingAPIs);
    }

    // If we are waiting on promises, remember that and exit out
    if (this.loadingPromises.size > 0)
    {
        this.waitingOnPromises = true;
        return true;
    }
    this.waitingOnPromises = false;

    // If we got here, all async work is done, so fill the encoder and do the end of frame set variable logic
    await this.FillEncoder(device, encoder);
    await this.SetVarsAfter();

    return true;
}

};

var ColorGrading = new class_ColorGrading;

export default ColorGrading;
