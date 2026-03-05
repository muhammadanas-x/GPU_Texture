#pragma once

#include <d3d12.h>
#include <array>
#include <vector>
#include <unordered_map>
#include "DX12Utils/dxutils.h"

namespace ViewCurves
{
    using uint = unsigned int;
    using uint2 = std::array<uint, 2>;
    using uint3 = std::array<uint, 3>;
    using uint4 = std::array<uint, 4>;

    using int2 = std::array<int, 2>;
    using int3 = std::array<int, 3>;
    using int4 = std::array<int, 4>;
    using float2 = std::array<float, 2>;
    using float3 = std::array<float, 3>;
    using float4 = std::array<float, 4>;
    using float4x4 = std::array<std::array<float, 4>, 4>;

    enum class CurveOrders: int
    {
        Linear,
        Quadratic,
        Cubic,
        Quartic,
        Quintic,
    };

    enum class TextureFormats: int
    {
        F32,
        U8,
    };

    inline const char* EnumToString(CurveOrders value, bool displayString = false)
    {
        switch(value)
        {
            case CurveOrders::Linear: return displayString ? "Linear" : "Linear";
            case CurveOrders::Quadratic: return displayString ? "Quadratic" : "Quadratic";
            case CurveOrders::Cubic: return displayString ? "Cubic" : "Cubic";
            case CurveOrders::Quartic: return displayString ? "Quartic" : "Quartic";
            case CurveOrders::Quintic: return displayString ? "Quintic" : "Quintic";
            default: return nullptr;
        }
    }

    inline const char* EnumToString(TextureFormats value, bool displayString = false)
    {
        switch(value)
        {
            case TextureFormats::F32: return displayString ? "F32" : "F32";
            case TextureFormats::U8: return displayString ? "U8" : "U8";
            default: return nullptr;
        }
    }

    struct ContextInternal
    {
        ID3D12QueryHeap* m_TimestampQueryHeap = nullptr;
        ID3D12Resource* m_TimestampReadbackBuffer = nullptr;

        static ID3D12CommandSignature* s_commandSignatureDispatch;

        struct Struct__DrawCurves_0CB
        {
            float CP1 = 0.f;
            float CP2 = 1.f;
            float CP3 = 0.f;
            float CP4 = 1.f;
            float CP5 = 0.f;
            float CP6 = 1.f;
            unsigned int ComparisonMode = false;  // Colors the output for a better comparison between two curve types
            int CurveOrder = (int)CurveOrders::Quintic;
            float3 DeCasteljauColor = {0.f, 1.f, 0.f};
            float _padding0 = 0.f;  // Padding
            float3 HybridColor = {0.f, 0.f, 1.f};
            float _padding1 = 0.f;  // Padding
            float3 PolynomialColor = {1.f, 0.f, 0.f};
            float _padding2 = 0.f;  // Padding
            float3 SeilerColor = {0.f, 0.f, 1.f};
            unsigned int ShowControlPoints = true;  // In black
            unsigned int ShowDeCasteljauTexture = true;
            unsigned int ShowHybrid = false;  // de CastelJau texture, but the last lerp done in shaders at full f32 precision. Quartic and Quintic are already hybrid.
            unsigned int ShowPolynomial = true;
            unsigned int ShowSeilerTexture = true;
            int TextureFormat = (int)TextureFormats::F32;
            float3 _padding3 = {0.f, 0.f, 0.f};  // Padding
        };

        struct Struct__MakeCurveTextures_0CB
        {
            float CP1 = 0.f;
            float CP2 = 1.f;
            float CP3 = 0.f;
            float CP4 = 1.f;
            float CP5 = 0.f;
            float CP6 = 1.f;
            int CurveOrder = (int)CurveOrders::Quintic;
            float _padding0 = 0.f;  // Padding
        };

        ID3D12Resource* texture_Output = nullptr;
        unsigned int texture_Output_size[3] = { 0, 0, 0 };
        unsigned int texture_Output_numMips = 0;
        DXGI_FORMAT texture_Output_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_Output_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_Output_endingState = D3D12_RESOURCE_STATE_UNORDERED_ACCESS;

