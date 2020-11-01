// �p�����[�^�錾

// ���@�ϊ��s��
float4x4 WorldViewProjMatrix      : WORLDVIEWPROJECTION;

///////////////////////////////////////////////////////////////////////////////////////////////
// �I�u�W�F�N�g�`��

struct VS_OUTPUT2
{
    float4 Pos        : POSITION;    // �ˉe�ϊ����W
    float  Col 		  : TEXCOORD0;    // �}�X�N�l
};

// ���_�V�F�[�_
VS_OUTPUT2 Mask_VS(float4 Pos : POSITION, float3 Normal : NORMAL, float2 Tex : TEXCOORD0)
{
    VS_OUTPUT2 Out = (VS_OUTPUT2)0;
    
    // �J�������_�̃��[���h�r���[�ˉe�ϊ�
    Out.Pos = mul( Pos, WorldViewProjMatrix );
    return Out;
}

// �s�N�Z���V�F�[�_
float4 Mask_PS( VS_OUTPUT2 IN ) : COLOR0
{
    return float4(0,0,0,0);
}

// �I�u�W�F�N�g�`��p�e�N�j�b�N
technique MaskTec < string MMDPass = "object"; > {
    pass DrawObject {
        AlphaBlendEnable = false;
        AlphaTestEnable = false;
        VertexShader = compile vs_2_0 Mask_VS();
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}

// �I�u�W�F�N�g�`��p�e�N�j�b�N
technique MaskTecBS  < string MMDPass = "object_ss"; > {
    pass DrawObject {
        AlphaBlendEnable = false;
        AlphaTestEnable = false;
        VertexShader = compile vs_2_0 Mask_VS();
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}
technique EdgeTec < string MMDPass = "edge"; > { }
technique ShadowTech < string MMDPass = "shadow";  > { }
technique ZplotTec < string MMDPass = "zplot"; > { }

///////////////////////////////////////////////////////////////////////////////////////////////
