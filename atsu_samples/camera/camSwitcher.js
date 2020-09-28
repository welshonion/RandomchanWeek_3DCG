import * as camUtils from "./camUtils.js";

// デフォルトではこのカメラ群を適用
const cameras = [
	camUtils.point_cam(new THREE.Vector3(0, 80, 50), new THREE.Vector3(0, 80, 0)),
	camUtils.rot_cam(new THREE.Vector3(0, 40, 100), new THREE.Vector3(0, 10, 0), 1.5),
	camUtils.shake_cam(new THREE.Vector3(40, 0, 60), new THREE.Vector3(200, 0, 0), 3.0, 5.0),
	camUtils.point_cam(new THREE.Vector3(-100, 40, -20), new THREE.Vector3(0, 0, 0)),
]

export class CamSwitcher{
	//// 複数カメラの保存と切り替え
	constructor(cams = cameras, now = 0){
		this.cams = cams;
		this.now = now;
	}

	switch_cam(next = (this.now + 1) % cameras.length){
		//// カメラ切り替え

		this.now = next;
	}

	now_cam(){
		return this.cams[this.now];
	}

	add(cam){
		this.cams.push(cam);
	}
}

