////////////////////////////////////////////////////////////////////////////////////////////////
// ���[�U�[�p�����[�^

//�A���t�@�l
//float Alpha = 0.5;
float Alpha = 0.5;

//�w�i�F
float4 ClearColor
<
	string UIName = "ClearColor";
	string UIWidget = "Color";
	bool UIVisible = true;
> = float4(0, 0, 0, 0);


texture EyeRT: OFFSCREENRENDERTARGET <
	string Description = "OffScreen RenderTarget for PostAlphaEye.fx";
	float4 ClearColor = { 0, 0, 0, 0 };
	float ClearDepth = 1.0;
	bool AntiAlias = true;
	int MipLevels = 1;
	string DefaultEffect =

		// �����Ɂu"(���f����).pmd = DrawEye����.fx;"�v�̂悤�ɒǉ����Ă��� ///////////

		//"�����~�NVer2.pmd = DrawEye1.fx;"
		//"�㉹�n�N.pmd = DrawEye2.fx;"
	"random-chan82.pmx = DrawEyeRandomchan.fx;"

	///////////////////////////////////////////////////////////////////////////////

	"* = DrawMask.fx;";

> ;

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//����ȍ~�̓G�t�F�N�g�̒m���̂���l�ȊO�͐G��Ȃ�����



float Script : STANDARDSGLOBAL <
	string ScriptOutput = "color";
	string ScriptClass = "scene";
	string ScriptOrder = "postprocess";
> = 0.8;




sampler EyeView = sampler_state {
	texture = <EyeRT>;
	Filter = LINEAR;
	AddressU = CLAMP;
	AddressV = CLAMP;
};


// �}�e���A���F
float4 MaterialDiffuse : DIFFUSE < string Object = "Geometry"; > ;
static float alpha1 = MaterialDiffuse.a;

float scaling0 : CONTROLOBJECT < string name = "(self)"; > ;
static float scaling = scaling0 * 0.1;

float3 objpos : CONTROLOBJECT < string name = "(self)"; > ;

// �X�N���[���T�C�Y
float2 ViewportSize : VIEWPORTPIXELSIZE;

static const float2 ViewportOffset = (float2(0.5, 0.5) / ViewportSize);

// �����_�����O�^�[�Q�b�g�̃N���A�l
float ClearDepth = 1.0;


////////////////////////////////////////////////////////////////////////////////////////////////
// ���ʒ��_�V�F�[�_
struct VS_OUTPUT {
	float4 Pos            : POSITION;
	float2 Tex            : TEXCOORD0;
};

VS_OUTPUT VS_passDraw(float4 Pos : POSITION, float4 Tex : TEXCOORD0) {
	VS_OUTPUT Out = (VS_OUTPUT)0;

	Out.Pos = Pos;
	Out.Tex = Tex + ViewportOffset;

	return Out;
}

////////////////////////////////////////////////////////////////////////////////////////////////

float4 PS_Test(float2 Tex: TEXCOORD0) : COLOR{
	float4 Color = tex2D(EyeView, Tex);
	Color.a *= (alpha1 * Alpha);
	return Color;
}

////////////////////////////////////////////////////////////////////////////////////////////////

technique PostAlphaEye <
	string Script =

	"RenderColorTarget0=;"
	"RenderDepthStencilTarget=;"
	"ClearSetColor=ClearColor;"
	"ClearSetDepth=ClearDepth;"
	"Clear=Color;"
	"Clear=Depth;"
	"ScriptExternal=Color;"

	"RenderColorTarget0=;"
	"RenderDepthStencilTarget=;"
	"Pass=DrawEye;"
	;

> {

	pass DrawEye < string Script = "Draw=Buffer;"; > {
		AlphaBlendEnable = true;
		VertexShader = compile vs_2_0 VS_passDraw();
		PixelShader = compile ps_2_0 PS_Test();
	}

}
////////////////////////////////////////////////////////////////////////////////////////////////
