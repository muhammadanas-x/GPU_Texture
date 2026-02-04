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

struct _MatrixStorage_float4x4std140_0
{
    @align(16) data_0 : array<vec4<f32>, i32(4)>,
};

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
    @align(4) CameraChanged_0 : u32,
    @align(16) CameraPos_0 : vec3<f32>,
    @align(4) CurveOrder_0 : i32,
    @align(16) CurveType_0 : i32,
    @align(4) _padding5_0 : f32,
    @align(8) _padding6_0 : f32,
    @align(4) _padding7_0 : f32,
    @align(16) InvViewMtx_0 : _MatrixStorage_float4x4std140_0,
    @align(16) InvViewProjMtx_0 : _MatrixStorage_float4x4std140_0,
    @align(16) RaysPerPixelPerFrame_0 : i32,
    @align(4) RenderScene_0 : u32,
    @align(8) iFrame_0 : i32,
    @align(4) _padding8_0 : f32,
};

@binding(9) @group(0) var<uniform> _Transform_0CB : Struct_Transform_0CB_std140_0;
@binding(6) @group(0) var Accumulation : texture_storage_2d</*(Accumulation_format)*/, write>;

@binding(8) @group(0) var AccumulationReadOnly : texture_storage_2d</*(AccumulationReadOnly_format)*/, read>;

@binding(2) @group(0) var DCTexture2D : texture_2d<f32>;

@binding(10) @group(0) var LinearSampler : sampler;

@binding(3) @group(0) var DCTexture3D : texture_3d<f32>;

@binding(4) @group(0) var SeilerTexture2D : texture_2d<f32>;

@binding(5) @group(0) var SeilerTexture3D : texture_3d<f32>;

@binding(1) @group(0) var Output : texture_storage_2d</*(Output_format)*/, write>;

fn wang_hash_0( seed_0 : ptr<function, u32>) -> u32
{
    var _S1 : u32 = (((((*seed_0) ^ (u32(61)))) ^ ((((*seed_0) >> (u32(16))))))) * u32(9);
    var _S2 : u32 = ((_S1 ^ (((_S1 >> (u32(4))))))) * u32(668265261);
    var _S3 : u32 = (_S2 ^ (((_S2 >> (u32(15))))));
    (*seed_0) = _S3;
    return _S3;
}

fn RandomFloat01_0( state_0 : ptr<function, u32>) -> f32
{
    var _S4 : u32 = wang_hash_0(&((*state_0)));
    return f32(_S4) / 4.294967296e+09f;
}

struct SMaterial_0
{
     diffuse_0 : vec3<f32>,
     specular_0 : vec3<f32>,
     roughness_0 : f32,
     emissive_0 : vec3<f32>,
};

struct SRayHitInfo_0
{
     hitAnObject_0 : bool,
     rayMarchedObject_0 : bool,
     dist_0 : f32,
     normal_0 : vec3<f32>,
     material_0 : SMaterial_0,
};

fn TestPlaneTrace_0( rayPos_0 : vec3<f32>,  rayDir_0 : vec3<f32>,  info_0 : ptr<function, SRayHitInfo_0>,  plane_0 : vec4<f32>,  material_1 : SMaterial_0) -> bool
{
    var _S5 : vec3<f32> = plane_0.xyz;
    var denom_0 : f32 = dot(_S5, rayDir_0);
    if((abs(denom_0)) > 0.00100000004749745f)
    {
        var dist_1 : f32 = (plane_0.w - dot(_S5, rayPos_0)) / denom_0;
        var _S6 : bool;
        if(dist_1 > 0.10000000149011612f)
        {
            _S6 = dist_1 < ((*info_0).dist_0);
        }
        else
        {
            _S6 = false;
        }
        if(_S6)
        {
            (*info_0).hitAnObject_0 = true;
            (*info_0).rayMarchedObject_0 = false;
            (*info_0).dist_0 = dist_1;
            (*info_0).normal_0 = _S5;
            (*info_0).material_0 = material_1;
            return true;
        }
    }
    return false;
}

fn TestSphereTrace_0( rayPos_1 : vec3<f32>,  rayDir_1 : vec3<f32>,  info_1 : ptr<function, SRayHitInfo_0>,  sphere_0 : vec4<f32>,  material_2 : SMaterial_0) -> bool
{
    var _S7 : vec3<f32> = sphere_0.xyz;
    var m_0 : vec3<f32> = rayPos_1 - _S7;
    var b_0 : f32 = dot(m_0, rayDir_1);
    var _S8 : f32 = sphere_0.w;
    var c_0 : f32 = dot(m_0, m_0) - _S8 * _S8;
    var _S9 : bool;
    if(c_0 > 0.0f)
    {
        _S9 = b_0 > 0.0f;
    }
    else
    {
        _S9 = false;
    }
    if(_S9)
    {
        return false;
    }
    var discr_0 : f32 = b_0 * b_0 - c_0;
    if(discr_0 < 0.0f)
    {
        return false;
    }
    var _S10 : f32 = - b_0;
    var _S11 : f32 = sqrt(discr_0);
    var dist_2 : f32 = _S10 - _S11;
    var _S12 : bool = dist_2 < 0.0f;
    var dist_3 : f32;
    if(_S12)
    {
        dist_3 = _S10 + _S11;
    }
    else
    {
        dist_3 = dist_2;
    }
    if(dist_3 > 0.10000000149011612f)
    {
        _S9 = dist_3 < ((*info_1).dist_0);
    }
    else
    {
        _S9 = false;
    }
    if(_S9)
    {
        (*info_1).hitAnObject_0 = true;
        (*info_1).rayMarchedObject_0 = false;
        (*info_1).dist_0 = dist_3;
        var _S13 : vec3<f32> = normalize(rayPos_1 + rayDir_1 * vec3<f32>(dist_3) - _S7);
        if(_S12)
        {
            dist_3 = -1.0f;
        }
        else
        {
            dist_3 = 1.0f;
        }
        (*info_1).normal_0 = _S13 * vec3<f32>(dist_3);
        (*info_1).material_0 = material_2;
        return true;
    }
    return false;
}

fn TestCylinderTrace_0( rayPos_2 : vec3<f32>,  rayDir_2 : vec3<f32>,  info_2 : ptr<function, SRayHitInfo_0>,  pos_0 : vec3<f32>,  radius_0 : f32,  height_0 : f32,  material_3 : SMaterial_0) -> bool
{
    var relativeRayPos_0 : vec3<f32> = rayPos_2 - pos_0;
    var projectedRayPos_0 : vec3<f32> = vec3<f32>(relativeRayPos_0.x, 0.0f, relativeRayPos_0.z);
    var projectedRayDir_0 : vec3<f32> = vec3<f32>(rayDir_2.x, 0.0f, rayDir_2.z);
    var lengthCorrection_0 : f32 = length(projectedRayDir_0);
    var b_1 : f32 = dot(projectedRayPos_0, projectedRayDir_0 / vec3<f32>(lengthCorrection_0));
    var c_1 : f32 = dot(projectedRayPos_0, projectedRayPos_0) - radius_0 * radius_0;
    var _S14 : bool;
    if(c_1 > 0.0f)
    {
        _S14 = b_1 > 0.0f;
    }
    else
    {
        _S14 = false;
    }
    if(_S14)
    {
        return false;
    }
    var discr_1 : f32 = b_1 * b_1 - c_1;
    if(discr_1 < 0.0f)
    {
        return false;
    }
    var _S15 : f32 = - b_1;
    var _S16 : f32 = sqrt(discr_1);
    var dist_4 : f32 = _S15 - _S16;
    var _S17 : bool = dist_4 < 0.0f;
    var dist_5 : f32;
    if(_S17)
    {
        dist_5 = _S15 + _S16;
    }
    else
    {
        dist_5 = dist_4;
    }
    var dist_6 : f32 = dist_5 / lengthCorrection_0;
    var relativeHitPos_0 : vec3<f32> = relativeRayPos_0 + rayDir_2 * vec3<f32>(dist_6);
    var _S18 : f32 = relativeHitPos_0.y;
    if(_S18 < 0.0f)
    {
        _S14 = true;
    }
    else
    {
        _S14 = _S18 > height_0;
    }
    var relativeHitPos_1 : vec3<f32>;
    if(_S14)
    {
        var dist_7 : f32 = (_S15 + _S16) / lengthCorrection_0;
        var relativeHitPos_2 : vec3<f32> = relativeRayPos_0 + rayDir_2 * vec3<f32>(dist_7);
        var _S19 : f32 = relativeHitPos_2.y;
        if(_S19 < 0.0f)
        {
            _S14 = true;
        }
        else
        {
            _S14 = _S19 > height_0;
        }
        if(_S14)
        {
            return false;
        }
        relativeHitPos_1 = relativeHitPos_2;
        dist_5 = dist_7;
    }
    else
    {
        relativeHitPos_1 = relativeHitPos_0;
        dist_5 = dist_6;
    }
    if(dist_5 > 0.10000000149011612f)
    {
        _S14 = dist_5 < ((*info_2).dist_0);
    }
    else
    {
        _S14 = false;
    }
    if(_S14)
    {
        (*info_2).hitAnObject_0 = true;
        (*info_2).rayMarchedObject_0 = false;
        (*info_2).dist_0 = dist_5;
        var _S20 : vec3<f32> = normalize(vec3<f32>(relativeHitPos_1.x, 0.0f, relativeHitPos_1.z));
        if(_S17)
        {
            dist_5 = -1.0f;
        }
        else
        {
            dist_5 = 1.0f;
        }
        (*info_2).normal_0 = _S20 * vec3<f32>(dist_5);
        (*info_2).material_0 = material_3;
        return true;
    }
    return false;
}

fn mod_0( x_0 : f32,  y_0 : f32) -> f32
{
    return x_0 - y_0 * floor(x_0 / y_0);
}

fn hash12_0( p_0 : vec2<f32>) -> f32
{
    var p3_0 : vec3<f32> = fract(p_0.xyx * vec3<f32>(0.1031000018119812f));
    var p3_1 : vec3<f32> = p3_0 + vec3<f32>(dot(p3_0, p3_0.yzx + vec3<f32>(33.3300018310546875f)));
    return fract((p3_1.x + p3_1.y) * p3_1.z);
}

fn RayTraceMountainCylinders_0( rayPos_3 : vec3<f32>,  rayDir_3 : vec3<f32>,  hitInfo_0 : ptr<function, SRayHitInfo_0>,  seed_1 : f32,  radius_1 : f32,  maxMountainHeight_0 : f32)
{
    var material_4 : SMaterial_0;
    material_4.diffuse_0 = vec3<f32>(1.0f, 1.0f, 1.0f);
    const _S21 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    material_4.specular_0 = _S21;
    material_4.roughness_0 = 0.02500000037252903f;
    material_4.emissive_0 = _S21;
    var oldHitInfo_0 : SRayHitInfo_0 = (*hitInfo_0);
    var _S22 : bool = TestCylinderTrace_0(rayPos_3, rayDir_3, &((*hitInfo_0)), vec3<f32>(0.0f, -15.0f, 0.0f), radius_1, maxMountainHeight_0, material_4);
    if(_S22)
    {
        var hitPos_0 : vec3<f32> = rayPos_3 + rayDir_3 * vec3<f32>((*hitInfo_0).dist_0);
        var heightPercent_0 : f32 = (hitPos_0.y + 15.0f) / maxMountainHeight_0;
        var _S23 : f32 = clamp((atan2(hitPos_0.z, hitPos_0.x) + 3.14159274101257324f) / 6.28318548202514648f, 0.0f, 1.0f) * 20.0f;
        var thisHeightIndex_0 : f32 = floor(_S23);
        var mountainHeight_0 : f32 = mix(hash12_0(vec2<f32>(thisHeightIndex_0, seed_1)) * 0.75f + 0.25f, hash12_0(vec2<f32>(mod_0(thisHeightIndex_0 + 1.0f, 20.0f), seed_1)) * 0.75f + 0.25f, fract(_S23));
        if(heightPercent_0 > mountainHeight_0)
        {
            (*hitInfo_0) = oldHitInfo_0;
        }
        else
        {
            (*hitInfo_0).material_0.emissive_0 = pow(vec3<f32>(0.99000000953674316f, 0.03999999910593033f, 0.98000001907348633f), vec3<f32>(2.20000004768371582f, 2.20000004768371582f, 2.20000004768371582f)) * vec3<f32>(5.0f) * vec3<f32>(smoothstep(mountainHeight_0 - 0.25f / maxMountainHeight_0, mountainHeight_0, heightPercent_0));
        }
    }
    return;
}

