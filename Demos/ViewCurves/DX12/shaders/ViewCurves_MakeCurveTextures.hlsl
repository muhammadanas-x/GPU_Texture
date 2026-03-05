// Unnamed technique, shader MakeCurveTextures


struct CurveOrders
{
    static const int Linear = 0;
    static const int Quadratic = 1;
    static const int Cubic = 2;
    static const int Quartic = 3;
    static const int Quintic = 4;
};

struct TextureFormats
{
    static const int F32 = 0;
    static const int U8 = 1;
};

struct Struct__MakeCurveTextures_0CB
{
    float CP1;
    float CP2;
    float CP3;
    float CP4;
    float CP5;
    float CP6;
    int CurveOrder;
    float _padding0;
};

RWTexture2D<float> DCTexture2D : register(u0);
RWTexture3D<float> DCTexture3D : register(u1);
RWTexture2D<float> SeilerTexture2D : register(u2);
RWTexture3D<float> SeilerTexture3D : register(u3);
ConstantBuffer<Struct__MakeCurveTextures_0CB> _MakeCurveTextures_0CB : register(b0);

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
