// Unnamed technique, shader MakeCurveTextures
/*$(ShaderResources)*/

void MakeLinear()
{
    DCTexture2D[uint2(0, 0)] = /*$(Variable:CP1)*/;
    DCTexture2D[uint2(1, 0)] = /*$(Variable:CP2)*/;

    SeilerTexture2D[uint2(0, 0)] = /*$(Variable:CP1)*/;
    SeilerTexture2D[uint2(1, 0)] = /*$(Variable:CP2)*/;	
}

/*$(_compute:main)*/(uint3 DTid : SV_DispatchThreadID)
{
    if (DTid.x > 0 || DTid.y > 0 || DTid.z > 0)
        return;

    switch (/*$(Variable:CurveOrder)*/)
    {
        case CurveOrders::Linear: MakeLinear(); break;
    }
}

/*
Shader Resources:
    Texture DCTexture2D (as UAV)
    Texture DCTexture3D (as UAV)
    Texture SeilerTexture2D (as UAV)
    Texture SeilerTexture3D (as UAV)
*/