fn Bias_0( x_1 : f32,  bias_0 : f32) -> f32
{
    return x_1 / ((1.0f / bias_0 - 2.0f) * (1.0f - x_1) + 1.0f);
}

fn hash22_0( p_1 : vec2<f32>) -> vec2<f32>
{
    var p3_2 : vec3<f32> = fract(p_1.xyx * vec3<f32>(0.1031000018119812f, 0.10300000011920929f, 0.09730000048875809f));
    var p3_3 : vec3<f32> = p3_2 + vec3<f32>(dot(p3_2, p3_2.yzx + vec3<f32>(33.3300018310546875f)));
    return fract((p3_3.xx + p3_3.yz) * p3_3.zy);
}

fn sdStar_0( p_2 : vec2<f32>,  r_0 : f32,  n_0 : i32,  m_1 : f32) -> f32
{
    var an_0 : f32 = 3.14159297943115234f / f32(n_0);
    var en_0 : f32 = 3.14159297943115234f / m_1;
    var _S24 : f32 = sin(an_0);
    var _S25 : f32 = sin(en_0);
    var ecs_0 : vec2<f32> = vec2<f32>(cos(en_0), _S25);
    var bn_0 : f32 = mod_0(atan2(p_2.x, p_2.y), 2.0f * an_0) - an_0;
    var _S26 : vec2<f32> = vec2<f32>(length(p_2)) * vec2<f32>(cos(bn_0), abs(sin(bn_0))) - vec2<f32>(r_0) * vec2<f32>(cos(an_0), _S24);
    var _S27 : vec2<f32> = _S26 + ecs_0 * vec2<f32>(clamp(- dot(_S26, ecs_0), 0.0f, r_0 * _S24 / _S25));
    return length(_S27) * f32(sign(_S27.x));
}

fn RayTraceScene_0( rayPos_4 : vec3<f32>,  rayDir_4 : vec3<f32>,  hitInfo_1 : ptr<function, SRayHitInfo_0>)
{
    var material_5 : SMaterial_0;
    material_5.diffuse_0 = vec3<f32>(0.10000000149011612f, 0.10000000149011612f, 0.10000000149011612f);
    const _S28 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    material_5.specular_0 = _S28;
    material_5.roughness_0 = 0.01999999955296516f;
    material_5.emissive_0 = _S28;
    var _S29 : bool = TestPlaneTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(normalize(vec3<f32>(0.0f, 1.0f, 0.0f)), -5.0f), material_5);
    if(_S29)
    {
        var intersectPos_0 : vec3<f32> = rayPos_4 + rayDir_4 * vec3<f32>((*hitInfo_1).dist_0);
        var uv_0 : vec2<f32> = fract(intersectPos_0.xz / vec2<f32>(75.0f));
        const _S30 : vec3<f32> = vec3<f32>(2.20000004768371582f, 2.20000004768371582f, 2.20000004768371582f);
        var _S31 : vec3<f32> = vec3<f32>(step(min(abs(uv_0.x - 0.5f), abs(uv_0.y - 0.5f)), 0.00499999988824129f));
        (*hitInfo_1).material_0.emissive_0 = mix(pow(vec3<f32>(0.11999999731779099f, 0.01999999955296516f, 0.09000000357627869f), _S30), mix(pow(vec3<f32>(0.73000001907348633f, 0.05999999865889549f, 0.99000000953674316f), _S30), vec3<f32>(0.0625f, 0.0f, 1.0f), vec3<f32>(((cos(intersectPos_0.x * 0.01530000008642673f + intersectPos_0.y * 0.06319999694824219f) + 1.0f) / 2.5f))), _S31);
        (*hitInfo_1).material_0.specular_0 = mix(vec3<f32>(0.33000001311302185f, 0.33000001311302185f, 0.33000001311302185f), _S28, _S31);
    }
    var material_6 : SMaterial_0;
    material_6.diffuse_0 = vec3<f32>(0.5f, 0.5f, 0.5f);
    const _S32 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    material_6.specular_0 = _S32;
    material_6.roughness_0 = 0.03500000014901161f;
    material_6.emissive_0 = _S28;
    var _S33 : bool = TestSphereTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(20.0f, 5.0f, -20.0f, 10.0f), material_6);
    var _S34 : bool = TestSphereTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(-60.0f, 0.0f, 20.0f, 10.0f), material_6);
    var _S35 : bool = TestSphereTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(0.0f, 5.0f, -65.0f, 10.0f), material_6);
    var _S36 : bool = TestSphereTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(15.0f, -3.0f, 65.0f, 2.0f), material_6);
    RayTraceMountainCylinders_0(rayPos_4, rayDir_4, &((*hitInfo_1)), 284.0f, 700.0f, 50.0f);
    RayTraceMountainCylinders_0(rayPos_4, rayDir_4, &((*hitInfo_1)), 1337.0f, 800.0f, 150.0f);
    RayTraceMountainCylinders_0(rayPos_4, rayDir_4, &((*hitInfo_1)), 1932.0f, 900.0f, 250.0f);
    var material_7 : SMaterial_0;
    material_7.diffuse_0 = _S28;
    material_7.specular_0 = _S28;
    material_7.roughness_0 = 0.0f;
    material_7.emissive_0 = _S28;
    var oldHitInfo_1 : SRayHitInfo_0 = (*hitInfo_1);
    var _S37 : bool = TestPlaneTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(normalize(vec3<f32>(0.0f, 0.0f, -1.0f)), -1000.0f), material_7);
    if(_S37)
    {
        var uv_1 : vec2<f32> = (rayPos_4 + rayDir_4 * vec3<f32>((*hitInfo_1).dist_0)).xy;
        var _S38 : f32 = uv_1.y;
        var stripe_0 : i32 = i32((- _S38 + 500.0f) / 50.0f);
        var stripe_1 : i32;
        if(stripe_0 > i32(1))
        {
            stripe_1 = (stripe_0 - i32(1)) % i32(2);
        }
        else
        {
            stripe_1 = i32(0);
        }
        if((length(uv_1)) > 500.0f)
        {
            (*hitInfo_1) = oldHitInfo_1;
        }
        else
        {
            if(stripe_1 == i32(1))
            {
                (*hitInfo_1).material_0.emissive_0 = pow(vec3<f32>(0.28999999165534973f, 0.02999999932944775f, 0.41999998688697815f) * vec3<f32>(0.55000001192092896f), vec3<f32>(2.20000004768371582f, 2.20000004768371582f, 2.20000004768371582f));
            }
            else
            {
                const _S39 : vec3<f32> = vec3<f32>(2.20000004768371582f, 2.20000004768371582f, 2.20000004768371582f);
                (*hitInfo_1).material_0.emissive_0 = mix(pow(vec3<f32>(0.11999999731779099f, 0.01999999955296516f, 0.09000000357627869f), _S39), pow(vec3<f32>(0.99000000953674316f, 0.03999999910593033f, 0.98000001907348633f), _S39), vec3<f32>(Bias_0(clamp((_S38 - 100.0f) / 400.0f, 0.0f, 1.0f), 0.05000000074505806f)));
            }
        }
    }
    var material_8 : SMaterial_0;
    material_8.diffuse_0 = _S28;
    material_8.specular_0 = _S28;
    material_8.roughness_0 = 0.0f;
    material_8.emissive_0 = _S28;
    var _S40 : bool = TestSphereTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(0.0f, 500.0f, -1200.0f, 200.0f), material_8);
    if(_S40)
    {
        var _S41 : f32 = (rayPos_4 + rayDir_4 * vec3<f32>((*hitInfo_1).dist_0)).y - 500.0f;
        (*hitInfo_1).material_0.emissive_0 = vec3<f32>(1.0f, 1.0f, 0.0f) * vec3<f32>(Bias_0(clamp(_S41 / 200.0f, 0.0f, 1.0f), 0.10000000149011612f)) + vec3<f32>(1.0f, 0.0f, 0.0f) * vec3<f32>(Bias_0(1.0f - clamp(_S41 / 200.0f, 0.0f, 1.0f), 0.89999997615814209f)) + vec3<f32>(1.0f, 0.0f, 1.0f) * vec3<f32>(Bias_0(clamp(_S41 / -200.0f, 0.0f, 1.0f), 0.10000000149011612f));
    }
    var material_9 : SMaterial_0;
    material_9.diffuse_0 = _S28;
    material_9.specular_0 = _S28;
    material_9.roughness_0 = 0.0f;
    material_9.emissive_0 = vec3<f32>(0.80000001192092896f, 0.0f, 1.0f);
    const _S42 : vec3<f32> = vec3<f32>(0.0f, 460.0f, -1200.0f);
    var _S43 : bool = TestCylinderTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), _S42, 300.0f, 10.0f, material_9);
    var _S44 : bool = TestCylinderTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), _S42, 350.0f, 10.0f, material_9);
    var _S45 : bool = TestCylinderTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), _S42, 375.0f, 10.0f, material_9);
    var material_10 : SMaterial_0;
    material_10.diffuse_0 = _S28;
    material_10.specular_0 = _S28;
    material_10.roughness_0 = 0.0f;
    material_10.emissive_0 = pow(vec3<f32>(0.28999999165534973f, 0.02999999932944775f, 0.41999998688697815f) * vec3<f32>(0.55000001192092896f), vec3<f32>(2.20000004768371582f, 2.20000004768371582f, 2.20000004768371582f));
    var _S46 : bool = TestSphereTrace_0(rayPos_4, rayDir_4, &((*hitInfo_1)), vec4<f32>(0.0f, 0.0f, 0.0f, 2000.0f), material_10);
    if(_S46)
    {
        var hitPos_1 : vec3<f32> = (rayPos_4 + rayDir_4 * vec3<f32>((*hitInfo_1).dist_0)).yzx;
        var _S47 : f32 = hitPos_1.y;
        var _S48 : f32 = hitPos_1.x;
        var _S49 : f32 = (atan2(_S47, _S48) + 3.14159274101257324f) / 6.28318548202514648f * 45.0f;
        var _S50 : f32 = (atan2(sqrt(_S48 * _S48 + _S47 * _S47), hitPos_1.z) + 3.14159274101257324f) / 6.28318548202514648f * 45.0f;
        var cellIndex_0 : vec2<f32> = vec2<f32>(floor(_S49), floor(_S50));
        var starRadius_0 : f32 = hash12_0(cellIndex_0) * 0.10000000149011612f + 0.07000000029802322f;
        var _S51 : vec2<f32> = hash22_0(cellIndex_0) * vec2<f32>((1.0f - starRadius_0 * 2.0f)) + vec2<f32>(starRadius_0) - vec2<f32>(fract(_S49), fract(_S50));
        var _S52 : f32 = length(_S51);
        (*hitInfo_1).material_0.emissive_0 = mix(material_10.emissive_0, _S32, vec3<f32>((step(sdStar_0(_S51, starRadius_0, i32(4), 3.75f) * pow(_S52 / starRadius_0, 10.0f), 0.0f) * pow(1.0f - clamp(_S52 / starRadius_0, 0.0f, 1.0f), 3.0f))));
    }
    return;
}

