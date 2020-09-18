let camera;
let scene;
let renderer;

function init() {
    // init stats
    let stats = initStats();

    // sceneオブジェクト->コンテナオブジェクト　これに格納しないと何も描画されない
    scene = new THREE.Scene();
    // percpective Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

    // renderer カメラオブジェクトからシーンがどのように見えるのか計算する.
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 影を有効にする objectに対して影を落とす物体か落とされる物体か明示する必要がある
    renderer.shadowMap.enabled = true;

    // MetaBoll

    // add dom
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    // call the render function
    render();

    // render function
    function render() {
        stats.update();
        //sphere.rotation.y=step+=0.01;
        let delta = clock.getDelta();
        orbitControls.update(delta);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        // webGLRenderer.render(scene, camera);
        composer.render(delta);
    }

    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }
}
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onload = init;
window.addEventListener('resize', onResize, false);
