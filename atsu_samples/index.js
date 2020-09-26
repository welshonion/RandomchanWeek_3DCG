import * as camSwitcher from "./camera/camSwitcher.js";
import * as camUtils from "./camera/camUtils.js";
import {FBXLoader} from "./three.js-master/examples/jsm/loaders/FBXLoader.js";
import {GLTFLoader} from "./three.js-master/examples/jsm/loaders/GLTFLoader.js";
window.addEventListener('load', init);


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
	const swt = new camSwitcher.CamSwitcher();
	let camera = swt.now_cam();

	/* カメラ切り替えテスト */
	window.addEventListener('click', cam_switch);
	function cam_switch(){
		swt.switch_cam();
	}


	//////// scene
	const testscene = MakeTestScene();

	//////// FBXLoad
	const steel_frame = "./models/steel_frame.fbx";
	initFBX(steel_frame, new THREE.Vector3(0.02,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(0.06, 0.06, 0.06));

	function initFBX(File, pos, rot, sca){
		const loader = new FBXLoader();
		loader.load(File, (fbx) => {
			fbx.traverse((child) => {
				if(child.isMesh){
					child.castShadow = true;
					child.recieveShadow = true;
				}
			});

			fbx.position.set(pos.x, pos.y, pos.z);
			console.log(fbx.position);
			fbx.rotation.set(rot.x, rot.y, rot.z);
			fbx.scale.set(sca.x, sca.y, sca.z);

			testscene.add(fbx);

			camera = new camUtils.target_cam(new THREE.Vector3(40, 50, 30), fbx, new THREE.Vector3(0, 30, 0));

			let t = 0.0;
			Update();
			function Update(){
				requestAnimationFrame(Update);
				fbx.position.add(new THREE.Vector3(0.0, Math.sin(t), 0.0));

				t += 0.5;
			}

		});
	}
	function initGLTF(File, pos, rot, sca){
		const loader = new GLTFLoader();
		loader.load(File, (gltf) => {
			let model = gltf.scene;

			model.position.set(pos.x, pos.y, pos.z);
			model.rotation.set(rot.x, rot.y, rot.z);
			model.scale.set(sca.x, sca.y, sca.z);

			testscene.add(model);
		});
	}



	//////// renderer
	//const ef =  new THREE.EffectComposer(renderer);
	renderer.render(testscene, camera);
	Update();

	//////// Update every frame
	function Update(){
//		camera = swt.now_cam();
		renderer.render(testscene, camera);

		requestAnimationFrame(Update);
	}
	return;
}




function MakeTestScene(){
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