fn LineDistance_0( A_0 : vec3<f32>,  B_0 : vec3<f32>,  width_0 : f32,  p_3 : vec3<f32>,  normal_1 : ptr<function, vec3<f32>>) -> f32
{
    var AB_0 : vec3<f32> = B_0 - A_0;
    var _S53 : vec3<f32> = p_3 - (A_0 + vec3<f32>(min(1.0f, max(0.0f, dot(p_3 - A_0, AB_0) / dot(AB_0, AB_0)))) * AB_0);
    (*normal_1) = normalize(_S53);
    return length(_S53) - width_0;
}

fn TestLineMarch_0( rayPos_5 : vec3<f32>,  info_3 : ptr<function, SRayHitInfo_0>,  A_1 : vec3<f32>,  B_1 : vec3<f32>,  width_1 : f32,  material_11 : SMaterial_0)
{
    var normal_2 : vec3<f32>;
    var dist_8 : f32 = LineDistance_0(A_1, B_1, width_1, rayPos_5, &(normal_2));
    if(dist_8 < ((*info_3).dist_0))
    {
        (*info_3).rayMarchedObject_0 = true;
        (*info_3).dist_0 = dist_8;
        (*info_3).normal_0 = normal_2;
        (*info_3).material_0 = material_11;
    }
    return;
}

fn dot2_0( v_0 : vec3<f32>) -> f32
{
    return dot(v_0, v_0);
}

fn BezierDistance_0( pos_1 : vec3<f32>,  A_2 : vec3<f32>,  B_2 : vec3<f32>,  C_0 : vec3<f32>,  width_2 : f32) -> f32
{
    var a_0 : vec3<f32> = B_2 - A_2;
    var _S54 : vec3<f32> = vec3<f32>(2.0f);
    var b_2 : vec3<f32> = A_2 - _S54 * B_2 + C_0;
    var c_2 : vec3<f32> = a_0 * _S54;
    var d_0 : vec3<f32> = A_2 - pos_1;
    var kk_0 : f32 = 1.0f / dot(b_2, b_2);
    var kx_0 : f32 = kk_0 * dot(a_0, b_2);
    var ky_0 : f32 = kk_0 * (2.0f * dot(a_0, a_0) + dot(d_0, b_2)) / 3.0f;
    var p_4 : f32 = ky_0 - kx_0 * kx_0;
    var q_0 : f32 = kx_0 * (2.0f * kx_0 * kx_0 - 3.0f * ky_0) + kk_0 * dot(d_0, a_0);
    var h_0 : f32 = q_0 * q_0 + 4.0f * (p_4 * p_4 * p_4);
    var res_0 : f32;
    if(h_0 >= 0.0f)
    {
        var h_1 : f32 = sqrt(h_0);
        var x_2 : vec2<f32> = (vec2<f32>(h_1, - h_1) - vec2<f32>(q_0)) / vec2<f32>(2.0f);
        var uv_2 : vec2<f32> = vec2<f32>(sign(x_2)) * pow(abs(x_2), vec2<f32>(0.3333333432674408f));
        var _S55 : vec3<f32> = vec3<f32>(clamp(uv_2.x + uv_2.y - kx_0, 0.0f, 1.0f));
        res_0 = dot2_0(d_0 + (c_2 + b_2 * _S55) * _S55);
    }
    else
    {
        var z_0 : f32 = sqrt(- p_4);
        var v_1 : f32 = acos(q_0 / (p_4 * z_0 * 2.0f)) / 3.0f;
        var m_2 : f32 = cos(v_1);
        var n_1 : f32 = sin(v_1) * 1.73205077648162842f;
        var t_0 : vec3<f32> = clamp(vec3<f32>(m_2 + m_2, - n_1 - m_2, n_1 - m_2) * vec3<f32>(z_0) - vec3<f32>(kx_0), vec3<f32>(0.0f), vec3<f32>(1.0f));
        var _S56 : vec3<f32> = vec3<f32>(t_0.x);
        var _S57 : vec3<f32> = vec3<f32>(t_0.y);
        res_0 = min(dot2_0(d_0 + (c_2 + b_2 * _S56) * _S56), dot2_0(d_0 + (c_2 + b_2 * _S57) * _S57));
    }
    return sqrt(res_0) - width_2;
}

fn TestBezierMarch_0( rayPos_6 : vec3<f32>,  info_4 : ptr<function, SRayHitInfo_0>,  A_3 : vec3<f32>,  B_3 : vec3<f32>,  C_1 : vec3<f32>,  width_3 : f32,  material_12 : SMaterial_0)
{
    var dist_9 : f32 = BezierDistance_0(rayPos_6, A_3, B_3, C_1, width_3);
    if(dist_9 < ((*info_4).dist_0))
    {
        (*info_4).rayMarchedObject_0 = true;
        (*info_4).dist_0 = dist_9;
        (*info_4).normal_0 = vec3<f32>(1.0f, 0.0f, 0.0f);
        (*info_4).material_0 = material_12;
    }
    return;
}

fn TestSceneMarch_0( rayPos_7 : vec3<f32>) -> SRayHitInfo_0
{
    var hitInfo_2 : SRayHitInfo_0;
    hitInfo_2.hitAnObject_0 = false;
    hitInfo_2.dist_0 = 10000.0f;
    const A_4 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const B_4 : vec3<f32> = vec3<f32>(1.5f, 3.0f, 0.0f);
    const C_2 : vec3<f32> = vec3<f32>(3.0f, 0.0f, 0.0f);
    var _S58 : vec3<f32> = vec3<f32>(3.0f);
    var center_0 : vec3<f32> = (B_4 + C_2) / _S58;
    var A_5 : vec3<f32> = (A_4 - center_0) * _S58;
    var B_5 : vec3<f32> = (B_4 - center_0) * _S58;
    var C_3 : vec3<f32> = (C_2 - center_0) * _S58;
    var material_13 : SMaterial_0;
    material_13.diffuse_0 = A_4;
    material_13.specular_0 = A_4;
    material_13.roughness_0 = 0.0f;
    const _S59 : vec3<f32> = vec3<f32>(2.20000004768371582f, 2.20000004768371582f, 2.20000004768371582f);
    var _S60 : vec3<f32> = vec3<f32>(10.0f);
    var _S61 : vec3<f32> = pow(vec3<f32>(0.73000001907348633f, 0.05999999865889549f, 0.99000000953674316f), _S59) * _S60;
    material_13.emissive_0 = _S61;
    TestLineMarch_0(rayPos_7, &(hitInfo_2), A_5, B_5, 0.10000000149011612f, material_13);
    TestLineMarch_0(rayPos_7, &(hitInfo_2), B_5, C_3, 0.10000000149011612f, material_13);
    TestLineMarch_0(rayPos_7, &(hitInfo_2), C_3, A_5, 0.10000000149011612f, material_13);
    material_13.emissive_0 = pow(vec3<f32>(0.30000001192092896f, 0.15000000596046448f, 1.0f), _S59) * _S60;
    const _S62 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 5.0f);
    var A_6 : vec3<f32> = A_5 + _S62;
    var B_6 : vec3<f32> = B_5 + _S62;
    var C_4 : vec3<f32> = C_3 + _S62;
    TestLineMarch_0(rayPos_7, &(hitInfo_2), A_6, B_6, 0.10000000149011612f, material_13);
    TestLineMarch_0(rayPos_7, &(hitInfo_2), B_6, C_4, 0.10000000149011612f, material_13);
    TestLineMarch_0(rayPos_7, &(hitInfo_2), C_4, A_6, 0.10000000149011612f, material_13);
    material_13.emissive_0 = pow(vec3<f32>(1.0f, 0.15000000596046448f, 0.30000001192092896f), _S59) * _S60;
    var A_7 : vec3<f32> = A_6 + _S62;
    var B_7 : vec3<f32> = B_6 + _S62;
    var C_5 : vec3<f32> = C_4 + _S62;
    TestLineMarch_0(rayPos_7, &(hitInfo_2), A_7, B_7, 0.10000000149011612f, material_13);
    TestLineMarch_0(rayPos_7, &(hitInfo_2), B_7, C_5, 0.10000000149011612f, material_13);
    TestLineMarch_0(rayPos_7, &(hitInfo_2), C_5, A_7, 0.10000000149011612f, material_13);
    var material_14 : SMaterial_0;
    material_14.diffuse_0 = A_4;
    material_14.specular_0 = A_4;
    material_14.roughness_0 = 0.0f;
    material_14.emissive_0 = _S61;
    const cactusOffset_0 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 50.0f);
    var B_8 : vec3<f32> = vec3<f32>(-40.0f, 5.0f, 1.0f) + cactusOffset_0;
    TestBezierMarch_0(rayPos_7, &(hitInfo_2), vec3<f32>(-40.0f, -10.0f, 0.0f) + cactusOffset_0, B_8, vec3<f32>(-40.0f, 20.0f, 0.0f) + cactusOffset_0, 2.0f, material_14);
    TestBezierMarch_0(rayPos_7, &(hitInfo_2), B_8, vec3<f32>(-32.5f, 10.0f, 0.0f) + cactusOffset_0, vec3<f32>(-32.5f, 15.0f, -1.0f) + cactusOffset_0, 1.0f, material_14);
    TestBezierMarch_0(rayPos_7, &(hitInfo_2), vec3<f32>(-40.0f, 2.0f, 1.0f) + cactusOffset_0, vec3<f32>(-47.5f, 7.0f, 2.0f) + cactusOffset_0, vec3<f32>(-47.5f, 13.0f, 4.0f) + cactusOffset_0, 1.0f, material_14);
    return hitInfo_2;
}

fn RayMarchScene_0( startingRayPos_0 : vec3<f32>,  rayDir_5 : vec3<f32>,  oldHitInfo_2 : ptr<function, SRayHitInfo_0>,  rayMarchSteps_0 : u32,  minStepDistance_0 : f32)
{
    const _S63 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    var newHitInfo_0 : SRayHitInfo_0 = (*oldHitInfo_2);
    newHitInfo_0.hitAnObject_0 = false;
    var lastHitInfoDist_0 : f32 = 0.0f;
    var lastRayDistance_0 : f32 = 0.10000000149011612f;
    var stepIndex_0 : i32 = i32(0);
    var rayDistance_0 : f32 = 0.10000000149011612f;
    for(;;)
    {
        if(u32(stepIndex_0) < rayMarchSteps_0)
        {
        }
        else
        {
            break;
        }
        newHitInfo_0 = TestSceneMarch_0(startingRayPos_0 + vec3<f32>(rayDistance_0) * rayDir_5);
        newHitInfo_0.normal_0 = _S63;
        newHitInfo_0.material_0.diffuse_0 = _S63;
        newHitInfo_0.material_0.specular_0 = _S63;
        newHitInfo_0.material_0.roughness_0 = 0.0f;
        newHitInfo_0.material_0.emissive_0 = _S63;
        var _S64 : bool = (newHitInfo_0.dist_0) < 0.0f;
        newHitInfo_0.hitAnObject_0 = _S64;
        if(_S64)
        {
            break;
        }
        var rayDistance_1 : f32 = rayDistance_0 + max(newHitInfo_0.dist_0, minStepDistance_0);
        var _S65 : f32 = newHitInfo_0.dist_0;
        if(rayDistance_1 > ((*oldHitInfo_2).dist_0))
        {
            lastHitInfoDist_0 = _S65;
            lastRayDistance_0 = rayDistance_0;
            rayDistance_0 = rayDistance_1;
            break;
        }
        var stepIndex_1 : i32 = stepIndex_0 + i32(1);
        lastHitInfoDist_0 = _S65;
        lastRayDistance_0 = rayDistance_0;
        rayDistance_0 = rayDistance_1;
        stepIndex_0 = stepIndex_1;
    }
    if(newHitInfo_0.hitAnObject_0)
    {
        var _S66 : f32 = mix(lastRayDistance_0, rayDistance_0, lastHitInfoDist_0 / (lastHitInfoDist_0 - newHitInfo_0.dist_0));
        newHitInfo_0.dist_0 = _S66;
        if(_S66 < ((*oldHitInfo_2).dist_0))
        {
            (*oldHitInfo_2) = newHitInfo_0;
        }
    }
    return;
}

