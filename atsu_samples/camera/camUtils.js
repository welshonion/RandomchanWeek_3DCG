const fps = 60;
const width = 1280;
const height = 720;

export function rot_cam(pos, center, speed=1){
	//// Vector3型centerを中心にcameraをy軸回転

	let frame = 0;
	let t = 0;
	const mag = Math.sqrt((pos.x - center.x)**2 + (pos.z - center.z)**2);
	const camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);

	camera.position.set(pos);
	camera.lookAt(center);

	Update();

	function Update(){
//	console.log("rot_cam.Update");

	t = frame / fps * speed * 2 * Math.PI / 10;
	camera.position.set(mag * Math.cos(t), pos.y, mag * Math.sin(t));
	camera.lookAt(center);

	requestAnimationFrame(Update);
	frame++;
	}

	return camera;
}

