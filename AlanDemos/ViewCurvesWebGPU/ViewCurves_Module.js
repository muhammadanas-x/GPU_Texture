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

class class_ViewCurves
{
loadingPromises = new Set();
waitingOnPromises = false;

// -------------------- Shaders
// Shader code for Compute shader "DrawCurves_0", node "DrawCurves"
static ShaderCode_DrawCurves_DrawCurves_0 = `
@binding(0) @group(0) var Output : texture_storage_2d</*(Output_format)*/, write>;

struct Struct_DrawCurves_0CB_std140_0
{
    @align(16) CP1_0 : f32,
    @align(4) CP2_0 : f32,
    @align(8) CP3_0 : f32,
    @align(4) CP4_0 : f32,
    @align(16) CP5_0 : f32,
    @align(4) CP6_0 : f32,
    @align(8) CurveOrder_0 : i32,
    @align(4) ShowControlPoints_0 : u32,
    @align(16) ShowPolynomial_0 : u32,
    @align(4) _padding0_0 : f32,
    @align(8) _padding1_0 : f32,
    @align(4) _padding2_0 : f32,
};

@binding(2) @group(0) var<uniform> _DrawCurves_0CB : Struct_DrawCurves_0CB_std140_0;
fn EvaluateBezier_Linear_0( t_0 : f32,  CP1_1 : f32,  CP2_1 : f32) -> f32
{
    return CP1_1 * (1.0f - t_0) + CP2_1 * t_0;
}

fn EvaluateBezier_Quadratic_0( t_1 : f32,  CP1_2 : f32,  CP2_2 : f32,  CP3_1 : f32) -> f32
{
    var s_0 : f32 = 1.0f - t_1;
    return CP1_2 * s_0 * s_0 + 2.0f * CP2_2 * s_0 * t_1 + CP3_1 * t_1 * t_1;
}

fn EvaluateBezier_Cubic_0( t_2 : f32,  CP1_3 : f32,  CP2_3 : f32,  CP3_2 : f32,  CP4_1 : f32) -> f32
{
    var s_1 : f32 = 1.0f - t_2;
    return CP1_3 * s_1 * s_1 * s_1 + 3.0f * CP2_3 * s_1 * s_1 * t_2 + 3.0f * CP3_2 * s_1 * t_2 * t_2 + CP4_1 * t_2 * t_2 * t_2;
}

fn EvaluateBezier_Quartic_0( t_3 : f32,  CP1_4 : f32,  CP2_4 : f32,  CP3_3 : f32,  CP4_2 : f32,  CP5_1 : f32) -> f32
{
    var s_2 : f32 = 1.0f - t_3;
    return CP1_4 * s_2 * s_2 * s_2 * s_2 + 4.0f * CP2_4 * s_2 * s_2 * t_3 * s_2 + 6.0f * CP3_3 * s_2 * t_3 * t_3 * s_2 + 4.0f * CP4_2 * s_2 * t_3 * t_3 * t_3 + CP5_1 * t_3 * t_3 * t_3 * t_3;
}

fn EvaluateBezier_Quintic_0( t_4 : f32,  CP1_5 : f32,  CP2_5 : f32,  CP3_4 : f32,  CP4_3 : f32,  CP5_2 : f32,  CP6_1 : f32) -> f32
{
    var s_3 : f32 = 1.0f - t_4;
    return CP1_5 * s_3 * s_3 * s_3 * s_3 * s_3 + 5.0f * CP2_5 * s_3 * s_3 * s_3 * t_4 * s_3 + 10.0f * CP3_4 * s_3 * s_3 * t_4 * t_4 * s_3 + 10.0f * CP4_3 * s_3 * s_3 * t_4 * t_4 * t_4 + 5.0f * CP5_2 * s_3 * t_4 * t_4 * t_4 * t_4 + CP6_1 * t_4 * t_4 * t_4 * t_4 * t_4;
}

fn EvaluateBezier_0( t_5 : f32) -> f32
{
    switch(_DrawCurves_0CB.CurveOrder_0)
    {
    case i32(0), :
        {
            return EvaluateBezier_Linear_0(t_5, _DrawCurves_0CB.CP1_0, _DrawCurves_0CB.CP2_0);
        }
    case i32(1), :
        {
            return EvaluateBezier_Quadratic_0(t_5, _DrawCurves_0CB.CP1_0, _DrawCurves_0CB.CP2_0, _DrawCurves_0CB.CP3_0);
        }
    case i32(2), :
        {
            return EvaluateBezier_Cubic_0(t_5, _DrawCurves_0CB.CP1_0, _DrawCurves_0CB.CP2_0, _DrawCurves_0CB.CP3_0, _DrawCurves_0CB.CP4_0);
        }
    case i32(3), :
        {
            return EvaluateBezier_Quartic_0(t_5, _DrawCurves_0CB.CP1_0, _DrawCurves_0CB.CP2_0, _DrawCurves_0CB.CP3_0, _DrawCurves_0CB.CP4_0, _DrawCurves_0CB.CP5_0);
        }
    case i32(4), :
        {
            return EvaluateBezier_Quintic_0(t_5, _DrawCurves_0CB.CP1_0, _DrawCurves_0CB.CP2_0, _DrawCurves_0CB.CP3_0, _DrawCurves_0CB.CP4_0, _DrawCurves_0CB.CP5_0, _DrawCurves_0CB.CP6_0);
        }
    case default, :
        {
            break;
        }
    }
    return 0.5f;
}

fn SDFCircle_0( uv_0 : vec2<f32>,  center_0 : vec2<f32>,  radius_0 : f32) -> f32
{
    return length(uv_0 - center_0) - radius_0;
}

fn ShowControlPoints_1( color_0 : ptr<function, vec3<f32>>,  uv_1 : vec2<f32>)
{
    var CPXSpacing_0 : f32 = 1.0f / f32(_DrawCurves_0CB.CurveOrder_0 + i32(2) - i32(1));
    if((min(min(min(min(min(min(0.0f, SDFCircle_0(uv_1, vec2<f32>(CPXSpacing_0 * 0.0f, _DrawCurves_0CB.CP1_0), 0.00999999977648258f)), SDFCircle_0(uv_1, vec2<f32>(CPXSpacing_0, _DrawCurves_0CB.CP2_0), 0.00999999977648258f)), SDFCircle_0(uv_1, vec2<f32>(CPXSpacing_0 * 2.0f, _DrawCurves_0CB.CP3_0), 0.00999999977648258f)), SDFCircle_0(uv_1, vec2<f32>(CPXSpacing_0 * 3.0f, _DrawCurves_0CB.CP4_0), 0.00999999977648258f)), SDFCircle_0(uv_1, vec2<f32>(CPXSpacing_0 * 4.0f, _DrawCurves_0CB.CP5_0), 0.00999999977648258f)), SDFCircle_0(uv_1, vec2<f32>(CPXSpacing_0 * 5.0f, _DrawCurves_0CB.CP6_0), 0.00999999977648258f))) < 0.0f)
    {
        (*color_0) = vec3<f32>(1.0f, 1.0f, 1.0f);
    }
    return;
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
    var dimensions_0 : vec2<u32>;
    var _S2 : u32 = dimensions_0[i32(0)];
    var _S3 : u32 = dimensions_0[i32(1)];
    {var dim = textureDimensions((Output));((_S2)) = dim.x;((_S3)) = dim.y;};
    dimensions_0[i32(0)] = _S2;
    dimensions_0[i32(1)] = _S3;
    var px_0 : vec2<u32> = DTid_0.xy;
    var _S4 : vec2<f32> = (vec2<f32>(px_0) + vec2<f32>(0.5f, 0.5f)) / vec2<f32>(dimensions_0);
    var uv_2 : vec2<f32> = _S4;
    uv_2[i32(1)] = 1.0f - _S4.y;
    var color_1 : vec3<f32> = vec3<f32>(0.10000000149011612f, 0.10000000149011612f, 0.10000000149011612f);
    var t_6 : f32 = uv_2.x;
    var _S5 : bool;
    if(bool(_DrawCurves_0CB.ShowPolynomial_0))
    {
        _S5 = (uv_2.y) < (EvaluateBezier_0(t_6));
    }
    else
    {
        _S5 = false;
    }
    if(_S5)
    {
        color_1[i32(2)] = 0.89999997615814209f;
    }
    if(bool(_DrawCurves_0CB.ShowControlPoints_0))
    {
        ShowControlPoints_1(&(color_1), uv_2);
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

// -------------------- Private Members

// Texture Output
texture_Output = null;
texture_Output_size = [0, 0, 0];
texture_Output_format = "";
texture_Output_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Texture DrawCurves_Output_ReadOnly : This is a read only texture copy to help get around read-write storage texture format limitations.
texture_DrawCurves_Output_ReadOnly = null;
texture_DrawCurves_Output_ReadOnly_size = [0, 0, 0];
texture_DrawCurves_Output_ReadOnly_format = "";
texture_DrawCurves_Output_ReadOnly_usageFlags = GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.STORAGE_BINDING;

// Constant buffer _DrawCurves_0CB
constantBuffer__DrawCurves_0CB = null;
constantBuffer__DrawCurves_0CB_size = 48;
constantBuffer__DrawCurves_0CB_usageFlags = GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM;

// Compute Shader DrawCurves
Hash_Compute_DrawCurves = 0;
ShaderModule_Compute_DrawCurves = null;
BindGroupLayout_Compute_DrawCurves = null;
PipelineLayout_Compute_DrawCurves = null;
Pipeline_Compute_DrawCurves = null;

// -------------------- Public Variables

variable_CurveOrder = this.constructor.Enum_CurveOrders.Quintic;
variableDefault_CurveOrder = this.constructor.Enum_CurveOrders.Quintic;
variableChanged_CurveOrder = false;
variable_CP1 = 0.;
variableDefault_CP1 = 0.;
variableChanged_CP1 = false;
variable_CP2 = 1.;
variableDefault_CP2 = 1.;
variableChanged_CP2 = false;
variable_CP3 = 0.;
variableDefault_CP3 = 0.;
variableChanged_CP3 = false;
variable_CP4 = 1.;
variableDefault_CP4 = 1.;
variableChanged_CP4 = false;
variable_CP5 = 0.;
variableDefault_CP5 = 0.;
variableChanged_CP5 = false;
variable_CP6 = 1.;
variableDefault_CP6 = 1.;
variableChanged_CP6 = false;
variable_ShowPolynomial = true;
variableDefault_ShowPolynomial = true;
variableChanged_ShowPolynomial = false;
variable_ShowControlPoints = true;
variableDefault_ShowControlPoints = true;
variableChanged_ShowControlPoints = false;
variable_RenderSize = [ 512, 512 ];
variableDefault_RenderSize = [ 512, 512 ];
variableChanged_RenderSize = [ false, false ];

// -------------------- Structs

static StructOffsets__DrawCurves_0CB =
{
    CP1: 0,
    CP2: 4,
    CP3: 8,
    CP4: 12,
    CP5: 16,
    CP6: 20,
    CurveOrder: 24,
    ShowControlPoints: 28,
    ShowPolynomial: 32,
    _padding0: 36,
    _padding1: 40,
    _padding2: 44,
    _size: 48,
}


async SetVarsBefore()
{

}

async SetVarsAfter()
{

}

async ValidateImports()
{
    return true;
}

async Init(device, encoder, useBlockingAPIs)
{
    // Handle (re)creation of texture Output
    {
        const baseSize = [ this.variable_RenderSize[0], this.variable_RenderSize[1], 1];
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = "rgba8unorm";
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
                label: "texture ViewCurves.Output",
                size: this.texture_Output_size,
                format: Shared.GetNonSRGBFormat(this.texture_Output_format),
                usage: this.texture_Output_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // Handle (re)creation of texture DrawCurves_Output_ReadOnly
    {
        const baseSize = this.texture_Output_size.slice();
        const desiredSize = [
            Math.floor(((parseInt(baseSize[0]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[1]) + 0) * 1) / 1) + 0,
            Math.floor(((parseInt(baseSize[2]) + 0) * 1) / 1) + 0
        ];
        const desiredFormat = this.texture_Output_format;
        if (this.texture_DrawCurves_Output_ReadOnly !== null && (this.texture_DrawCurves_Output_ReadOnly_format != desiredFormat || this.texture_DrawCurves_Output_ReadOnly_size[0] != desiredSize[0] || this.texture_DrawCurves_Output_ReadOnly_size[1] != desiredSize[1] || this.texture_DrawCurves_Output_ReadOnly_size[2] != desiredSize[2]))
        {
            this.texture_DrawCurves_Output_ReadOnly.destroy();
            this.texture_DrawCurves_Output_ReadOnly = null;
        }

        if (this.texture_DrawCurves_Output_ReadOnly === null)
        {
            this.texture_DrawCurves_Output_ReadOnly_size = desiredSize.slice();
            this.texture_DrawCurves_Output_ReadOnly_format = desiredFormat;

            let viewFormats = [];
            if (Shared.IsSRGBFormat(this.texture_DrawCurves_Output_ReadOnly_format))
                viewFormats.push(this.texture_DrawCurves_Output_ReadOnly_format);

            this.texture_DrawCurves_Output_ReadOnly = device.createTexture({
                label: "texture ViewCurves.DrawCurves_Output_ReadOnly",
                size: this.texture_DrawCurves_Output_ReadOnly_size,
                format: Shared.GetNonSRGBFormat(this.texture_DrawCurves_Output_ReadOnly_format),
                usage: this.texture_DrawCurves_Output_ReadOnly_usageFlags,
                viewFormats: viewFormats,
            });
        }
    }

    // (Re)create compute shader DrawCurves
    {
        const bindGroupEntries =
        [
            {
                // Output
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "write-only", format: Shared.GetNonSRGBFormat(this.texture_Output_format), viewDimension: "2d" }
            },
            {
                // OutputReadOnly
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                storageTexture : { access: "read-only", format: Shared.GetNonSRGBFormat(this.texture_DrawCurves_Output_ReadOnly_format), viewDimension: "2d" }
            },
            {
                // _DrawCurves_0CB
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "uniform" }
            },
        ];

        let hashString = JSON.stringify(bindGroupEntries);
        const newHash = hashString.hashCode();

        if (this.ShaderModule_Compute_DrawCurves === null || newHash !== this.Hash_Compute_DrawCurves)
        {
            this.Hash_Compute_DrawCurves = newHash;

            let shaderCode = class_ViewCurves.ShaderCode_DrawCurves_DrawCurves_0;
            shaderCode = shaderCode.replace("/*(Output_format)*/", Shared.GetNonSRGBFormat(this.texture_Output_format));
            shaderCode = shaderCode.replace("/*(OutputReadOnly_format)*/", Shared.GetNonSRGBFormat(this.texture_DrawCurves_Output_ReadOnly_format));

            this.ShaderModule_Compute_DrawCurves = device.createShaderModule({ code: shaderCode, label: "Compute Shader DrawCurves"});
            this.BindGroupLayout_Compute_DrawCurves = device.createBindGroupLayout({
                label: "Compute Bind Group Layout DrawCurves",
                entries: bindGroupEntries
            });

            this.PipelineLayout_Compute_DrawCurves = device.createPipelineLayout({
                label: "Compute Pipeline Layout DrawCurves",
                bindGroupLayouts: [this.BindGroupLayout_Compute_DrawCurves],
            });

            if (useBlockingAPIs)
            {
                this.Pipeline_Compute_DrawCurves = device.createComputePipeline({
                    label: "Compute Pipeline DrawCurves",
                    layout: this.PipelineLayout_Compute_DrawCurves,
                    compute: {
                        module: this.ShaderModule_Compute_DrawCurves,
                        entryPoint: "main",
                    }
                });
            }
            else
            {
                this.loadingPromises.add("DrawCurves");

                device.createComputePipelineAsync({
                    label: "Compute Pipeline DrawCurves",
                    layout: this.PipelineLayout_Compute_DrawCurves,
                    compute: {
                        module: this.ShaderModule_Compute_DrawCurves,
                        entryPoint: "main",
                    }
                }).then( handle => { this.Pipeline_Compute_DrawCurves = handle; this.loadingPromises.delete("DrawCurves"); } );
            }
        }
    }

}

async FillEncoder(device, encoder)
{
    encoder.pushDebugGroup("ViewCurves.Output");

    encoder.popDebugGroup(); // "ViewCurves.Output"

    encoder.pushDebugGroup("ViewCurves.DrawCurves_Output_ReadOnly");

    encoder.popDebugGroup(); // "ViewCurves.DrawCurves_Output_ReadOnly"

    encoder.pushDebugGroup("ViewCurves.Copy_DrawCurves_Output");

    // Copy texture Output to texture DrawCurves_Output_ReadOnly
    {
        const numMips = Math.min(this.texture_Output.mipLevelCount, this.texture_DrawCurves_Output_ReadOnly.mipLevelCount);

        for (let mipIndex = 0; mipIndex < numMips; ++mipIndex)
        {
            const mipWidth = Math.max(this.texture_Output.width >> mipIndex, 1);
            const mipHeight = Math.max(this.texture_Output.height >> mipIndex, 1);
            let mipDepth = this.texture_Output.depthOrArrayLayers;

            if (this.texture_Output.dimension == "3d")
                mipDepth = Math.max(mipDepth >> mipIndex, 1);

            encoder.copyTextureToTexture(
                { texture: this.texture_Output, mipLevel: mipIndex },
                { texture: this.texture_DrawCurves_Output_ReadOnly, mipLevel: mipIndex },
                {
                    width: mipWidth,
                    height: mipHeight,
                    depthOrArrayLayers: mipDepth,
                }
            );
        }
    }

    encoder.popDebugGroup(); // "ViewCurves.Copy_DrawCurves_Output"

    encoder.pushDebugGroup("ViewCurves._DrawCurves_0CB");

    // Create constant buffer _DrawCurves_0CB
    if (this.constantBuffer__DrawCurves_0CB === null)
    {
        this.constantBuffer__DrawCurves_0CB = device.createBuffer({
            label: "ViewCurves._DrawCurves_0CB",
            size: Shared.Align(16, this.constructor.StructOffsets__DrawCurves_0CB._size),
            usage: this.constantBuffer__DrawCurves_0CB_usageFlags,
        });
    }

    // Upload values to constant buffer _DrawCurves_0CB
    {
        const bufferCPU = new ArrayBuffer(Shared.Align(16, this.constructor.StructOffsets__DrawCurves_0CB._size));
        const view = new DataView(bufferCPU);
        view.setFloat32(this.constructor.StructOffsets__DrawCurves_0CB.CP1, this.variable_CP1, true);
        view.setFloat32(this.constructor.StructOffsets__DrawCurves_0CB.CP2, this.variable_CP2, true);
        view.setFloat32(this.constructor.StructOffsets__DrawCurves_0CB.CP3, this.variable_CP3, true);
        view.setFloat32(this.constructor.StructOffsets__DrawCurves_0CB.CP4, this.variable_CP4, true);
        view.setFloat32(this.constructor.StructOffsets__DrawCurves_0CB.CP5, this.variable_CP5, true);
        view.setFloat32(this.constructor.StructOffsets__DrawCurves_0CB.CP6, this.variable_CP6, true);
        view.setInt32(this.constructor.StructOffsets__DrawCurves_0CB.CurveOrder, this.variable_CurveOrder, true);
        view.setUint32(this.constructor.StructOffsets__DrawCurves_0CB.ShowControlPoints, (this.variable_ShowControlPoints === true ? 1 : 0), true);
        view.setUint32(this.constructor.StructOffsets__DrawCurves_0CB.ShowPolynomial, (this.variable_ShowPolynomial === true ? 1 : 0), true);
        device.queue.writeBuffer(this.constantBuffer__DrawCurves_0CB, 0, bufferCPU);
    }

    encoder.popDebugGroup(); // "ViewCurves._DrawCurves_0CB"

    encoder.pushDebugGroup("ViewCurves.DrawCurves");

    // Run compute shader DrawCurves
    {
        const bindGroup = device.createBindGroup({
            label: "Compute Bind Group DrawCurves",
            layout: this.BindGroupLayout_Compute_DrawCurves,
            entries: [
                {
                    // Output
                    binding: 0,
                    resource: this.texture_Output.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // OutputReadOnly
                    binding: 1,
                    resource: this.texture_DrawCurves_Output_ReadOnly.createView({ dimension: "2d", mipLevelCount: 1, baseMipLevel: 0 })
                },
                {
                    // _DrawCurves_0CB
                    binding: 2,
                    resource: { buffer: this.constantBuffer__DrawCurves_0CB }
                },
            ]
        });

        // Calculate dispatch size
        const baseDispatchSize = this.texture_Output_size;
        const dispatchSize = [
            Math.floor((Math.floor(((parseInt(baseDispatchSize[0]) + 0) * 1) / 1) + 0 + 8 - 1) / 8),
            Math.floor((Math.floor(((parseInt(baseDispatchSize[1]) + 0) * 1) / 1) + 0 + 8 - 1) / 8),
            Math.floor((Math.floor(((parseInt(baseDispatchSize[2]) + 0) * 1) / 1) + 0 + 1 - 1) / 1)
        ];

        if (this.Pipeline_Compute_DrawCurves !== null)
        {
            const computePass = encoder.beginComputePass();
                computePass.setPipeline(this.Pipeline_Compute_DrawCurves);
                computePass.setBindGroup(0, bindGroup);
                computePass.dispatchWorkgroups(dispatchSize[0], dispatchSize[1], dispatchSize[2]);
            computePass.end();
        }
    }

    encoder.popDebugGroup(); // "ViewCurves.DrawCurves"

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

var ViewCurves = new class_ViewCurves;

export default ViewCurves;