fn RandomUnitVector_0( state_1 : ptr<function, u32>) -> vec3<f32>
{
    var _S67 : f32 = RandomFloat01_0(&((*state_1)));
    var z_1 : f32 = _S67 * 2.0f - 1.0f;
    var _S68 : f32 = RandomFloat01_0(&((*state_1)));
    var a_1 : f32 = _S68 * 6.28318548202514648f;
    var r_1 : f32 = sqrt(1.0f - z_1 * z_1);
    return vec3<f32>(r_1 * cos(a_1), r_1 * sin(a_1), z_1);
}

fn GetColorForRay_0( startRayPos_0 : vec3<f32>,  startRayDir_0 : vec3<f32>,  rngState_0 : ptr<function, u32>,  numBounces_0 : i32,  rayMarchSteps_1 : u32,  minStepDistance_1 : f32) -> vec3<f32>
{
    const _S69 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const _S70 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    var i_0 : i32 = i32(0);
    var rayPos_8 : vec3<f32> = startRayPos_0;
    var rayDir_6 : vec3<f32> = startRayDir_0;
    var colorMultiplier_0 : vec3<f32> = _S70;
    var ret_0 : vec3<f32> = _S69;
    for(;;)
    {
        if(i_0 <= numBounces_0)
        {
        }
        else
        {
            break;
        }
        var hitInfo_3 : SRayHitInfo_0;
        hitInfo_3.hitAnObject_0 = false;
        hitInfo_3.dist_0 = 10000.0f;
        RayTraceScene_0(rayPos_8, rayDir_6, &(hitInfo_3));
        RayMarchScene_0(rayPos_8, rayDir_6, &(hitInfo_3), rayMarchSteps_1, minStepDistance_1);
        if(!hitInfo_3.hitAnObject_0)
        {
            break;
        }
        var rayPos_9 : vec3<f32> = rayPos_8 + rayDir_6 * vec3<f32>(hitInfo_3.dist_0);
        if(hitInfo_3.rayMarchedObject_0)
        {
            hitInfo_3 = TestSceneMarch_0(rayPos_9);
        }
        var ret_1 : vec3<f32> = ret_0 + hitInfo_3.material_0.emissive_0 * colorMultiplier_0;
        var specularLength_0 : f32 = length(hitInfo_3.material_0.specular_0);
        var _S71 : f32 = length(hitInfo_3.material_0.diffuse_0) + specularLength_0;
        if(_S71 == 0.0f)
        {
            ret_0 = ret_1;
            break;
        }
        var specularWeight_0 : f32 = specularLength_0 / _S71;
        var _S72 : f32 = RandomFloat01_0(&((*rngState_0)));
        var doSpecular_0 : f32 = f32(_S72 < specularWeight_0);
        var roughness_1 : f32 = mix(1.0f, hitInfo_3.material_0.roughness_0, doSpecular_0);
        var reflectDir_0 : vec3<f32> = reflect(rayDir_6, hitInfo_3.normal_0);
        var randomDir_0 : vec3<f32> = RandomUnitVector_0(&((*rngState_0)));
        var rayDir_7 : vec3<f32> = normalize(mix(reflectDir_0, randomDir_0, vec3<f32>(roughness_1)));
        if((dot(rayDir_7, hitInfo_3.normal_0)) < 0.0f)
        {
            rayDir_6 = rayDir_7 * vec3<f32>(-1.0f);
        }
        else
        {
            rayDir_6 = rayDir_7;
        }
        var rayPos_10 : vec3<f32> = rayPos_9 + hitInfo_3.normal_0 * vec3<f32>(0.00999999977648258f);
        var colorMultiplier_1 : vec3<f32> = colorMultiplier_0 * mix(hitInfo_3.material_0.diffuse_0 * vec3<f32>(dot(hitInfo_3.normal_0, rayDir_6)), hitInfo_3.material_0.specular_0, vec3<f32>(doSpecular_0));
        i_0 = i_0 + i32(1);
        rayPos_8 = rayPos_10;
        colorMultiplier_0 = colorMultiplier_1;
        ret_0 = ret_1;
    }
    return ret_0;
}

fn ACESFilm_0( x_3 : vec3<f32>) -> vec3<f32>
{
    return clamp(x_3 * (vec3<f32>(2.50999999046325684f) * x_3 + vec3<f32>(0.02999999932944775f)) / (x_3 * (vec3<f32>(2.43000006675720215f) * x_3 + vec3<f32>(0.5899999737739563f)) + vec3<f32>(0.14000000059604645f)), vec3<f32>(0.0f), vec3<f32>(1.0f));
}

fn RenderScene_1( px_0 : vec2<u32>) -> vec3<f32>
{
    var rngState_1 : u32 = ((px_0.x * u32(1973) + px_0.y * u32(9277) + u32(_Transform_0CB.iFrame_0) * u32(26699)) | (u32(1)));
    var color_0 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    var rayIndex_0 : i32 = i32(0);
    for(;;)
    {
        if(rayIndex_0 < (_Transform_0CB.RaysPerPixelPerFrame_0))
        {
        }
        else
        {
            break;
        }
        var _S73 : vec2<f32> = vec2<f32>(px_0);
        var _S74 : f32 = RandomFloat01_0(&(rngState_1));
        var _S75 : f32 = RandomFloat01_0(&(rngState_1));
        var fragCoordJittered_0 : vec2<f32> = _S73 + (vec2<f32>(_S74, _S75) - vec2<f32>(0.5f));
        var w_0 : u32;
        var h_2 : u32;
        {var dim = textureDimensions((Accumulation));((w_0)) = dim.x;((h_2)) = dim.y;};
        var _S76 : vec2<f32> = fragCoordJittered_0 / vec2<f32>(f32(w_0), f32(h_2)) * vec2<f32>(2.0f) - vec2<f32>(1.0f);
        var screenPos_0 : vec2<f32> = _S76;
        screenPos_0[i32(1)] = - _S76.y;
        var _S77 : vec4<f32> = (((mat4x4<f32>(_Transform_0CB.InvViewProjMtx_0.data_0[i32(0)][i32(0)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(0)][i32(1)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(0)][i32(2)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(0)][i32(3)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(1)][i32(0)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(1)][i32(1)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(1)][i32(2)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(1)][i32(3)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(2)][i32(0)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(2)][i32(1)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(2)][i32(2)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(2)][i32(3)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(3)][i32(0)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(3)][i32(1)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(3)][i32(2)], _Transform_0CB.InvViewProjMtx_0.data_0[i32(3)][i32(3)])) * (vec4<f32>(screenPos_0, 0.0f, 1.0f))));
        var world_0 : vec4<f32> = _S77;
        var _S78 : vec3<f32> = _S77.xyz / vec3<f32>(_S77.w);
        world_0.x = _S78.x;
        world_0.y = _S78.y;
        world_0.z = _S78.z;
        var rayOrigin_0 : vec3<f32> = _Transform_0CB.CameraPos_0;
        var rayDirection_0 : vec3<f32> = normalize(world_0.xyz - _Transform_0CB.CameraPos_0);
        var cameraRight_0 : vec3<f32> = (((mat4x4<f32>(_Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(3)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(3)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(3)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(3)])) * (vec4<f32>(1.0f, 0.0f, 0.0f, 0.0f)))).xyz;
        var cameraUp_0 : vec3<f32> = (((mat4x4<f32>(_Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(0)][i32(3)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(1)][i32(3)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(2)][i32(3)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(0)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(1)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(2)], _Transform_0CB.InvViewMtx_0.data_0[i32(3)][i32(3)])) * (vec4<f32>(0.0f, 1.0f, 0.0f, 0.0f)))).xyz;
        var focalPlanePoint_0 : vec3<f32> = rayOrigin_0 + rayDirection_0 * vec3<f32>(80.0f);
        var _S79 : f32 = RandomFloat01_0(&(rngState_1));
        var angle_0 : f32 = _S79 * 2.0f * 3.14159274101257324f;
        var _S80 : f32 = RandomFloat01_0(&(rngState_1));
        var offset_0 : vec2<f32> = vec2<f32>(cos(angle_0), sin(angle_0)) * vec2<f32>((sqrt(_S80) * 0.40000000596046448f));
        var rayOrigin_1 : vec3<f32> = rayOrigin_0 + (vec3<f32>(offset_0.x) * cameraRight_0 + vec3<f32>(offset_0.y) * cameraUp_0);
        var _S81 : vec3<f32> = GetColorForRay_0(rayOrigin_1, normalize(focalPlanePoint_0 - rayOrigin_1), &(rngState_1), i32(4), u32(256), 0.10000000149011612f);
        var _S82 : i32 = rayIndex_0 + i32(1);
        var _S83 : vec3<f32> = mix(color_0, _S81, vec3<f32>((1.0f / f32(_S82))));
        color_0 = _S83;
        rayIndex_0 = _S82;
    }
    var _S84 : vec4<f32> = (textureLoad((AccumulationReadOnly), (vec2<i32>(px_0))));
    var _S85 : bool = (_Transform_0CB.iFrame_0) < i32(2);
    var _S86 : bool;
    if(_S85)
    {
        _S86 = true;
    }
    else
    {
        _S86 = (_S84.w) == 0.0f;
    }
    if(_S86)
    {
        _S86 = true;
    }
    else
    {
        _S86 = bool(_Transform_0CB.CameraChanged_0);
    }
    var blend_0 : f32;
    if(_S86)
    {
        blend_0 = 1.0f;
    }
    else
    {
        blend_0 = 1.0f / (1.0f + 1.0f / _S84.w);
    }
    var color_1 : vec3<f32> = mix(_S84.xyz, color_0, vec3<f32>(blend_0));
    textureStore((Accumulation), (px_0), (vec4<f32>(color_1, blend_0)));
    return ACESFilm_0(color_1 / vec3<f32>(0.60000002384185791f));
}

fn EvaluateBezier_Linear_0( t_1 : vec3<f32>,  CP1_1 : vec3<f32>,  CP2_1 : vec3<f32>) -> vec3<f32>
{
    return CP1_1 * (vec3<f32>(1.0f) - t_1) + CP2_1 * t_1;
}

fn EvaluateBezier_Quadratic_0( t_2 : vec3<f32>,  CP1_2 : vec3<f32>,  CP2_2 : vec3<f32>,  CP3_1 : vec3<f32>) -> vec3<f32>
{
    var s_0 : vec3<f32> = vec3<f32>(1.0f) - t_2;
    return CP1_2 * s_0 * s_0 + vec3<f32>(2.0f) * CP2_2 * s_0 * t_2 + CP3_1 * t_2 * t_2;
}

