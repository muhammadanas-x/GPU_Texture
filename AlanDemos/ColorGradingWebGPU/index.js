import { create, globals } from 'webgpu';
import * as Shared from './Shared.js';

Object.assign(globalThis, globals);

// Import the technique
import ColorGrading from "./ColorGrading_Module.js"

// Initialize WebGPU
const navigator = { gpu: create(["enable-dawn-features=use_dxc"]) };

const adapter = await navigator.gpu?.requestAdapter();
const device = await adapter?.requestDevice({
    requiredLimits: { maxStorageTexturesPerShaderStage: 8 },
    requiredFeatures: [ 'float32-filterable' ],
});
device.pushErrorScope("validation");

let numExecutions = 1;

/* TODO:
provide imported resources or variable values to the technique:
                    ColorGrading.texture_Input = null;
                    ColorGrading.texture_Input_size = [0, 0, 0];
                    ColorGrading.texture_Input_format = "";
                Host Variables:
                    ColorGrading.variable_CameraPos = 0., 0., 0.; // (Float3)
                    ColorGrading.variable_InvViewProjMtx = 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.; // (Float4x4)
                    ColorGrading.variable_InvViewMtx = 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.; // (Float4x4)
                    ColorGrading.variable_CameraChanged = false; // (Bool)
                    ColorGrading.variable_iFrame = 0; // (Int)
                User Variables (These show in the UI):
                    ColorGrading.variable_RenderScene = false; // (Bool) If true, renders a scene instead of showing an image
                    ColorGrading.variable_CurveType = this.constructor.Enum_CurveTypes.Polynomial; // (Int)
                    ColorGrading.variable_CurveOrder = this.constructor.Enum_CurveOrders.Quintic; // (Int)
                    ColorGrading.variable_CP1 = 0., 0., 0.; // (Float3)
                    ColorGrading.variable_CP2 = 0.200000003, 0.200000003, 0.200000003; // (Float3)
                    ColorGrading.variable_CP3 = 0.400000006, 0.400000006, 0.400000006; // (Float3)
                    ColorGrading.variable_CP4 = 0.600000024, 0.600000024, 0.600000024; // (Float3)
                    ColorGrading.variable_CP5 = 0.800000012, 0.800000012, 0.800000012; // (Float3)
                    ColorGrading.variable_CP6 = 1., 1., 1.; // (Float3)
                    ColorGrading.variable_RaysPerPixelPerFrame = 16; // (Int) Rays per pixel per frame when rendering the scene
                    ColorGrading.variable_NormalizedCPs = false; // (Bool) When clicked, makes a linear no-op curve out of the control points

                An example of how to load a texture:
                    const loadedTexture = await Shared.CreateTextureWithPNG(device, "cabinsmall.png", ColorGrading.texture_someTexture_usageFlags);
                    ColorGrading.texture_someTexture = loadedTexture.texture;
                    ColorGrading.texture_someTexture_size = loadedTexture.size;
                    ColorGrading.texture_someTexture_format = loadedTexture.format;

                See _GeneratedCode\UnitTests\WebGPU\UnitTestLogic.js for more examples of loading files of various kinds.
*/

for (let frameIndex = 0; frameIndex < numExecutions; ++frameIndex)
{
    // Run the technique
    const encoder = device.createCommandEncoder();
    if (!await ColorGrading.Execute(device, encoder, true))
        Shared.LogError("Could not execute ColorGrading");

    // Submit the command encoder
    device.queue.submit([encoder.finish()]);

    // Wait for all work to be done
    await device.queue.onSubmittedWorkDone();
}

// Validation errors are test failures
await device.popErrorScope().then((error) => {
    if (error)
        Shared.LogError(`An error occurred during execution: ${error.message}`);
});

// Exit with success
process.exit(0)
