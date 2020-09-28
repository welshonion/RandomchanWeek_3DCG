function rot_y(obj, pos){
	///// 初期位置posでy軸中心にobjを回転する
	let frame = 0;
	let t = 0;
	const center = new THREE.Vector3(0.0, pos.y, 0.0);
	const mag = Math.sqrt((pos.x - center.x)**2 + (pos.z - center.z)**2);

	obj.position.set(pos.x, pos.y, pos.z);
	obj.lookAt(center);

	Update();
	function Update(){
		t = frame / fps * speed * 2 * Math.PI / 10;
		obj.position.set(mag * Math.cos(t), pos.y, mag * Math.sin(t));
		camera.lookAt(center);
		frame++;
		
		requestAnimationFrame(Update);
	}

}
