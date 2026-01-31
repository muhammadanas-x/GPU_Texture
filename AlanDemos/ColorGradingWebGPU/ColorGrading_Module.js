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

@binding(3) @group(0) var<uniform> _Transform_0CB : Struct_Transform_0CB_std140_0;
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

fn EvaluateBezierPolynomial_0( t_10 : vec3<f32>) -> vec3<f32>
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

fn LinearToSRGB_0( linearCol_0 : vec3<f32>) -> vec3<f32>
{
    var sRGBLo_0 : vec3<f32> = linearCol_0 * vec3<f32>(12.92000007629394531f);
    var sRGBHi_0 : vec3<f32> = pow(abs(linearCol_0), vec3<f32>(0.4166666567325592f, 0.4166666567325592f, 0.4166666567325592f)) * vec3<f32>(1.0549999475479126f) - vec3<f32>(0.05499999970197678f);
    var sRGB_0 : vec3<f32>;
    var _S1 : f32;
    if((linearCol_0.x) <= 0.00313080009073019f)
    {
        _S1 = sRGBLo_0.x;
    }
    else
    {
        _S1 = sRGBHi_0.x;
    }
    sRGB_0[i32(0)] = _S1;
    if((linearCol_0.y) <= 0.00313080009073019f)
    {
        _S1 = sRGBLo_0.y;
    }
    else
    {
        _S1 = sRGBHi_0.y;
    }
    sRGB_0[i32(1)] = _S1;
    if((linearCol_0.z) <= 0.00313080009073019f)
    {
        _S1 = sRGBLo_0.z;
    }
    else
    {
        _S1 = sRGBHi_0.z;
    }
    sRGB_0[i32(2)] = _S1;
    return sRGB_0;
}

@compute
@workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) DTid_0 : vec3<u32>)
{
    var px_0 : vec2<u32> = DTid_0.xy;
    var _S2 : vec3<i32> = vec3<i32>(vec3<u32>(px_0, u32(0)));
    var color_0 : vec3<f32> = (textureLoad((Input), ((_S2)).xy, ((_S2)).z)).xyz;
    var color_1 : vec3<f32>;
    switch(_Transform_0CB.CurveType_0)
    {
    case i32(0), :
        {
            color_1 = EvaluateBezierPolynomial_0(color_0);
            break;
        }
    case default, :
        {
            color_1 = color_0;
            break;
        }
    }
    textureStore((Output), (px_0), (vec4<f32>(LinearToSRGB_0(color_1), 1.0f)));
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

// Texture Transform_Output_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_Transform_Output_ReadOnly = null;
texture_Transform_Output_ReadOnly_size = [0, 0, 0];
texture_Transform_Output_ReadOnly_format = "";
texture_Transform_Output_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Constant buffer _Transform_0CB
constantBuffer__Transform_0CB = null;
constantBuffer__Transform_0CB_size = 112;
constantBuffer__Transform_0CB_usageFlags = GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM;

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
                // OutputReadOnly
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_Transform_Output_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // _Transform_0CB
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "uniform" }
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
                    // OutputReadOnly
                    binding: 2,
                    resource: this.texture_Transform_Output_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // _Transform_0CB
                    binding: 3,
                    resource: { buffer: this.constantBuffer__Transform_0CB }
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
