import {FBXLoader} from "../../libs/examples/jsm/loaders/FBXLoader.js";
import {GLTFLoader} from "../../libs/examples/jsm/loaders/GLTFLoader.js";


function rot_y(object, pos, rot, speed){
	//// 初期位置posのobjectをY軸回転
	const fps = 60;
	let frame = 0;
	let t = 0;
	const mag = Math.sqrt(pos.x ** 2 + pos.z ** 2);

	object.position.set(pos.x, pos.y, pos.z);
	object.rotation.set(rot.x, rot.y, rot.z);

	Update();

	function Update(){
		t = frame / fps * speed * 2 * Math.PI / 10;
		object.position.set(mag * Math.cos(t), pos.y, mag * Math.sin(t));

		requestAnimationFrame(Update);
		frame++;
	}
}

export function importFBX(File, pos, rot, sca, speed=3.0, scene){
	const loader = new FBXLoader();
	loader.load(File, (fbx) => {
		fbx.traverse((child) => {
			if(child.isMesh){
				child.castShadow = true;
				child.recieveShadow = true;
			}

		});
		rot_y(fbx, pos, rot, speed);
		fbx.scale.set(sca.x, sca.y, sca.z);

		scene.add(fbx);
	});

}

/*
export function addGLTF(File, pos, rot, sca, scene){
	const loader = new GLTFLoader();
	loader.load(File, (gltf) => {
		let model = gltf.scene;

		model.position.set(pos.x, pos.y, pos.z);
		model.rotation.set(rot.x, rot.y, rot.z);
		model.scale.set(sca.x, sca.y, sca.z);

		scene.add(model);
	});
}
*/
