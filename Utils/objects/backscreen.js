export function backscreen(width, height, scale, scene, camera){
	//// cameraからのレンダリング映像を映すスクリーンを返す
	//// 解像度:width x height
	//// size:[width, height] * scale
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
