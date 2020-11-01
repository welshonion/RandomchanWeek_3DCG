import { ShaderMaterial } from '../../libs/src/materials/shadermaterial.js';

export function backscreen(width, height, scale, scene, camera){
	//// cameraからのレンダリング映像を映すスクリーンを返す
	//// 解像度:width x height
	//// size:[width, height] * scale
	const canvas = document.createElement('canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas:canvas
	});
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);

	let time = 0.0;

	const geometry = new THREE.PlaneGeometry(width * scale, height * scale);
	const texture = new THREE.Texture(canvas);
//	const material = new MeshBasicMaterial({
//		map:texture	
//	});
	const material = new ShaderMaterial({
		uniforms:{
			map:{ value:texture },
			time:{ value:time }
		},
		vertexShader:vert,
		fragmentShader:crt

	});
	const screen = new THREE.Mesh(geometry, material);
//	screen.material.map.needsUpdate = true;
	texture.needsUpdate = true;

	Update();
	function Update(){
		renderer.render(scene, camera);
//		screen.material.map.needsUpdate = true;
		texture.needsUpdate = true;
		time += 1.0;
		material.uniforms.time.value = time;

		requestAnimationFrame(Update);
	}
	return screen;
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

const crt = 
	`
// 参考サイト
// http://wordpress.notargs.com/blog/blog/2016/01/09/unity3d%E3%83%96%E3%83%A9%E3%82%A6%E3%83%B3%E7%AE%A1%E9%A2%A8%E3%82%B7%E3%82%A7%E3%83%BC%E3%83%80%E3%83%BC%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%9F/
precision mediump float;
uniform float time;
uniform sampler2D map;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

float rand(vec2 co){
	return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float rand(float val){
	return fract(sin(val * 15.55) * 43758.5453);
}
float noise(float t){
	return exp(sin(t / 20.0) + sin(t / 7.0 - 0.2) + sin(t / 3.0 + 0.5) - 0.4) / 30.0;
}

void main(){
	vec3 color;

	// 画面歪み
	float vignet = length(vec2(vUv.x - 0.5, vUv - 0.5));
	vec2 texUV = vUv / (1.0 - vignet * 0.2);

	// ノイズ、オフセット
	float noiseX = noise(time);
	float SinNoiseWidth = 0.7;
	float SinNoiseScale = 0.4;
	float SinNoiseOffset = 0.0;
	texUV.x += sin(texUV.y * SinNoiseWidth + SinNoiseOffset) * SinNoiseScale * noiseX;
	texUV.x += (rand(floor(texUV.y * 500.0) + time) - 0.5) * noiseX;

	// RGBずらし
	color.r = texture2D(map, texUV).r;
	color.g = texture2D(map, texUV - vec2(0.003, 0.0)).g;
	color.b = texture2D(map, texUV - vec2(0.006, 0.0)).b;

	// ScanLine描画
	float ScanLineTail = 0.8;
	float ScanLineSpeed = 0.7;
//	float ScanLineTail = 1.0;
//	float ScanLineSpeed = 1.0;

	float ScanLineColor = sin(time * 10.0 + texUV.y * 500.0) / 2.0 + 0.5;
	color *= 0.5 + clamp(ScanLineColor + 0.5, 0.0, 1.0) * 0.5;

	// ScanLine残像
	float tail = clamp((fract(vUv.y + time * ScanLineSpeed) - 1.0 + ScanLineTail) / min(ScanLineTail, 1.0), 0.0, 1.0);
	color *= tail;
	

	gl_FragColor = vec4(color, 1.0);
}
	`
