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
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 影を有効にする objectに対して影を落とす物体か落とされる物体か明示する必要がある
    renderer.shadowMap.enabled = true;

    // 軸を表示する
    let axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // Material
    // Basic, Lambert, Phong, Standerd

    // 床オブジェクト配置
    let planeGeometry = new THREE.PlaneGeometry(60, 20);
    // let planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    let planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);

    // 箱オブジェクト
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    // let cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0

    scene.add(cube);

    // 球オブジェクト
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    // var sphereMaterial = new THREE.MeshBasicMaterial({color: 0x7777ff, wireframe: true});
    let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff, wireframe: true});
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;

    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;

    scene.add(sphere);

    // set spotLight
    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 30, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // htmlのDOMに追加
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    let controls = new function() {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    }

    // set GUI
    let gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);

    // call the rendering function
    let step = 0;

    renderScene();

    // render function
    function renderScene() {
        stats.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 + (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
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