fn EvaluateBezier_Cubic_0( t_3 : vec3<f32>,  CP1_3 : vec3<f32>,  CP2_3 : vec3<f32>,  CP3_2 : vec3<f32>,  CP4_1 : vec3<f32>) -> vec3<f32>
{
    var s_1 : vec3<f32> = vec3<f32>(1.0f) - t_3;
    var _S87 : vec3<f32> = vec3<f32>(3.0f);
    return CP1_3 * s_1 * s_1 * s_1 + _S87 * CP2_3 * s_1 * s_1 * t_3 + _S87 * CP3_2 * s_1 * t_3 * t_3 + CP4_1 * t_3 * t_3 * t_3;
}

fn EvaluateBezier_Quartic_0( t_4 : vec3<f32>,  CP1_4 : vec3<f32>,  CP2_4 : vec3<f32>,  CP3_3 : vec3<f32>,  CP4_2 : vec3<f32>,  CP5_1 : vec3<f32>) -> vec3<f32>
{
    var s_2 : vec3<f32> = vec3<f32>(1.0f) - t_4;
    var _S88 : vec3<f32> = vec3<f32>(4.0f);
    return CP1_4 * s_2 * s_2 * s_2 * s_2 + _S88 * CP2_4 * s_2 * s_2 * t_4 * s_2 + vec3<f32>(6.0f) * CP3_3 * s_2 * t_4 * t_4 * s_2 + _S88 * CP4_2 * s_2 * t_4 * t_4 * t_4 + CP5_1 * t_4 * t_4 * t_4 * t_4;
}

fn EvaluateBezier_Quintic_0( t_5 : vec3<f32>,  CP1_5 : vec3<f32>,  CP2_5 : vec3<f32>,  CP3_4 : vec3<f32>,  CP4_3 : vec3<f32>,  CP5_2 : vec3<f32>,  CP6_1 : vec3<f32>) -> vec3<f32>
{
    var s_3 : vec3<f32> = vec3<f32>(1.0f) - t_5;
    var _S89 : vec3<f32> = vec3<f32>(5.0f);
    var _S90 : vec3<f32> = vec3<f32>(10.0f);
    return CP1_5 * s_3 * s_3 * s_3 * s_3 * s_3 + _S89 * CP2_5 * s_3 * s_3 * s_3 * t_5 * s_3 + _S90 * CP3_4 * s_3 * s_3 * t_5 * t_5 * s_3 + _S90 * CP4_3 * s_3 * s_3 * t_5 * t_5 * t_5 + _S89 * CP5_2 * s_3 * t_5 * t_5 * t_5 * t_5 + CP6_1 * t_5 * t_5 * t_5 * t_5 * t_5;
}

fn EvaluatePolynomial_0( t_6 : vec3<f32>) -> vec3<f32>
{
    switch(_Transform_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return EvaluateBezier_Linear_0(t_6, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0);
        }
    case i32(1), :
        {
            return EvaluateBezier_Quadratic_0(t_6, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0);
        }
    case i32(2), :
        {
            return EvaluateBezier_Cubic_0(t_6, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0, _Transform_0CB.CP4_0);
        }
    case i32(3), :
        {
            return EvaluateBezier_Quartic_0(t_6, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0, _Transform_0CB.CP4_0, _Transform_0CB.CP5_0);
        }
    case i32(4), :
        {
            return EvaluateBezier_Quintic_0(t_6, _Transform_0CB.CP1_0, _Transform_0CB.CP2_0, _Transform_0CB.CP3_0, _Transform_0CB.CP4_0, _Transform_0CB.CP5_0, _Transform_0CB.CP6_0);
        }
    case default, :
        {
            break;
        }
    }
    return vec3<f32>(0.0f);
}

fn DeCasteljauTexture_Read_Linear_0( tex_0 : texture_2d<f32>,  t_7 : vec3<f32>,  LinearSampler_0 : sampler) -> vec3<f32>
{
    const _S91 : vec2<f32> = vec2<f32>(0.25f, 0.25f);
    const _S92 : vec2<f32> = vec2<f32>(0.75f, 0.25f);
    return vec3<f32>((textureSampleLevel((tex_0), (LinearSampler_0), (mix(_S91, _S92, vec2<f32>(t_7.x))), (0.0f))).x, (textureSampleLevel((tex_0), (LinearSampler_0), (mix(_S91, _S92, vec2<f32>(t_7.y))), (0.0f))).y, (textureSampleLevel((tex_0), (LinearSampler_0), (mix(_S91, _S92, vec2<f32>(t_7.z))), (0.0f))).z);
}

fn DeCasteljauTexture_Read_Quadratic_0( tex_1 : texture_2d<f32>,  t_8 : vec3<f32>,  LinearSampler_1 : sampler) -> vec3<f32>
{
    const _S93 : vec2<f32> = vec2<f32>(0.25f, 0.25f);
    const _S94 : vec2<f32> = vec2<f32>(0.75f, 0.75f);
    return vec3<f32>((textureSampleLevel((tex_1), (LinearSampler_1), (mix(_S93, _S94, vec2<f32>(t_8.x))), (0.0f))).x, (textureSampleLevel((tex_1), (LinearSampler_1), (mix(_S93, _S94, vec2<f32>(t_8.y))), (0.0f))).y, (textureSampleLevel((tex_1), (LinearSampler_1), (mix(_S93, _S94, vec2<f32>(t_8.z))), (0.0f))).z);
}

fn DeCasteljauTexture_Read_Cubic_0( tex_2 : texture_3d<f32>,  t_9 : vec3<f32>,  LinearSampler_2 : sampler) -> vec3<f32>
{
    var dims_0 : vec3<u32>;
    var _S95 : u32 = dims_0[i32(0)];
    var _S96 : u32 = dims_0[i32(1)];
    var _S97 : u32 = dims_0[i32(2)];
    {var dim = textureDimensions((tex_2));((_S95)) = dim.x;((_S96)) = dim.y;((_S97)) = dim.z;};
    dims_0[i32(0)] = _S95;
    dims_0[i32(1)] = _S96;
    dims_0[i32(2)] = _S97;
    const _S98 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const _S99 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    const _S100 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    return vec3<f32>((textureSampleLevel((tex_2), (LinearSampler_2), ((mix(_S98, _S99, vec3<f32>(t_9.x)) + _S100) / vec3<f32>(dims_0)), (0.0f))).x, (textureSampleLevel((tex_2), (LinearSampler_2), ((mix(_S98, _S99, vec3<f32>(t_9.y)) + _S100) / vec3<f32>(dims_0)), (0.0f))).y, (textureSampleLevel((tex_2), (LinearSampler_2), ((mix(_S98, _S99, vec3<f32>(t_9.z)) + _S100) / vec3<f32>(dims_0)), (0.0f))).z);
}

fn DeCasteljauTexture_Read_Quartic_0( tex_3 : texture_3d<f32>,  t_10 : vec3<f32>,  LinearSampler_3 : sampler) -> vec3<f32>
{
    var dims_1 : vec3<u32>;
    var _S101 : u32 = dims_1[i32(0)];
    var _S102 : u32 = dims_1[i32(1)];
    var _S103 : u32 = dims_1[i32(2)];
    {var dim = textureDimensions((tex_3));((_S101)) = dim.x;((_S102)) = dim.y;((_S103)) = dim.z;};
    dims_1[i32(0)] = _S101;
    dims_1[i32(1)] = _S102;
    dims_1[i32(2)] = _S103;
    var A_8 : vec3<f32>;
    const _S104 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const _S105 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    var _S106 : vec3<f32> = vec3<f32>(t_10.x);
    const _S107 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    A_8[i32(0)] = (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(_S104, _S105, _S106) + _S107) / vec3<f32>(dims_1)), (0.0f))).x;
    var _S108 : vec3<f32> = vec3<f32>(t_10.y);
    A_8[i32(1)] = (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(_S104, _S105, _S108) + _S107) / vec3<f32>(dims_1)), (0.0f))).y;
    var _S109 : vec3<f32> = vec3<f32>(t_10.z);
    A_8[i32(2)] = (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(_S104, _S105, _S109) + _S107) / vec3<f32>(dims_1)), (0.0f))).z;
    var B_9 : vec3<f32>;
    const _S110 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 1.0f);
    const _S111 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 2.0f);
    B_9[i32(0)] = (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(_S110, _S111, _S106) + _S107) / vec3<f32>(dims_1)), (0.0f))).x;
    B_9[i32(1)] = (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(_S110, _S111, _S108) + _S107) / vec3<f32>(dims_1)), (0.0f))).y;
    B_9[i32(2)] = (textureSampleLevel((tex_3), (LinearSampler_3), ((mix(_S110, _S111, _S109) + _S107) / vec3<f32>(dims_1)), (0.0f))).z;
    return mix(A_8, B_9, t_10);
}

fn DeCasteljauTexture_Read_Quintic_0( tex_4 : texture_3d<f32>,  t_11 : vec3<f32>,  LinearSampler_4 : sampler) -> vec3<f32>
{
    var dims_2 : vec3<u32>;
    var _S112 : u32 = dims_2[i32(0)];
    var _S113 : u32 = dims_2[i32(1)];
    var _S114 : u32 = dims_2[i32(2)];
    {var dim = textureDimensions((tex_4));((_S112)) = dim.x;((_S113)) = dim.y;((_S114)) = dim.z;};
    dims_2[i32(0)] = _S112;
    dims_2[i32(1)] = _S113;
    dims_2[i32(2)] = _S114;
    var A_9 : vec3<f32>;
    const _S115 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const _S116 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    var _S117 : vec3<f32> = vec3<f32>(t_11.x);
    const _S118 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    A_9[i32(0)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S115, _S116, _S117) + _S118) / vec3<f32>(dims_2)), (0.0f))).x;
    var _S119 : vec3<f32> = vec3<f32>(t_11.y);
    A_9[i32(1)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S115, _S116, _S119) + _S118) / vec3<f32>(dims_2)), (0.0f))).y;
    var _S120 : vec3<f32> = vec3<f32>(t_11.z);
    A_9[i32(2)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S115, _S116, _S120) + _S118) / vec3<f32>(dims_2)), (0.0f))).z;
    var B_10 : vec3<f32>;
    const _S121 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 1.0f);
    const _S122 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 2.0f);
    B_10[i32(0)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S121, _S122, _S117) + _S118) / vec3<f32>(dims_2)), (0.0f))).x;
    B_10[i32(1)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S121, _S122, _S119) + _S118) / vec3<f32>(dims_2)), (0.0f))).y;
    B_10[i32(2)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S121, _S122, _S120) + _S118) / vec3<f32>(dims_2)), (0.0f))).z;
    var C_6 : vec3<f32>;
    const _S123 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 2.0f);
    const _S124 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 3.0f);
    C_6[i32(0)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S123, _S124, _S117) + _S118) / vec3<f32>(dims_2)), (0.0f))).x;
    C_6[i32(1)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S123, _S124, _S119) + _S118) / vec3<f32>(dims_2)), (0.0f))).y;
    C_6[i32(2)] = (textureSampleLevel((tex_4), (LinearSampler_4), ((mix(_S123, _S124, _S120) + _S118) / vec3<f32>(dims_2)), (0.0f))).z;
    var s_4 : vec3<f32> = vec3<f32>(1.0f) - t_11;
    return A_9 * s_4 * s_4 + vec3<f32>(2.0f) * B_10 * s_4 * t_11 + C_6 * t_11 * t_11;
}

