// Unnamed technique, shader MakeCurveTextures
/*$(ShaderResources)*/

#include "DeCasteljauTexture.hlsli"
#include "SeilerTexture.hlsli"

void MakeLinear()
{
    DeCasteljauTexture_Write_Linear(DCTexture2D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/);
    SeilerTexture_Write_Linear(SeilerTexture2D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/);
}

void MakeQuadratic()
{
    DeCasteljauTexture_Write_Quadratic(DCTexture2D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/);
    SeilerTexture_Write_Quadratic(SeilerTexture2D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/);
}

void MakeCubic()
{
    DeCasteljauTexture_Write_Cubic(DCTexture3D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/);
    SeilerTexture_Write_Cubic(SeilerTexture2D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/);
}

void MakeQuartic()
{
    DeCasteljauTexture_Write_Quartic(DCTexture3D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/);
    SeilerTexture_Write_Quartic(SeilerTexture3D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/);
}

void MakeQuintic()
{
    DeCasteljauTexture_Write_Quintic(DCTexture3D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/, /*$(Variable:CP6)*/);
    SeilerTexture_Write_Quintic(SeilerTexture3D, /*$(Variable:CP1)*/, /*$(Variable:CP2)*/, /*$(Variable:CP3)*/, /*$(Variable:CP4)*/, /*$(Variable:CP5)*/, /*$(Variable:CP6)*/);
}

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    if (DTid.x > 0 || DTid.y > 0 || DTid.z > 0)
        return;

    switch (/*$(Variable:CurveOrder)*/)
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
