import {FBXLoader} from "./three.js-master/examples/jsm/loaders/FBXLoader.js";
import {GLTFLoader} from "./three.js-master/examples/jsm/loaders/GLTFLoader.js";


export function addFBX(File, pos, rot, sca, scene){
	const loader = new FBXLoader();
	loader.load(File, (fbx) => {
		fbx.traverse((child) => {
			if(child.isMesh){
				child.castShadow = true;
				child.recieveShadow = true;
			}
		});

		fbx.position.set(pos.x, pos.y, pos.z);
		fbx.rotation.set(rot.x, rot.y, rot.z);
		fbx.scale.set(sca.x, sca.y, sca.z);

		scene.add(fbx);
	});
}

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