fn EvaluateTextureDeCasteljau_0( t_12 : vec3<f32>) -> vec3<f32>
{
    switch(_Transform_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return DeCasteljauTexture_Read_Linear_0(DCTexture2D, t_12, LinearSampler);
        }
    case i32(1), :
        {
            return DeCasteljauTexture_Read_Quadratic_0(DCTexture2D, t_12, LinearSampler);
        }
    case i32(2), :
        {
            return DeCasteljauTexture_Read_Cubic_0(DCTexture3D, t_12, LinearSampler);
        }
    case i32(3), :
        {
            return DeCasteljauTexture_Read_Quartic_0(DCTexture3D, t_12, LinearSampler);
        }
    case i32(4), :
        {
            return DeCasteljauTexture_Read_Quintic_0(DCTexture3D, t_12, LinearSampler);
        }
    case default, :
        {
            break;
        }
    }
    return vec3<f32>(0.0f);
}

fn SeilerTexture_Read_Linear_0( tex_5 : texture_2d<f32>,  t_13 : vec3<f32>,  LinearSampler_5 : sampler) -> vec3<f32>
{
    const _S125 : vec2<f32> = vec2<f32>(0.25f, 0.25f);
    const _S126 : vec2<f32> = vec2<f32>(0.75f, 0.75f);
    return vec3<f32>((textureSampleLevel((tex_5), (LinearSampler_5), (mix(_S125, _S126, vec2<f32>(t_13.x, 0.0f))), (0.0f))).x, (textureSampleLevel((tex_5), (LinearSampler_5), (mix(_S125, _S126, vec2<f32>(t_13.y, 0.0f))), (0.0f))).y, (textureSampleLevel((tex_5), (LinearSampler_5), (mix(_S125, _S126, vec2<f32>(t_13.z, 0.0f))), (0.0f))).z);
}

fn SeilerTexture_Read_Quadratic_0( tex_6 : texture_2d<f32>,  t_14 : vec3<f32>,  LinearSampler_6 : sampler) -> vec3<f32>
{
    var s_5 : vec3<f32> = vec3<f32>(1.0f) - t_14;
    const _S127 : vec2<f32> = vec2<f32>(0.25f, 0.25f);
    const _S128 : vec2<f32> = vec2<f32>(0.75f, 0.75f);
    var _S129 : f32 = t_14.x;
    var _S130 : f32 = t_14.y;
    var _S131 : f32 = t_14.z;
    return vec3<f32>((textureSampleLevel((tex_6), (LinearSampler_6), (mix(_S127, _S128, vec2<f32>(_S129, s_5.x * _S129))), (0.0f))).x, (textureSampleLevel((tex_6), (LinearSampler_6), (mix(_S127, _S128, vec2<f32>(_S130, s_5.y * _S130))), (0.0f))).y, (textureSampleLevel((tex_6), (LinearSampler_6), (mix(_S127, _S128, vec2<f32>(_S131, s_5.z * _S131))), (0.0f))).z);
}

fn SeilerTexture_Read_Cubic_0( tex_7 : texture_2d<f32>,  t_15 : vec3<f32>,  LinearSampler_7 : sampler) -> vec3<f32>
{
    var s_6 : vec3<f32> = vec3<f32>(1.0f) - t_15;
    const _S132 : vec2<f32> = vec2<f32>(0.25f, 0.25f);
    const _S133 : vec2<f32> = vec2<f32>(0.75f, 0.75f);
    var _S134 : f32 = t_15.x;
    var _S135 : f32 = t_15.y;
    var _S136 : f32 = t_15.z;
    return vec3<f32>((textureSampleLevel((tex_7), (LinearSampler_7), (mix(_S132, _S133, vec2<f32>(_S134, s_6.x * _S134))), (0.0f))).x, (textureSampleLevel((tex_7), (LinearSampler_7), (mix(_S132, _S133, vec2<f32>(_S135, s_6.y * _S135))), (0.0f))).y, (textureSampleLevel((tex_7), (LinearSampler_7), (mix(_S132, _S133, vec2<f32>(_S136, s_6.z * _S136))), (0.0f))).z);
}

fn SeilerTexture_Read_Quartic_0( tex_8 : texture_3d<f32>,  t_16 : vec3<f32>,  LinearSampler_8 : sampler) -> vec3<f32>
{
    var dims_3 : vec3<u32>;
    var _S137 : u32 = dims_3[i32(0)];
    var _S138 : u32 = dims_3[i32(1)];
    var _S139 : u32 = dims_3[i32(2)];
    {var dim = textureDimensions((tex_8));((_S137)) = dim.x;((_S138)) = dim.y;((_S139)) = dim.z;};
    dims_3[i32(0)] = _S137;
    dims_3[i32(1)] = _S138;
    dims_3[i32(2)] = _S139;
    var s_7 : vec3<f32> = vec3<f32>(1.0f) - t_16;
    const _S140 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const _S141 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    var _S142 : f32 = t_16.x;
    var _S143 : f32 = s_7.x * _S142;
    const _S144 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    var _S145 : f32 = t_16.y;
    var _S146 : f32 = s_7.y * _S145;
    var _S147 : f32 = t_16.z;
    var _S148 : f32 = s_7.z * _S147;
    return vec3<f32>((textureSampleLevel((tex_8), (LinearSampler_8), ((mix(_S140, _S141, vec3<f32>(_S142, _S143, _S143)) + _S144) / vec3<f32>(dims_3)), (0.0f))).x, (textureSampleLevel((tex_8), (LinearSampler_8), ((mix(_S140, _S141, vec3<f32>(_S145, _S146, _S146)) + _S144) / vec3<f32>(dims_3)), (0.0f))).y, (textureSampleLevel((tex_8), (LinearSampler_8), ((mix(_S140, _S141, vec3<f32>(_S147, _S148, _S148)) + _S144) / vec3<f32>(dims_3)), (0.0f))).z);
}

fn SeilerTexture_Read_Quintic_0( tex_9 : texture_3d<f32>,  t_17 : vec3<f32>,  LinearSampler_9 : sampler) -> vec3<f32>
{
    var dims_4 : vec3<u32>;
    var _S149 : u32 = dims_4[i32(0)];
    var _S150 : u32 = dims_4[i32(1)];
    var _S151 : u32 = dims_4[i32(2)];
    {var dim = textureDimensions((tex_9));((_S149)) = dim.x;((_S150)) = dim.y;((_S151)) = dim.z;};
    dims_4[i32(0)] = _S149;
    dims_4[i32(1)] = _S150;
    dims_4[i32(2)] = _S151;
    var s_8 : vec3<f32> = vec3<f32>(1.0f) - t_17;
    const _S152 : vec3<f32> = vec3<f32>(0.0f, 0.0f, 0.0f);
    const _S153 : vec3<f32> = vec3<f32>(1.0f, 1.0f, 1.0f);
    var _S154 : f32 = t_17.x;
    var _S155 : f32 = s_8.x * _S154;
    const _S156 : vec3<f32> = vec3<f32>(0.5f, 0.5f, 0.5f);
    var _S157 : f32 = t_17.y;
    var _S158 : f32 = s_8.y * _S157;
    var _S159 : f32 = t_17.z;
    var _S160 : f32 = s_8.z * _S159;
    return vec3<f32>((textureSampleLevel((tex_9), (LinearSampler_9), ((mix(_S152, _S153, vec3<f32>(_S154, _S155, _S155)) + _S156) / vec3<f32>(dims_4)), (0.0f))).x, (textureSampleLevel((tex_9), (LinearSampler_9), ((mix(_S152, _S153, vec3<f32>(_S157, _S158, _S158)) + _S156) / vec3<f32>(dims_4)), (0.0f))).y, (textureSampleLevel((tex_9), (LinearSampler_9), ((mix(_S152, _S153, vec3<f32>(_S159, _S160, _S160)) + _S156) / vec3<f32>(dims_4)), (0.0f))).z);
}

fn EvaluateTextureSeiler_0( t_18 : vec3<f32>) -> vec3<f32>
{
    switch(_Transform_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return SeilerTexture_Read_Linear_0(SeilerTexture2D, t_18, LinearSampler);
        }
    case i32(1), :
        {
            return SeilerTexture_Read_Quadratic_0(SeilerTexture2D, t_18, LinearSampler);
        }
    case i32(2), :
        {
            return SeilerTexture_Read_Cubic_0(SeilerTexture2D, t_18, LinearSampler);
        }
    case i32(3), :
        {
            return SeilerTexture_Read_Quartic_0(SeilerTexture3D, t_18, LinearSampler);
        }
    case i32(4), :
        {
            return SeilerTexture_Read_Quintic_0(SeilerTexture3D, t_18, LinearSampler);
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
    var _S161 : f32;
    if((linearCol_0.x) <= 0.00313080009073019f)
    {
        _S161 = sRGBLo_0.x;
    }
    else
    {
        _S161 = sRGBHi_0.x;
    }
    sRGB_0[i32(0)] = _S161;
    if((linearCol_0.y) <= 0.00313080009073019f)
    {
        _S161 = sRGBLo_0.y;
    }
    else
    {
        _S161 = sRGBHi_0.y;
    }
    sRGB_0[i32(1)] = _S161;
    if((linearCol_0.z) <= 0.00313080009073019f)
    {
        _S161 = sRGBLo_0.z;
    }
    else
    {
        _S161 = sRGBHi_0.z;
    }
    sRGB_0[i32(2)] = _S161;
    return sRGB_0;
}

@compute
@workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) DTid_0 : vec3<u32>)
{
    var px_1 : vec2<u32> = DTid_0.xy;
    var _S162 : vec3<i32> = vec3<i32>(vec3<u32>(px_1, u32(0)));
    var _S163 : vec3<f32> = (textureLoad((Input), ((_S162)).xy, ((_S162)).z)).xyz;
    var color_2 : vec3<f32>;
    if(bool(_Transform_0CB.RenderScene_0))
    {
        var _S164 : vec3<f32> = RenderScene_1(px_1);
        color_2 = _S164;
    }
    else
    {
        color_2 = _S163;
    }
    switch(_Transform_0CB.CurveType_0)
    {
    case i32(0), :
        {
            color_2 = EvaluatePolynomial_0(color_2);
            break;
        }
    case i32(1), :
        {
            color_2 = EvaluateTextureDeCasteljau_0(color_2);
            break;
        }
    case i32(2), :
        {
            color_2 = EvaluateTextureSeiler_0(color_2);
            break;
        }
    case default, :
        {
            color_2 = vec3<f32>(1.0f, 0.0f, 1.0f);
            break;
        }
    }
    textureStore((Output), (px_1), (vec4<f32>(LinearToSRGB_0(color_2), 1.0f)));
    return;
}

`;

// Shader code for Compute shader "MakeCurveTextures_0", node "MakeCurveTextures"
static ShaderCode_MakeCurveTextures_MakeCurveTextures_0 = `
struct Struct_MakeCurveTextures_0CB_std140_0
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
};

@binding(8) @group(0) var<uniform> _MakeCurveTextures_0CB : Struct_MakeCurveTextures_0CB_std140_0;
@binding(0) @group(0) var DCTexture2D : texture_storage_2d</*(DCTexture2D_format)*/, write>;

@binding(2) @group(0) var SeilerTexture2D : texture_storage_2d</*(SeilerTexture2D_format)*/, write>;

@binding(1) @group(0) var DCTexture3D : texture_storage_3d</*(DCTexture3D_format)*/, write>;

@binding(3) @group(0) var SeilerTexture3D : texture_storage_3d</*(SeilerTexture3D_format)*/, write>;

fn DeCasteljauTexture_Write_Linear_0( _S1 : vec3<f32>,  _S2 : vec3<f32>)
{
    textureStore((DCTexture2D), (vec2<u32>(u32(0), u32(0))), (vec4<f32>(_S1, 1.0f)));
    textureStore((DCTexture2D), (vec2<u32>(u32(1), u32(0))), (vec4<f32>(_S2, 1.0f)));
    return;
}

