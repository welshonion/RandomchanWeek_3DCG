//// window_property
const fps = 60;
const width = 1280;
const height = 720;

//// camera_property
const fov = 45;
const near = 1;
const far = 10000;

export function point_cam(pos, center){
	//// 定点カメラ Vector3型posからcenterを見る
	const camera = new THREE.PerspectiveCamera(fov, width/height, near, far);

	camera.position.set(pos.x, pos.y, pos.z);
	camera.lookAt(center);

	/*
	Update();

	function Update(){
		camera.position.set(pos);
		camera.lookAt(center);

		requestAnimationFrame(Update);
	}
	*/

	return camera;
}

export function rot_cam(pos, center, speed=1.0){
	//// Vector3型centerを中心にcameraをy軸回転

	let frame = 0;
	let t = 0;
	const mag = Math.sqrt((pos.x - center.x)**2 + (pos.z - center.z)**2);
	const camera = new THREE.PerspectiveCamera(fov, width/height, near, far);

	camera.position.set(pos.x, pos.y, pos.z);
	camera.lookAt(center);

	Update();

	function Update(){
		t = frame / fps * speed * 2 * Math.PI / 10;
		camera.position.set(mag * Math.cos(t), pos.y, mag * Math.sin(t));
		camera.lookAt(center);

		requestAnimationFrame(Update);
		frame++;
	}

	return camera;
}

export function shake_cam(pos, center, speed=1.0, range=3.0){
	//// 疑似ランダム(sin波)で揺れるカメラ
	
	function noise(t){
		return {
		x : range / 3 * (Math.sin(t + 2.7) + Math.sin(-1.5*t + 1) + 0.7*Math.sin(0.3*t)), 
		y : range / 3 * (0.9*Math.sin(0.3*t + 2.7) + 1.3*Math.sin(1.2*t + 0.2) + 0.4*Math.sin(-0.7*t + 1.9)),
		z : range / 3 * (1.3*Math.sin(0.9*t + 1.0) + 1.1*Math.sin(0.7*t + 2.8) + 0.4*Math.sin(1.4*t + 0.4))
		};
	}
	

	let frame = 0;
	let t = 0;
	let ns;

	const camera = new THREE.PerspectiveCamera(fov, width/height, near, far);

	camera.position.set(pos.x, pos.y, pos.z);
	camera.lookAt(center);

	Update();

	function Update(){
		t = frame / fps * speed * 2 * Math.PI / 10;
		ns = noise(t);
		
		camera.position.set(pos.x + ns.x, pos.y + ns.y, pos.z + ns.z);
		camera.lookAt(center.x + ns.x, center.y + ns.y, center.z + ns.z);
		
		requestAnimationFrame(Update);
		frame++;
	}

	return camera;
}
