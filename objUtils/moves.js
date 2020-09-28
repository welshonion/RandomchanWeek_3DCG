export function rot_y(obj, pos){
	//// 初期位置posのobjをy軸中心に回転

	let frame = 0;
	let t = 0;
	const center = new THREE.Vector3(0.0, pos.y, 0.0);
	const mag = Math.sqrt((pos.x - center.x)**2 + (pos.z - center.z)**2);

	obj.position.set(pos.x, pos.y, pos.z);
	obj.lookAt(center);

	Update();

	function Update(){
		t = frame / fps * speed * 2 * Math.PI / 10;
		obj.position.set(mag * Math.cos(t), pos.y, mag * Math.sin(t)); obj.lookAt(center);

		requestAnimationFrame(Update);
		frame++;
	}
}
