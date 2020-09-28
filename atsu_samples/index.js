import * as camSwitcher from "./camera/camSwitcher.js";
import * as camUtils from "./camera/camUtils.js";
import * as model_import from "./model_import.js";
window.addEventListener('load', init);

const cameras = [
	camUtils.point_cam(new THREE.Vector3(0, 40, 100), new THREE.Vector3(0, 40, 0)),
	camUtils.rot_cam(new THREE.Vector3(0, 40, 100), new THREE.Vector3(0, 10, 0), 1.5),
	camUtils.shake_cam(new THREE.Vector3(40, 0, 60), new THREE.Vector3(200, 0, 0), 3.0, 5.0),
	camUtils.point_cam(new THREE.Vector3(-100, 40, -20), new THREE.Vector3(0, 0, 0)),
]

function init(){
	const width = 1280;
	const height = 720;

	//////// renderer
	const renderer = new THREE.WebGLRenderer({
		canvas:document.querySelector("#main")
	});
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);


	//////// camera
	const swt = new camSwitcher.CamSwitcher(cameras);
	let camera = swt.now_cam();
	console.log(camera);

	/* カメラ切り替えテスト */
	window.addEventListener('click', cam_switch);
	function cam_switch(){
		swt.switch_cam();
	}


	//////// scene
	const testscene = MakeTestScene();

	//////// FBXLoad
	const steel_frame = "./models/steel_frame.fbx";
	model_import.addFBX(steel_frame, new THREE.Vector3(0.02,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0.06, 0.06, 0.06), testscene);

	/* 追従テスト */
	const sphere = new THREE.SphereGeometry(5,32,32);
	const red = new THREE.MeshPhongMaterial({
		color:0xff0000
	});
	const x = new THREE.Mesh(sphere, red);
	let t = 0.0;
	x.position.set(10, 0, 0);
	testscene.add(x);

	//////// Backscreen
	const back_cam = new camUtils.target_cam(new THREE.Vector3(40, 30, 50), x);
	const screen = backscreen(width, height, 0.1, testscene, back_cam);
	screen.position.set(0, 30, 0);
	testscene.add(screen);

	//////// renderer
	Update();

	//////// Update every frame
	function Update(){
		camera = swt.now_cam();
		renderer.render(testscene, camera);

		requestAnimationFrame(Update);

		/* 追従テスト */
		x.position.add(new THREE.Vector3(0.1 * Math.sin(t), 0.1 * Math.cos(t), 0.0));
		t += 0.01;
	}
	return;
}

function backscreen(width, height, scale, scene, camera){
	//// カメラからの映像を映すスクリーンを返す
	const canvas = document.createElement('canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas:canvas
	});
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);


	const geometry = new THREE.PlaneGeometry(width * scale, height * scale);
	const texture = new THREE.Texture(canvas);
	const material = new THREE.MeshBasicMaterial({
		map:texture
	});
	const screen = new THREE.Mesh(geometry, material);
	screen.material.map.needsUpdate = true;

	Update();
	function Update(){
		renderer.render(scene, camera);
		screen.material.map.needsUpdate = true;

		requestAnimationFrame(Update);
	}
	return screen;
}


function MakeTestScene(){
	//// 各Helper付きのテストシーンを返す
	const red = new THREE.MeshPhongMaterial({
		color:0xff0000
	});
	const green = new THREE.MeshPhongMaterial({
		color:0x00ff00
	});
	const blue = new THREE.MeshPhongMaterial({
		color:0x0000ff
	});
	const white = new THREE.MeshStandardMaterial({
		color:0xffffff
	});

	const sphere = new THREE.SphereGeometry(5,32,32);

	// spheres
//	const c = new THREE.Mesh(sphere, white);
//	const x = new THREE.Mesh(sphere, red);
//	const y = new THREE.Mesh(sphere, green);
//	const z = new THREE.Mesh(sphere, blue);
//	c.position.set(0,0,0);
//	x.position.set(20,0,0);
//	y.position.set(0,20,0);
//	z.position.set(0,0,20);

	// lights
	const light = new THREE.DirectionalLight(0xffffff);

	light.position.set(1,10,1);

	// helpers
	const gridHelper = new THREE.GridHelper(200,50);
	const axisHelper = new THREE.AxesHelper(200,50);
	const lightHelper = new THREE.DirectionalLightHelper(light,20);

	// scene
	const scene = new THREE.Scene();
//	scene.add(c);
//	scene.add(x);
//	scene.add(y);
//	scene.add(z);
	scene.add(light);
	scene.add(gridHelper);
	scene.add(axisHelper);
	scene.add(lightHelper);

	return scene;
}