fn SeilerTexture_Write_Linear_0( _S3 : vec3<f32>,  _S4 : vec3<f32>)
{
    textureStore((SeilerTexture2D), (vec2<u32>(u32(0), u32(0))), (vec4<f32>(_S3, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(1), u32(0))), (vec4<f32>(_S4, 1.0f)));
    return;
}

fn MakeLinear_0()
{
    DeCasteljauTexture_Write_Linear_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0);
    SeilerTexture_Write_Linear_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0);
    return;
}

fn DeCasteljauTexture_Write_Quadratic_0( _S5 : vec3<f32>,  _S6 : vec3<f32>,  _S7 : vec3<f32>)
{
    textureStore((DCTexture2D), (vec2<u32>(u32(0), u32(0))), (vec4<f32>(_S5, 1.0f)));
    var _S8 : vec4<f32> = vec4<f32>(_S6, 1.0f);
    textureStore((DCTexture2D), (vec2<u32>(u32(1), u32(0))), (_S8));
    textureStore((DCTexture2D), (vec2<u32>(u32(0), u32(1))), (_S8));
    textureStore((DCTexture2D), (vec2<u32>(u32(1), u32(1))), (vec4<f32>(_S7, 1.0f)));
    return;
}

fn SeilerTexture_Write_Quadratic_0( _S9 : vec3<f32>,  _S10 : vec3<f32>,  _S11 : vec3<f32>)
{
    var d1_0 : vec3<f32> = vec3<f32>(2.0f) * (_S10 - _S9) - (_S11 - _S9);
    textureStore((SeilerTexture2D), (vec2<u32>(u32(0), u32(0))), (vec4<f32>(_S9, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(1), u32(0))), (vec4<f32>(_S11, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(0), u32(1))), (vec4<f32>(_S9 + d1_0, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(1), u32(1))), (vec4<f32>(_S11 + d1_0, 1.0f)));
    return;
}

fn MakeQuadratic_0()
{
    DeCasteljauTexture_Write_Quadratic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0);
    SeilerTexture_Write_Quadratic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0);
    return;
}

fn DeCasteljauTexture_Write_Cubic_0( _S12 : vec3<f32>,  _S13 : vec3<f32>,  _S14 : vec3<f32>,  _S15 : vec3<f32>)
{
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(0))), (vec4<f32>(_S12, 1.0f)));
    var _S16 : vec4<f32> = vec4<f32>(_S13, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(0))), (_S16));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(0))), (_S16));
    var _S17 : vec4<f32> = vec4<f32>(_S14, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(0))), (_S17));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(1))), (_S16));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(1))), (_S17));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(1))), (_S17));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(1))), (vec4<f32>(_S15, 1.0f)));
    return;
}

fn SeilerTexture_Write_Cubic_0( _S18 : vec3<f32>,  _S19 : vec3<f32>,  _S20 : vec3<f32>,  _S21 : vec3<f32>)
{
    var _S22 : vec3<f32> = vec3<f32>(3.0f);
    var d1_1 : vec3<f32> = _S22 * (_S19 - _S18) - (_S21 - _S18);
    var d2_0 : vec3<f32> = _S22 * (_S20 - _S21) - (_S18 - _S21);
    textureStore((SeilerTexture2D), (vec2<u32>(u32(0), u32(0))), (vec4<f32>(_S18, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(1), u32(0))), (vec4<f32>(_S21, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(0), u32(1))), (vec4<f32>(_S18 + d1_1, 1.0f)));
    textureStore((SeilerTexture2D), (vec2<u32>(u32(1), u32(1))), (vec4<f32>(_S21 + d2_0, 1.0f)));
    return;
}

fn MakeCubic_0()
{
    DeCasteljauTexture_Write_Cubic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0, _MakeCurveTextures_0CB.CP4_0);
    SeilerTexture_Write_Cubic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0, _MakeCurveTextures_0CB.CP4_0);
    return;
}

fn DeCasteljauTexture_Write_Quartic_0( _S23 : vec3<f32>,  _S24 : vec3<f32>,  _S25 : vec3<f32>,  _S26 : vec3<f32>,  _S27 : vec3<f32>)
{
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(0))), (vec4<f32>(_S23, 1.0f)));
    var _S28 : vec4<f32> = vec4<f32>(_S24, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(0))), (_S28));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(0))), (_S28));
    var _S29 : vec4<f32> = vec4<f32>(_S25, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(0))), (_S29));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(1))), (_S28));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(1))), (_S29));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(1))), (_S29));
    var _S30 : vec4<f32> = vec4<f32>(_S26, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(1))), (_S30));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(2))), (_S29));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(2))), (_S30));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(2))), (_S30));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(2))), (vec4<f32>(_S27, 1.0f)));
    return;
}

fn SeilerTexture_Write_Quartic_0( _S31 : vec3<f32>,  _S32 : vec3<f32>,  _S33 : vec3<f32>,  _S34 : vec3<f32>,  _S35 : vec3<f32>)
{
    var _S36 : vec3<f32> = _S32 - _S31;
    var _S37 : vec3<f32> = vec3<f32>(4.0f);
    var d1_2 : vec3<f32> = _S37 * _S36 - (_S35 - _S31);
    var _S38 : vec3<f32> = _S34 - _S35;
    var d3_0 : vec3<f32> = _S37 * _S38 - (_S31 - _S35);
    var d2_1 : vec3<f32> = vec3<f32>(6.0f) * (_S33 - _S32) - _S36 - _S38 - vec3<f32>(3.0f) * (_S34 - _S32);
    var _S39 : vec4<f32> = vec4<f32>(_S31, 1.0f);
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(0), u32(0))), (_S39));
    var _S40 : vec4<f32> = vec4<f32>(_S35, 1.0f);
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(0), u32(0))), (_S40));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(1), u32(0))), (_S39));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(1), u32(0))), (_S40));
    var _S41 : vec3<f32> = _S31 + d1_2;
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(0), u32(1))), (vec4<f32>(_S41, 1.0f)));
    var _S42 : vec3<f32> = _S35 + d3_0;
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(0), u32(1))), (vec4<f32>(_S42, 1.0f)));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(1), u32(1))), (vec4<f32>(_S41 + d2_1, 1.0f)));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(1), u32(1))), (vec4<f32>(_S42 + d2_1, 1.0f)));
    return;
}

fn MakeQuartic_0()
{
    DeCasteljauTexture_Write_Quartic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0, _MakeCurveTextures_0CB.CP4_0, _MakeCurveTextures_0CB.CP5_0);
    SeilerTexture_Write_Quartic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0, _MakeCurveTextures_0CB.CP4_0, _MakeCurveTextures_0CB.CP5_0);
    return;
}

fn DeCasteljauTexture_Write_Quintic_0( _S43 : vec3<f32>,  _S44 : vec3<f32>,  _S45 : vec3<f32>,  _S46 : vec3<f32>,  _S47 : vec3<f32>,  _S48 : vec3<f32>)
{
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(0))), (vec4<f32>(_S43, 1.0f)));
    var _S49 : vec4<f32> = vec4<f32>(_S44, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(0))), (_S49));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(0))), (_S49));
    var _S50 : vec4<f32> = vec4<f32>(_S45, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(0))), (_S50));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(1))), (_S49));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(1))), (_S50));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(1))), (_S50));
    var _S51 : vec4<f32> = vec4<f32>(_S46, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(1))), (_S51));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(2))), (_S50));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(2))), (_S51));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(2))), (_S51));
    var _S52 : vec4<f32> = vec4<f32>(_S47, 1.0f);
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(2))), (_S52));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(0), u32(3))), (_S51));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(0), u32(3))), (_S52));
    textureStore((DCTexture3D), (vec3<u32>(u32(0), u32(1), u32(3))), (_S52));
    textureStore((DCTexture3D), (vec3<u32>(u32(1), u32(1), u32(3))), (vec4<f32>(_S48, 1.0f)));
    return;
}

fn SeilerTexture_Write_Quintic_0( _S53 : vec3<f32>,  _S54 : vec3<f32>,  _S55 : vec3<f32>,  _S56 : vec3<f32>,  _S57 : vec3<f32>,  _S58 : vec3<f32>)
{
    var _S59 : vec3<f32> = _S54 - _S53;
    var _S60 : vec3<f32> = vec3<f32>(5.0f);
    var d1_3 : vec3<f32> = _S60 * _S59 - (_S58 - _S53);
    var _S61 : vec3<f32> = _S57 - _S58;
    var d4_0 : vec3<f32> = _S60 * _S61 - (_S53 - _S58);
    var _S62 : vec3<f32> = vec3<f32>(10.0f);
    var _S63 : vec3<f32> = vec3<f32>(3.0f);
    var _S64 : vec3<f32> = vec3<f32>(2.0f);
    var d2_2 : vec3<f32> = _S62 * (_S55 - _S54) - _S63 * _S59 - _S64 * _S61 - _S63 * (_S57 - _S54);
    var d3_1 : vec3<f32> = _S62 * (_S56 - _S57) - _S63 * _S61 - _S64 * _S59 - _S63 * (_S54 - _S57);
    var _S65 : vec4<f32> = vec4<f32>(_S53, 1.0f);
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(0), u32(0))), (_S65));
    var _S66 : vec4<f32> = vec4<f32>(_S58, 1.0f);
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(0), u32(0))), (_S66));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(1), u32(0))), (_S65));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(1), u32(0))), (_S66));
    var _S67 : vec3<f32> = _S53 + d1_3;
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(0), u32(1))), (vec4<f32>(_S67, 1.0f)));
    var _S68 : vec3<f32> = _S58 + d4_0;
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(0), u32(1))), (vec4<f32>(_S68, 1.0f)));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(0), u32(1), u32(1))), (vec4<f32>(_S67 + d2_2, 1.0f)));
    textureStore((SeilerTexture3D), (vec3<u32>(u32(1), u32(1), u32(1))), (vec4<f32>(_S68 + d3_1, 1.0f)));
    return;
}

fn MakeQuintic_0()
{
    DeCasteljauTexture_Write_Quintic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0, _MakeCurveTextures_0CB.CP4_0, _MakeCurveTextures_0CB.CP5_0, _MakeCurveTextures_0CB.CP6_0);
    SeilerTexture_Write_Quintic_0(_MakeCurveTextures_0CB.CP1_0, _MakeCurveTextures_0CB.CP2_0, _MakeCurveTextures_0CB.CP3_0, _MakeCurveTextures_0CB.CP4_0, _MakeCurveTextures_0CB.CP5_0, _MakeCurveTextures_0CB.CP6_0);
    return;
}

@compute
@workgroup_size(1, 1, 1)
fn main(@builtin(global_invocation_id) DTid_0 : vec3<u32>)
{
    var _S69 : bool;
    if((DTid_0.x) > u32(0))
    {
        _S69 = true;
    }
    else
    {
        _S69 = (DTid_0.y) > u32(0);
    }
    if(_S69)
    {
        _S69 = true;
    }
    else
    {
        _S69 = (DTid_0.z) > u32(0);
    }
    if(_S69)
    {
        return;
    }
    switch(_MakeCurveTextures_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            MakeLinear_0();
            break;
        }
    case i32(1), :
        {
            MakeQuadratic_0();
            break;
        }
    case i32(2), :
        {
            MakeCubic_0();
            break;
        }
    case i32(3), :
        {
            MakeQuartic_0();
            break;
        }
    case i32(4), :
        {
            MakeQuintic_0();
            break;
        }
    case default, :
        {
            break;
        }
    }
    return;
}

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

