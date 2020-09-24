import { lavaVert, lavaFrag, lineFrag, wave } from '../myLibs/shaders/shader.js';

let camera;
let scene;
let renderer;
let marchingCubes;
function init() {
    // init stats
    let stats = initStats();

    // sceneオブジェクト->コンテナオブジェクトこれに格納しないと何も描画されない
    scene = new THREE.Scene();
    // percpective Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    // camera setting
    camera.position.x = 0;
    camera.position.y = 150;
    camera.position.z = 250;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // renderer カメラオブジェクトからシーンがどのように見えるのか計算する.
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 影を有効にする objectに対して影を落とす物体か落とされる物体か明示する必要がある
    // renderer.shadowMap.enabled = true;

    // 軸を表示する
    let axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // set spotLight
    let pointLight = new THREE.PointLight(0xff3300);
    let lightPos = new THREE.Vector3(30, 30, 30);
    pointLight.position.set(lightPos.x, lightPos.y, lightPos.z);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // point light helper
    let sphereSize = 1;
    let pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    // MetaBoll
    let metaMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });

    // shader Maeterial
    const uniform = {
        time: {
            type: 'f',
            value: 1.0
        },
        resolution: {
            type: "v2",
            value: new THREE.Vector2()
        },
        dirLightPos: {
            type: "v3",
            value: new THREE.Vector3()
        },
        dirLightColor: {
            type: "v3",
            value: new THREE.Color(0xeeeeee)
        },
        pointLightPos: {
            type: "v3",
            value: new THREE.Vector3()
        },
        pointLightColor: {
            type: "v3",
            value: new THREE.Color(0xeeeeee)
        },
        size: {
            type: 'f',
            value: 32.0
        },
    };


    // Blobs
    uniform.resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    uniform.dirLightPos.value = light.position;
    uniform.dirLightColor.value = light.color;
    uniform.pointLightPos.value = pointLight.position;
    uniform.pointLightColor.value = pointLight.color;

    let material = new THREE.ShaderMaterial({
        uniforms: uniform,
        vertexShader: lavaVert,
        fragmentShader: wave,
    });

    const resolution = 48;
    marchingCubes = new THREE.MarchingCubes(resolution, material, true, true);
    marchingCubes.position.set(0, 0, 0);
    marchingCubes.scale.set(100, 100, 100);

    scene.add(marchingCubes);

    // update metaball
    function updateCubes(marchingCubes, time) {
        // reset metaball
        marchingCubes.reset();

        let subtract = 18;
        let strength = 0.5;

        let ballx, bally, ballz;

        for (let i = 0; i < 30; i++) {
            ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
            bally = Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i)) * 0.27 + 0.5;
            ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;
            marchingCubes.addBall(ballx, bally, ballz, strength, subtract);
        }
    }


    // add dom
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    //render setup
    let controls = new function () {
        this.hue = 1.0;
        this.saturation = 1.0;
        this.lightness = 1.0;
    }
    let gui = new dat.GUI();
    let h = gui.addFolder("pointLight");
    h.add(controls, 'hue', 0, 1.0, 0.25);
    h.add(controls, 'saturation', 0.0, 1.0, 0.25);
    h.add(controls, 'lightness', 0.0, 1.0, 0.25);

    let orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = true;
    let clock = new THREE.Clock();

    // call the render function
    render();

    // render function
    function render() {
        stats.update();
        //sphere.rotation.y=step+=0.01;
        let delta = clock.getDelta();
        orbitControls.update(delta);
        let time = clock.elapsedTime;

        uniform.time.value += delta;
        updateCubes(marchingCubes, time);

        lightPos.x = 20 * Math.cos(time);
        lightPos.y = 20 * Math.sin(time * 0.4);
        lightPos.z = 20 * Math.cos(time * 0.5);
        pointLight.position.set(lightPos.x, lightPos.y, lightPos.z);
        pointLight.color.setHSL(controls.hue, controls.saturation, controls.lightness);

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        // render.clear();
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