        ID3D12Resource* texture_DCTexture2D = nullptr;
        unsigned int texture_DCTexture2D_size[3] = { 0, 0, 0 };
        unsigned int texture_DCTexture2D_numMips = 0;
        DXGI_FORMAT texture_DCTexture2D_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_DCTexture2D_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_DCTexture2D_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_DCTexture3D = nullptr;
        unsigned int texture_DCTexture3D_size[3] = { 0, 0, 0 };
        unsigned int texture_DCTexture3D_numMips = 0;
        DXGI_FORMAT texture_DCTexture3D_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_DCTexture3D_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_DCTexture3D_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_SeilerTexture2D = nullptr;
        unsigned int texture_SeilerTexture2D_size[3] = { 0, 0, 0 };
        unsigned int texture_SeilerTexture2D_numMips = 0;
        DXGI_FORMAT texture_SeilerTexture2D_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_SeilerTexture2D_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_SeilerTexture2D_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_SeilerTexture3D = nullptr;
        unsigned int texture_SeilerTexture3D_size[3] = { 0, 0, 0 };
        unsigned int texture_SeilerTexture3D_numMips = 0;
        DXGI_FORMAT texture_SeilerTexture3D_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_SeilerTexture3D_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_SeilerTexture3D_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_DCTexture2DU8 = nullptr;
        unsigned int texture_DCTexture2DU8_size[3] = { 0, 0, 0 };
        unsigned int texture_DCTexture2DU8_numMips = 0;
        DXGI_FORMAT texture_DCTexture2DU8_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_DCTexture2DU8_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_DCTexture2DU8_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_DCTexture3DU8 = nullptr;
        unsigned int texture_DCTexture3DU8_size[3] = { 0, 0, 0 };
        unsigned int texture_DCTexture3DU8_numMips = 0;
        DXGI_FORMAT texture_DCTexture3DU8_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_DCTexture3DU8_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_DCTexture3DU8_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_SeilerTexture2DU8 = nullptr;
        unsigned int texture_SeilerTexture2DU8_size[3] = { 0, 0, 0 };
        unsigned int texture_SeilerTexture2DU8_numMips = 0;
        DXGI_FORMAT texture_SeilerTexture2DU8_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_SeilerTexture2DU8_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_SeilerTexture2DU8_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_SeilerTexture3DU8 = nullptr;
        unsigned int texture_SeilerTexture3DU8_size[3] = { 0, 0, 0 };
        unsigned int texture_SeilerTexture3DU8_numMips = 0;
        DXGI_FORMAT texture_SeilerTexture3DU8_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_SeilerTexture3DU8_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_SeilerTexture3DU8_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        Struct__DrawCurves_0CB constantBuffer__DrawCurves_0CB_cpu;
        ID3D12Resource* constantBuffer__DrawCurves_0CB = nullptr;

        Struct__MakeCurveTextures_0CB constantBuffer__MakeCurveTextures_0CB_cpu;
        ID3D12Resource* constantBuffer__MakeCurveTextures_0CB = nullptr;

        static ID3D12PipelineState* computeShader_MakeCurveTextures_pso;
        static ID3D12RootSignature* computeShader_MakeCurveTextures_rootSig;

        static ID3D12PipelineState* computeShader_MakeCurveTexturesU8_pso;
        static ID3D12RootSignature* computeShader_MakeCurveTexturesU8_rootSig;

        static ID3D12PipelineState* computeShader_DrawCurves_pso;
        static ID3D12RootSignature* computeShader_DrawCurves_rootSig;

        std::unordered_map<DX12Utils::SubResourceHeapAllocationInfo, int, DX12Utils::SubResourceHeapAllocationInfo> m_RTVCache;
        std::unordered_map<DX12Utils::SubResourceHeapAllocationInfo, int, DX12Utils::SubResourceHeapAllocationInfo> m_DSVCache;

        // Freed on destruction of the context
        std::vector<ID3D12Resource*> m_managedResources;
    };
};