// Texture Accumulation
texture_Accumulation = null;
texture_Accumulation_size = [0, 0, 0];
texture_Accumulation_format = "";
texture_Accumulation_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture Transform_Output_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_Transform_Output_ReadOnly = null;
texture_Transform_Output_ReadOnly_size = [0, 0, 0];
texture_Transform_Output_ReadOnly_format = "";
texture_Transform_Output_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture Transform_Accumulation_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_Transform_Accumulation_ReadOnly = null;
texture_Transform_Accumulation_ReadOnly_size = [0, 0, 0];
texture_Transform_Accumulation_ReadOnly_format = "";
texture_Transform_Accumulation_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

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
constantBuffer__Transform_0CB_size = 272;
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

variable_RenderScene = false;  // If true, renders a scene instead of showing an image
variableDefault_RenderScene = false;  // If true, renders a scene instead of showing an image
variableChanged_RenderScene = false;
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
variable_RaysPerPixelPerFrame = 16;  // Rays per pixel per frame when rendering the scene
variableDefault_RaysPerPixelPerFrame = 16;  // Rays per pixel per frame when rendering the scene
variableChanged_RaysPerPixelPerFrame = false;
variable_NormalizedCPs = false;  // When clicked, makes a linear no-op curve out of the control points
variableDefault_NormalizedCPs = false;  // When clicked, makes a linear no-op curve out of the control points
variableChanged_NormalizedCPs = false;
variable_CameraPos = [ 0., 0., 0. ];
variableDefault_CameraPos = [ 0., 0., 0. ];
variableChanged_CameraPos = [ false, false, false ];
variable_InvViewProjMtx = [ 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0. ];
variableDefault_InvViewProjMtx = [ 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0. ];
variableChanged_InvViewProjMtx = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
variable_InvViewMtx = [ 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0. ];
variableDefault_InvViewMtx = [ 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0. ];
variableChanged_InvViewMtx = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
variable_CameraChanged = false;
variableDefault_CameraChanged = false;
variableChanged_CameraChanged = false;
variable_iFrame = 0;
variableDefault_iFrame = 0;
variableChanged_iFrame = false;

// -------------------- Private Variables

variable_NumCPsMinus1Float = 0.;
variableDefault_NumCPsMinus1Float = 0.;
variableChanged_NumCPsMinus1Float = false;
variable_ResetAccum = false;
variableDefault_ResetAccum = false;
variableChanged_ResetAccum = false;
variable_MakeCurveTexture = true;
variableDefault_MakeCurveTexture = true;
variableChanged_MakeCurveTexture = false;
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
    CameraChanged: 92,
    CameraPos_0: 96,
    CameraPos_1: 100,
    CameraPos_2: 104,
    CurveOrder: 108,
    CurveType: 112,
    _padding5: 116,
    _padding6: 120,
    _padding7: 124,
    InvViewMtx_0: 128,
    InvViewMtx_1: 132,
    InvViewMtx_2: 136,
    InvViewMtx_3: 140,
    InvViewMtx_4: 144,
    InvViewMtx_5: 148,
    InvViewMtx_6: 152,
    InvViewMtx_7: 156,
    InvViewMtx_8: 160,
    InvViewMtx_9: 164,
    InvViewMtx_10: 168,
    InvViewMtx_11: 172,
    InvViewMtx_12: 176,
    InvViewMtx_13: 180,
    InvViewMtx_14: 184,
    InvViewMtx_15: 188,
    InvViewProjMtx_0: 192,
    InvViewProjMtx_1: 196,
    InvViewProjMtx_2: 200,
    InvViewProjMtx_3: 204,
    InvViewProjMtx_4: 208,
    InvViewProjMtx_5: 212,
    InvViewProjMtx_6: 216,
    InvViewProjMtx_7: 220,
    InvViewProjMtx_8: 224,
    InvViewProjMtx_9: 228,
    InvViewProjMtx_10: 232,
    InvViewProjMtx_11: 236,
    InvViewProjMtx_12: 240,
    InvViewProjMtx_13: 244,
    InvViewProjMtx_14: 248,
    InvViewProjMtx_15: 252,
    RaysPerPixelPerFrame: 256,
    RenderScene: 260,
    iFrame: 264,
    _padding8: 268,
    _size: 272,
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

    if (this.variable_iFrame < 10)
    {
        this.variableChanged_MakeCurveTexture = true;
        this.variable_MakeCurveTexture = true;
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
        const desiredFormat = "rgba32float";
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

    // Handle (re)creation of texture Accumulation
    {
        const baseSize = this.texture_Input_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = "rgba32float";
        if (this.texture_Accumulation !== null && (this.texture_Accumulation_format != desiredFormat || this.texture_Accumulation_size[0] != desiredSize[0] || this.texture_Accumulation_size[1] != desiredSize[1] || this.texture_Accumulation_size[2] != desiredSize[2]))
        {
            this.texture_Accumulation.destroy();
            this.texture_Accumulation = null;
        }

        if (this.texture_Accumulation === null)
        {
            this.texture_Accumulation_size = desiredSize.slice();
            this.texture_Accumulation_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_Accumulation_format))
                viewFormats.push(this.texture_Accumulation_format);

            this.texture_Accumulation = device.createTexture({
                label: "texture ColorGrading.Accumulation",
                size: this.texture_Accumulation_size,
                format: Shared.GetNonSRGBFormat(this.texture_Accumulation_format),
                usage: this.texture_Accumulation_usageFlags,
                viewFormats: viewFormats,
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

    // Handle (re)creation of texture Transform_Accumulation_ReadOnly
    {
        const baseSize = this.texture_Accumulation_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_Accumulation_format;
        if (this.texture_Transform_Accumulation_ReadOnly !== null && (this.texture_Transform_Accumulation_ReadOnly_format != desiredFormat || this.texture_Transform_Accumulation_ReadOnly_size[0] != desiredSize[0] || this.texture_Transform_Accumulation_ReadOnly_size[1] != desiredSize[1] || this.texture_Transform_Accumulation_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_Transform_Accumulation_ReadOnly.destroy();
            this.texture_Transform_Accumulation_ReadOnly = null;
        }

        if (this.texture_Transform_Accumulation_ReadOnly === null)
        {
            this.texture_Transform_Accumulation_ReadOnly_size = desiredSize.slice();
            this.texture_Transform_Accumulation_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_Transform_Accumulation_ReadOnly_format))
                viewFormats.push(this.texture_Transform_Accumulation_ReadOnly_format);

            this.texture_Transform_Accumulation_ReadOnly = device.createTexture({
                label: "texture ColorGrading.Transform_Accumulation_ReadOnly",
                size: this.texture_Transform_Accumulation_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_Transform_Accumulation_ReadOnly_format),
                usage: this.texture_Transform_Accumulation_ReadOnly_usageFlags,
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
                // Accumulation
                binding: 6,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_Accumulation_format), viewDimension: "2d" }
            },
            {
                // OutputReadOnly
                binding: 7,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_Transform_Output_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // AccumulationReadOnly
                binding: 8,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_Transform_Accumulation_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // _Transform_0CB
                binding: 9,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "uniform" }
            },
            {
                // LinearSampler
                binding: 10,
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
            shaderCode = shaderCode.replace("/*(Accumulation_format)*/", Shared.GetNonSRGBFormat(this.texture_Accumulation_format));
            shaderCode = shaderCode.replace("/*(OutputReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_Transform_Output_ReadOnly_format));
            shaderCode = shaderCode.replace("/*(AccumulationReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_Transform_Accumulation_ReadOnly_format));

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

    encoder.pushDebugGroup("ColorGrading.Accumulation");

    encoder.popDebugGroup(); // "ColorGrading.Accumulation"

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

    encoder.pushDebugGroup("ColorGrading.Transform_Accumulation_ReadOnly");

    encoder.popDebugGroup(); // "ColorGrading.Transform_Accumulation_ReadOnly"

    encoder.pushDebugGroup("ColorGrading.Copy_Transform_Accumulation");

    // Copy texture Accumulation to texture Transform_Accumulation_ReadOnly
    {
        const numMips = Math.min(this.texture_Accumulation.mipLevelCount, this.texture_Transform_Accumulation_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_Accumulation.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_Accumulation.height >> mipIndex, 1);
            let mipDepth = this.texture_Accumulation.depthOrArrayLayers;

            if (this.texture_Accumulation.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_Accumulation, mipLevel: mipIndex },
                { texture: this.texture_Transform_Accumulation_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ColorGrading.Copy_Transform_Accumulation"

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
        view.setUint32(this.constructor.StructOffsets__Transform_0CB.CameraChanged, (this.variable_CameraChanged === true ? 1 : 0), true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CameraPos_0, this.variable_CameraPos[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CameraPos_1, this.variable_CameraPos[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.CameraPos_2, this.variable_CameraPos[2], true);
        view.setInt32(this.constructor.StructOffsets__Transform_0CB.CurveOrder, this.variable_CurveOrder, true);
        view.setInt32(this.constructor.StructOffsets__Transform_0CB.CurveType, this.variable_CurveType, true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_0, this.variable_InvViewMtx[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_1, this.variable_InvViewMtx[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_2, this.variable_InvViewMtx[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_3, this.variable_InvViewMtx[3], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_4, this.variable_InvViewMtx[4], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_5, this.variable_InvViewMtx[5], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_6, this.variable_InvViewMtx[6], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_7, this.variable_InvViewMtx[7], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_8, this.variable_InvViewMtx[8], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_9, this.variable_InvViewMtx[9], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_10, this.variable_InvViewMtx[10], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_11, this.variable_InvViewMtx[11], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_12, this.variable_InvViewMtx[12], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_13, this.variable_InvViewMtx[13], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_14, this.variable_InvViewMtx[14], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewMtx_15, this.variable_InvViewMtx[15], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_0, this.variable_InvViewProjMtx[0], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_1, this.variable_InvViewProjMtx[1], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_2, this.variable_InvViewProjMtx[2], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_3, this.variable_InvViewProjMtx[3], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_4, this.variable_InvViewProjMtx[4], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_5, this.variable_InvViewProjMtx[5], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_6, this.variable_InvViewProjMtx[6], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_7, this.variable_InvViewProjMtx[7], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_8, this.variable_InvViewProjMtx[8], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_9, this.variable_InvViewProjMtx[9], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_10, this.variable_InvViewProjMtx[10], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_11, this.variable_InvViewProjMtx[11], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_12, this.variable_InvViewProjMtx[12], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_13, this.variable_InvViewProjMtx[13], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_14, this.variable_InvViewProjMtx[14], true);
        view.setFloat32(this.constructor.StructOffsets__Transform_0CB.InvViewProjMtx_15, this.variable_InvViewProjMtx[15], true);
        view.setInt32(this.constructor.StructOffsets__Transform_0CB.RaysPerPixelPerFrame, this.variable_RaysPerPixelPerFrame, true);
        view.setUint32(this.constructor.StructOffsets__Transform_0CB.RenderScene, (this.variable_RenderScene === true ? 1 : 0), true);
        view.setInt32(this.constructor.StructOffsets__Transform_0CB.iFrame, this.variable_iFrame, true);
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
    if (this.variable_MakeCurveTexture)
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
                    // Accumulation
                    binding: 6,
                    resource: this.texture_Accumulation.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // OutputReadOnly
                    binding: 7,
                    resource: this.texture_Transform_Output_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // AccumulationReadOnly
                    binding: 8,
                    resource: this.texture_Transform_Accumulation_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // _Transform_0CB
                    binding: 9,
                    resource: { buffer: this.constantBuffer__Transform_0CB }
                },
                {
                    // LinearSampler
                    binding: 10,
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
