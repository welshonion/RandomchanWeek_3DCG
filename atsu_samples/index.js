import * as camutil from "./camera/camUtils.js";
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
	const camera = camutil.rot_cam(new THREE.Vector3(80, 20, 0), new THREE.Vector3(0,0,0));

	//////// scene
	const testscene = MakeTestScene();

	renderer.render(testscene, camera);
	Update();

	//////// Update every frame
	function Update(){
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
	const c = new THREE.Mesh(sphere, white);
	const x = new THREE.Mesh(sphere, red);
	const y = new THREE.Mesh(sphere, green);
	const z = new THREE.Mesh(sphere, blue);
	c.position.set(0,0,0);
	x.position.set(20,0,0);
	y.position.set(0,20,0);
	z.position.set(0,0,20);

	// lights
	const light = new THREE.DirectionalLight(0xffffff);

	light.position.set(1,1,1);

	// helpers
	const gridHelper = new THREE.GridHelper(200,50);
	const axisHelper = new THREE.AxesHelper(200,50);
	const lightHelper = new THREE.DirectionalLightHelper(light,20);

	// scene
	const scene = new THREE.Scene();
	scene.add(c);
	scene.add(x);
	scene.add(y);
	scene.add(z);
	scene.add(light);
	scene.add(gridHelper);
	scene.add(axisHelper);
	scene.add(lightHelper);

	return scene;
}
