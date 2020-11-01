////////////////////////////////////////////////////////////////////////////////////////////////
// �p�����[�^�錾


#define EYE_SUBSET  "6,13,15,16"
#define HAIR_SUBSET "1"

//�������߂���ڂƂ̊Ԃ̍ő勗��
float MaxDistance = 3;

//�ڂ𖾂邭�`�悷��W��
float EyeLight = 1.1;

////////////////////////////////////////////////////////////////////////////////////////////////

// ���@�ϊ��s��
float4x4 WorldViewProjMatrix      : WORLDVIEWPROJECTION;
float4x4 WorldMatrix              : WORLD;
float4x4 LightWorldViewProjMatrix : WORLDVIEWPROJECTION < string Object = "Light"; >;

float3   LightDirection    : DIRECTION < string Object = "Light"; >;
float3   CameraPosition    : POSITION  < string Object = "Camera"; >;
float3   CameraDirection   : DIRECTION < string Object = "Camera"; >;

// �}�e���A���F
float4   MaterialDiffuse   : DIFFUSE  < string Object = "Geometry"; >;
float3   MaterialAmbient   : AMBIENT  < string Object = "Geometry"; >;
float3   MaterialEmmisive  : EMISSIVE < string Object = "Geometry"; >;
float3   MaterialSpecular  : SPECULAR < string Object = "Geometry"; >;
float    SpecularPower     : SPECULARPOWER < string Object = "Geometry"; >;
float3   MaterialToon      : TOONCOLOR;
// ���C�g�F
float3   LightDiffuse      : DIFFUSE   < string Object = "Light"; >;
float3   LightAmbient      : AMBIENT   < string Object = "Light"; >;
float3   LightSpecular     : SPECULAR  < string Object = "Light"; >;
static float4 DiffuseColor  = MaterialDiffuse  * float4(LightDiffuse, 1.0f);
static float3 AmbientColor  = saturate(MaterialAmbient  * LightAmbient + MaterialEmmisive);
static float3 SpecularColor = MaterialSpecular * LightSpecular;

bool use_texture;  //�e�N�X�`���̗L��
bool use_toon;     //�g�D�[���̗L��


// �I�u�W�F�N�g�̃e�N�X�`��
texture ObjectTexture: MATERIALTEXTURE;
sampler ObjTexSampler = sampler_state
{
    texture = <ObjectTexture>;
    MINFILTER = LINEAR;
    MAGFILTER = LINEAR;
};

// MMD�{����sampler���㏑�����Ȃ����߂̋L�q�ł��B�폜�s�B
sampler MMDSamp0 : register(s0);
sampler MMDSamp1 : register(s1);
sampler MMDSamp2 : register(s2);


///////////////////////////////////////////////////////////////////////////////////////////////
// �ڕ`��

struct VS_OUTPUT
{
    float4 Pos        : POSITION;    // �ˉe�ϊ����W
    float2 Tex        : TEXCOORD1;   // �e�N�X�`��
    float3 Normal     : TEXCOORD2;   // �@��
    float3 Eye        : TEXCOORD3;   // �J�����Ƃ̑��Έʒu
    float4 Color      : COLOR0;      // �f�B�t���[�Y�F
};

// ���_�V�F�[�_
VS_OUTPUT Basic_VS(float4 Pos : POSITION, float3 Normal : NORMAL, float2 Tex : TEXCOORD0)
{
    VS_OUTPUT Out = (VS_OUTPUT)0;
    
    // �J�������_�̃��[���h�r���[�ˉe�ϊ�
    Out.Pos = mul( Pos, WorldViewProjMatrix );
    
    // �J�����Ƃ̑��Έʒu
    Out.Eye = CameraPosition - mul( Pos, WorldMatrix );
    // ���_�@��
    Out.Normal = normalize( mul( Normal, (float3x3)WorldMatrix ) );
    
    // �f�B�t���[�Y�F�{�A���r�G���g�F �v�Z
    Out.Color.rgb = saturate( max(0,dot( Out.Normal, -LightDirection )) * DiffuseColor.rgb + AmbientColor );
    Out.Color.a = DiffuseColor.a;
    
    // �e�N�X�`�����W
    Out.Tex = Tex;
    
    return Out;
}

