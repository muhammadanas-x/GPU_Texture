#pragma once

#include <d3d12.h>
#include <array>
#include <vector>
#include <unordered_map>
#include "DX12Utils/dxutils.h"

namespace ColorGrading
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

    enum class CurveTypes: int
    {
        Polynomial,
        TextureDeCasteljau,
        TextureSeiler,
    };

    enum class ColorGradeTimings: int
    {
        EveryRay,
        OncePerFrame,
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

    inline const char* EnumToString(CurveTypes value, bool displayString = false)
    {
        switch(value)
        {
            case CurveTypes::Polynomial: return displayString ? "Polynomial" : "Polynomial";
            case CurveTypes::TextureDeCasteljau: return displayString ? "TextureDeCasteljau" : "TextureDeCasteljau";
            case CurveTypes::TextureSeiler: return displayString ? "TextureSeiler" : "TextureSeiler";
            default: return nullptr;
        }
    }

    inline const char* EnumToString(ColorGradeTimings value, bool displayString = false)
    {
        switch(value)
        {
            case ColorGradeTimings::EveryRay: return displayString ? "EveryRay" : "EveryRay";
            case ColorGradeTimings::OncePerFrame: return displayString ? "OncePerFrame" : "OncePerFrame";
            default: return nullptr;
        }
    }

    struct ContextInternal
    {
        ID3D12QueryHeap* m_TimestampQueryHeap = nullptr;
        ID3D12Resource* m_TimestampReadbackBuffer = nullptr;

        static ID3D12CommandSignature* s_commandSignatureDispatch;

        struct Struct__Transform_0CB
        {
            float3 CP1 = {0.f, 0.f, 0.f};
            float _padding0 = 0.f;  // Padding
            float3 CP2 = {0.200000003f, 0.200000003f, 0.200000003f};
            float _padding1 = 0.f;  // Padding
            float3 CP3 = {0.400000006f, 0.400000006f, 0.400000006f};
            float _padding2 = 0.f;  // Padding
            float3 CP4 = {0.600000024f, 0.600000024f, 0.600000024f};
            float _padding3 = 0.f;  // Padding
            float3 CP5 = {0.800000012f, 0.800000012f, 0.800000012f};
            float _padding4 = 0.f;  // Padding
            float3 CP6 = {1.f, 1.f, 1.f};
            unsigned int CameraChanged = false;
            float3 CameraPos = {0.f, 0.f, 0.f};
            int ColorGrade = (int)ColorGradeTimings::EveryRay;  // Should the color grading happen once per frame, or with every ray?
            int CurveOrder = (int)CurveOrders::Quintic;
            int CurveType = (int)CurveTypes::Polynomial;
            float2 _padding5 = {0.f, 0.f};  // Padding
            float4x4 InvViewMtx = {0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f};
            float4x4 InvViewProjMtx = {0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f, 0.f};
            int RaysPerPixelPerFrame = 16;  // Rays per pixel per frame when rendering the scene
            unsigned int ResetAccumulation = false;
            int iFrame = 0;
            float _padding6 = 0.f;  // Padding
        };

        struct Struct__MakeCurveTextures_0CB
        {
            float3 CP1 = {0.f, 0.f, 0.f};
            float _padding0 = 0.f;  // Padding
            float3 CP2 = {0.200000003f, 0.200000003f, 0.200000003f};
            float _padding1 = 0.f;  // Padding
            float3 CP3 = {0.400000006f, 0.400000006f, 0.400000006f};
            float _padding2 = 0.f;  // Padding
            float3 CP4 = {0.600000024f, 0.600000024f, 0.600000024f};
            float _padding3 = 0.f;  // Padding
            float3 CP5 = {0.800000012f, 0.800000012f, 0.800000012f};
            float _padding4 = 0.f;  // Padding
            float3 CP6 = {1.f, 1.f, 1.f};
            int CurveOrder = (int)CurveOrders::Quintic;
        };

        // Variables
        float variable_NumCPsMinus1Float = 0.f;
        bool variable_MakeCurveTexture = true;

        ID3D12Resource* texture_Input = nullptr;
        unsigned int texture_Input_size[3] = { 0, 0, 0 };
        unsigned int texture_Input_numMips = 0;
        DXGI_FORMAT texture_Input_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_Input_flags =  D3D12_RESOURCE_FLAG_NONE;
        const D3D12_RESOURCE_STATES c_texture_Input_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

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

        ID3D12Resource* texture_DCTexture3D = nullptr;
        unsigned int texture_DCTexture3D_size[3] = { 0, 0, 0 };
        unsigned int texture_DCTexture3D_numMips = 0;
        DXGI_FORMAT texture_DCTexture3D_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_DCTexture3D_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_DCTexture3D_endingState = D3D12_RESOURCE_STATE_NON_PIXEL_SHADER_RESOURCE;

        ID3D12Resource* texture_Accumulation = nullptr;
        unsigned int texture_Accumulation_size[3] = { 0, 0, 0 };
        unsigned int texture_Accumulation_numMips = 0;
        DXGI_FORMAT texture_Accumulation_format = DXGI_FORMAT_UNKNOWN;
        static const D3D12_RESOURCE_FLAGS texture_Accumulation_flags =  D3D12_RESOURCE_FLAG_ALLOW_UNORDERED_ACCESS;
        const D3D12_RESOURCE_STATES c_texture_Accumulation_endingState = D3D12_RESOURCE_STATE_UNORDERED_ACCESS;

        Struct__Transform_0CB constantBuffer__Transform_0CB_cpu;
        ID3D12Resource* constantBuffer__Transform_0CB = nullptr;

        Struct__MakeCurveTextures_0CB constantBuffer__MakeCurveTextures_0CB_cpu;
        ID3D12Resource* constantBuffer__MakeCurveTextures_0CB = nullptr;

        static ID3D12PipelineState* computeShader_MakeCurveTextures_pso;
        static ID3D12RootSignature* computeShader_MakeCurveTextures_rootSig;

        static ID3D12PipelineState* computeShader_Transform_pso;
        static ID3D12RootSignature* computeShader_Transform_rootSig;

        std::unordered_map<DX12Utils::SubResourceHeapAllocationInfo, int, DX12Utils::SubResourceHeapAllocationInfo> m_RTVCache;
        std::unordered_map<DX12Utils::SubResourceHeapAllocationInfo, int, DX12Utils::SubResourceHeapAllocationInfo> m_DSVCache;

        // Freed on destruction of the context
        std::vector<ID3D12Resource*> m_managedResources;
    };
};
