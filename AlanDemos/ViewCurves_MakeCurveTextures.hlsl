// Unnamed technique, shader MakeCurveTextures
/*$(ShaderResources)*/

void MakeLinear()
{
    // De Casteljau
    // we only need the top 2 pixels. could be a 1d texture
    DCTexture2D[uint2(0, 0)] = /*$(Variable:CP1)*/;
    DCTexture2D[uint2(1, 0)] = /*$(Variable:CP2)*/;

    // Seiler
    // we only need the top 2 pixels. could be a 1d texture
    SeilerTexture2D[uint2(0, 0)] = /*$(Variable:CP1)*/;
    SeilerTexture2D[uint2(1, 0)] = /*$(Variable:CP2)*/;    
}

void MakeQuadratic()
{
    // De Casteljau
    DCTexture2D[uint2(0, 0)] = /*$(Variable:CP1)*/;
    DCTexture2D[uint2(1, 0)] = /*$(Variable:CP2)*/;

    DCTexture2D[uint2(0, 1)] = /*$(Variable:CP2)*/;
    DCTexture2D[uint2(1, 1)] = /*$(Variable:CP3)*/;

    // Seiler
    float b0 = /*$(Variable:CP1)*/;
    float b1 = /*$(Variable:CP2)*/;
    float b2 = /*$(Variable:CP3)*/;

    float d1 = 2.0f * (b1 - b0) - (b2 - b0);

    SeilerTexture2D[uint2(0, 0)] = b0;
    SeilerTexture2D[uint2(1, 0)] = b2;

    SeilerTexture2D[uint2(0, 1)] = b0 + d1;
    SeilerTexture2D[uint2(1, 1)] = b2 + d1;
}

void MakeCubic()
{
    // De Casteljau
    DCTexture3D[uint3(0, 0, 0)] = /*$(Variable:CP1)*/;
    DCTexture3D[uint3(1, 0, 0)] = /*$(Variable:CP2)*/;
    DCTexture3D[uint3(0, 1, 0)] = /*$(Variable:CP2)*/;
    DCTexture3D[uint3(1, 1, 0)] = /*$(Variable:CP3)*/;

    DCTexture3D[uint3(0, 0, 1)] = /*$(Variable:CP2)*/;
    DCTexture3D[uint3(1, 0, 1)] = /*$(Variable:CP3)*/;
    DCTexture3D[uint3(0, 1, 1)] = /*$(Variable:CP3)*/;
    DCTexture3D[uint3(1, 1, 1)] = /*$(Variable:CP4)*/;

    // Seiler
    float b0 = /*$(Variable:CP1)*/;
    float b1 = /*$(Variable:CP2)*/;
    float b2 = /*$(Variable:CP3)*/;
    float b3 = /*$(Variable:CP4)*/;

    float d1 = 3.0f * (b1 - b0) - (b3 - b0);
    float d2 = 3.0f * (b2 - b3) - (b0 - b3);

    SeilerTexture2D[uint2(0, 0)] = b0;
    SeilerTexture2D[uint2(1, 0)] = b3;

    SeilerTexture2D[uint2(0, 1)] = b0 + d1;
    SeilerTexture2D[uint2(1, 1)] = b3 + d2;
}

void MakeQuartic()
{
    // De Casteljau
    DCTexture3D[uint3(0, 0, 0)] = /*$(Variable:CP1)*/;
    DCTexture3D[uint3(1, 0, 0)] = /*$(Variable:CP2)*/;
    DCTexture3D[uint3(0, 1, 0)] = /*$(Variable:CP2)*/;
    DCTexture3D[uint3(1, 1, 0)] = /*$(Variable:CP3)*/;

    DCTexture3D[uint3(0, 0, 1)] = /*$(Variable:CP2)*/;
    DCTexture3D[uint3(1, 0, 1)] = /*$(Variable:CP3)*/;
    DCTexture3D[uint3(0, 1, 1)] = /*$(Variable:CP3)*/;
    DCTexture3D[uint3(1, 1, 1)] = /*$(Variable:CP4)*/;

    DCTexture3D[uint3(0, 0, 2)] = /*$(Variable:CP3)*/;
    DCTexture3D[uint3(1, 0, 2)] = /*$(Variable:CP4)*/;
    DCTexture3D[uint3(0, 1, 2)] = /*$(Variable:CP4)*/;
    DCTexture3D[uint3(1, 1, 2)] = /*$(Variable:CP5)*/;

    // Seiler
    float b0 = /*$(Variable:CP1)*/;
    float b1 = /*$(Variable:CP2)*/;
    float b2 = /*$(Variable:CP3)*/;
    float b3 = /*$(Variable:CP4)*/;
    float b4 = /*$(Variable:CP5)*/;

    float d1 = 4.0f * (b1 - b0) - (b4 - b0);
    float d3 = 4.0f * (b3 - b4) - (b0 - b4);
    float d2 = 6.0f * (b2 - b1) - (b1 - b0) - (b3 - b4) - 3.0f * (b3 - b1);

    SeilerTexture3D[uint3(0, 0, 0)] = b0;
    SeilerTexture3D[uint3(1, 0, 0)] = b4;
    SeilerTexture3D[uint3(0, 1, 0)] = b0;
    SeilerTexture3D[uint3(1, 1, 0)] = b4;

    SeilerTexture3D[uint3(0, 0, 1)] = b0 + d1;
    SeilerTexture3D[uint3(1, 0, 1)] = b4 + d3;
    SeilerTexture3D[uint3(0, 1, 1)] = b0 + d1 + d2;
    SeilerTexture3D[uint3(1, 1, 1)] = b4 + d3 + d2;
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
    }
}

/*
Shader Resources:
    Texture DCTexture2D (as UAV)
    Texture DCTexture3D (as UAV)
    Texture SeilerTexture2D (as UAV)
    Texture SeilerTexture3D (as UAV)
*/