// �s�N�Z���V�F�[�_
float4 Basic_PS( VS_OUTPUT IN ) : COLOR0
{
    // �X�y�L�����F�v�Z
    float3 HalfVector = normalize( normalize(IN.Eye) + -LightDirection );
    float3 Specular = pow( max(0,dot( HalfVector, normalize(IN.Normal) )), SpecularPower ) * SpecularColor;
    
    float4 Color = IN.Color;
    if ( use_texture ) {  //������if���͔�����I
        // �e�N�X�`���K�p
        Color *= tex2D( ObjTexSampler, IN.Tex );
    }
    if ( use_toon ) {  //����
        // �g�D�[���K�p
        float LightNormal = dot( IN.Normal, -LightDirection );
        Color.rgb *= lerp(saturate(MaterialToon * EyeLight), float3(1,1,1), saturate(LightNormal * 16 + 0.5));
    }
    // �X�y�L�����K�p
    Color.rgb += Specular;
    
    return Color;
}

// �I�u�W�F�N�g�`��p�e�N�j�b�N
technique MainTec < string MMDPass = "object"; string Subset = EYE_SUBSET;> {
    pass DrawObject
    {
        VertexShader = compile vs_2_0 Basic_VS();
        PixelShader  = compile ps_2_0 Basic_PS();
    }
}

// �I�u�W�F�N�g�`��p�e�N�j�b�N
technique MainTecBS  < string MMDPass = "object_ss"; string Subset = EYE_SUBSET;> {
    pass DrawObject {
        VertexShader = compile vs_2_0 Basic_VS();
        PixelShader  = compile ps_2_0 Basic_PS();
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////
// �I�u�W�F�N�g�`��

struct VS_OUTPUT2
{
    float4 Pos        : POSITION;    // �ˉe�ϊ����W
    float  Col        : TEXCOORD0;    // �}�X�N�l
};

// ���_�V�F�[�_
VS_OUTPUT2 Mask_VS(float4 Pos : POSITION, float3 Normal : NORMAL, uniform bool hidden)
{
    VS_OUTPUT2 Out = (VS_OUTPUT2)0;
    
    Out.Pos = Pos;
    
    if(hidden){
        //�J�������牓�����邱�ƂŖڂ�O�ʂɏo��
        float3 camdir = normalize(Pos - CameraPosition);
        Out.Pos.xyz += camdir * MaxDistance;
    }
    
    // �J�������_�̃��[���h�r���[�ˉe�ϊ�
    Out.Pos = mul( Out.Pos, WorldViewProjMatrix );
    
    return Out;
}

// �s�N�Z���V�F�[�_
float4 Mask_PS( VS_OUTPUT2 IN ) : COLOR0
{
    return float4(0,0,0,0);
}


///////////////////////////////////////////////////////////////////////////////////////////////
// ���`��

technique HairTec < string MMDPass = "object"; string Subset = HAIR_SUBSET;> {
    pass DrawObject {
        AlphaBlendEnable = false;
        AlphaTestEnable = false;
        VertexShader = compile vs_2_0 Mask_VS(true);
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}
technique HairTecBS  < string MMDPass = "object_ss"; string Subset = HAIR_SUBSET;> {
    pass DrawObject {
        AlphaBlendEnable = false;
        AlphaTestEnable = false;
        VertexShader = compile vs_2_0 Mask_VS(true);
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////
// ���̑��̃I�u�W�F�N�g���}�X�N�`��

technique MainTecMask < string MMDPass = "object"; > {
    pass DrawObject {
        AlphaBlendEnable = false;
        AlphaTestEnable = false;
        VertexShader = compile vs_2_0 Mask_VS(false);
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}

// �I�u�W�F�N�g�`��p�e�N�j�b�N
technique MainTecBSMask  < string MMDPass = "object_ss"; > {
    pass DrawObject {
        AlphaBlendEnable = false;
        AlphaTestEnable = false;
        VertexShader = compile vs_2_0 Mask_VS(false);
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////

technique EdgeTec < string MMDPass = "edge"; > { }
technique ShadowTech < string MMDPass = "shadow";  > { }
technique ZplotTec < string MMDPass = "zplot"; > { }

///////////////////////////////////////////////////////////////////////////////////////////////

