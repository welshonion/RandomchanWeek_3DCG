import { ShaderMaterial } from '../../libs/src/materials/shadermaterial.js';

const testdata = [
	{"name":"hoge", "tweet":"hogehoge"},
	{"name":"aefewd", "tweet":"miria"},
	{"name":"VD", "tweet":"滲み出す混濁の紋章、不遜なる狂気の器、湧き上がり・否定し・痺れ・瞬き・眠りを妨げる爬行する鉄の王女、絶えず自壊する泥の人形、結合せよ、反発せよ、地に満ち 己の無力を知れ　破道の九十・黒棺"},
	{"name":"three.js", "tweet":"ioioind"},
	{"name":"force", "tweet":"食べるんご"},
	{"name":"これは140字です", "tweet":"ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ"},
	{"name":"666", "tweet":"ぺこ"}
];

const width_per_tweet = 512;
const height_per_tweet = 134;
const font_step = 66;//この文字数以上のツイートは小さく表示

export function tweet_panel(scale){
	//// tweetをyoutube live 風に表示するパネル
	const File = null;// TODO jsonファイルのディレクトリ
	const max_per_line = [22, 36];

	const canvas = document.createElement('canvas');
	let tweets;
	if(!File){
		tweets = testdata;
	}else{
		tweets = JSON.parse(File);
	}

	/* canvas描画*/
	const twesize = tweets.length;
	const twelines = count_lines(tweets, max_per_line);
	let num_lines = 0;
	for(let i = 0;i < twesize;i++){
		num_lines += twelines[i];
	}
	canvas.width = width_per_tweet;
	canvas.height = height_per_tweet * twesize + num_lines;
	const ctx = canvas.getContext('2d');
	//// 背景
	ctx.fillStyle = "rgb(235, 235, 255)";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	for(let i = 0;i < twesize;i++){
		//// アカウント名
		ctx.font = "20px 'MS Pゴシック'"
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillText(tweets[i]["name"], 20, 40 + i * height_per_tweet);

		//// ツイート内容
		let font_style, h_per_l, issmall;
		if(tweets[i]["tweet"] < font_step){
			font_style = "20px 'MS Pゴシック'" ;
			h_per_l = 30;
			issmall = 0;
		}else{
			font_style = "12px 'MS Pゴシック'" ;
			h_per_l = 17;
			issmall = 1;
		}
		for(let k = 0;k < twelines[i];k++){
			const content = tweets[i]["tweet"].substr(k * max_per_line[issmall], max_per_line[issmall]);
			ctx.font = font_style;
			ctx.fillStyle = "rgb(0, 0, 0)";
			ctx.fillText(content, 40, 70 + i * height_per_tweet + k * h_per_l);
		}

		//// 各ツイート装飾
		ctx.beginPath();
		ctx.moveTo(0, height_per_tweet * (1 + i));
		ctx.lineTo(width_per_tweet, height_per_tweet * (1 + i));
		ctx.closePath();
		ctx.stroke();
		
	}

	let time = 0.0;

	const geometry = new THREE.PlaneGeometry(canvas.width * scale, height_per_tweet * 4 * scale);
	const texture = new THREE.Texture(canvas);
	const material = new ShaderMaterial({
		uniforms:{
			map:{ value:texture },
			time:{ value:time },
			num_tweet:{ value:twesize }
		},
		vertexShader:vert,
		fragmentShader:frag

	});
	material.transparent = true;
	const screen = new THREE.Mesh(geometry, material);
//	screen.material.map.needsUpdate = true;
	texture.needsUpdate = true;

	Update();
	function Update(){
//		screen.material.map.needsUpdate = true;
		texture.needsUpdate = true;
		time += 1.0;
		material.uniforms.time.value = time;

		requestAnimationFrame(Update);
	}
	return screen;
}

function count_lines(tweets, max_letters){
	let lines = [];
	for(let i = 0;i < tweets.length;i++){
		if(tweets[i]["tweet"].length < font_step){
			lines.push(Math.floor(tweets[i]["tweet"].length / max_letters[0]) + 1);
		}
		else{
			lines.push(Math.floor(tweets[i]["tweet"].length / max_letters[1]) + 1);
		}
	}
	return lines;
}

export const vert =
    `
precision mediump float;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
	vUv = uv;
}
    `
export const frag =
    `
precision mediump float;
uniform float time;
uniform sampler2D map;
uniform float num_tweet;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
	vec2 texUV = vUv;
	texUV.y = texUV.y * 4.0 / num_tweet + 0.44;

	float cycle = 120.0;
	float stay = 80.0;
	float t = mod(time, cycle);
	float now = floor(time / cycle);
	texUV.y += now / num_tweet;
	texUV.y += max(0.0, t - stay) / (cycle - stay) / num_tweet;

	texUV.y = fract(texUV.y);
	vec3 color = texture2D(map, texUV).rgb;
    gl_FragColor = vec4(color, 0.8);
}
    `
