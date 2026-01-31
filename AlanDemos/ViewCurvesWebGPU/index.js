import { create, globals } from 'webgpu';
import * as Shared from './Shared.js';

Object.assign(globalThis, globals);

// Import the technique
import ViewCurves from "./ViewCurves_Module.js"

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
                User Variables (These show in the UI):
                    ViewCurves.variable_CurveOrder = this.constructor.Enum_CurveOrders.Quintic; // (Int)
                    ViewCurves.variable_CP1 = 0.; // (Float)
                    ViewCurves.variable_CP2 = 1.; // (Float)
                    ViewCurves.variable_CP3 = 0.; // (Float)
                    ViewCurves.variable_CP4 = 1.; // (Float)
                    ViewCurves.variable_CP5 = 0.; // (Float)
                    ViewCurves.variable_CP6 = 1.; // (Float)
                    ViewCurves.variable_ShowDeCasteljauTexture = true; // (Bool) In Red Channel
                    ViewCurves.variable_ShowPolynomial = true; // (Bool) In Green Channel
                    ViewCurves.variable_ShowSeilerTexture = true; // (Bool) In Blue Channel
                    ViewCurves.variable_ShowControlPoints = true; // (Bool)
                    ViewCurves.variable_RenderSize = 512, 512; // (Uint2)

                An example of how to load a texture:
                    const loadedTexture = await Shared.CreateTextureWithPNG(device, "cabinsmall.png", ViewCurves.texture_someTexture_usageFlags);
                    ViewCurves.texture_someTexture = loadedTexture.texture;
                    ViewCurves.texture_someTexture_size = loadedTexture.size;
                    ViewCurves.texture_someTexture_format = loadedTexture.format;

                See _GeneratedCode\UnitTests\WebGPU\UnitTestLogic.js for more examples of loading files of various kinds.
*/

for (let frameIndex = 0; frameIndex < numExecutions; ++frameIndex)
{
    // Run the technique
    const encoder = device.createCommandEncoder();
    if (!await ViewCurves.Execute(device, encoder, true))
        Shared.LogError("Could not execute ViewCurves");

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
