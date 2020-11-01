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

    // sphere set
    let sphere = createMesh(new THREE.SphereGeometry(10, 40, 40));
    scene.add(sphere);

    // camera setting
    camera.position.x = -10;
    camera.position.y = 15;
    camera.position.z = 25;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // orbitControll
    let orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = false;
    let clock = new THREE.Clock();

    let ambi = new THREE.AmbientLight(0x181818);
    scene.add(ambi);

    let spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(550, 100, 550);
    spotLight.intensity = 0.6;
    scene.add(spotLight);

    // add dom
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    let renderPass = new THREE.RenderPass(scene, camera);
    let effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
    effectFilm.renderToScreen = true;

    var composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectFilm);

    let controls = new function () {
        this.scanlinesCount = 256;
        this.grayscale = false;
        this.scanlinesIntensity = 0.3;
        this.noiseIntensity = 0.8;

        this.updateEffectFilm = function () {
            effectFilm.uniforms.grayscale.value = controls.grayscale;
            effectFilm.uniforms.nIntensity.value = controls.noiseIntensity;
            effectFilm.uniforms.sIntensity.value = controls.scanlinesIntensity;
            effectFilm.uniforms.sCount.value = controls.scanlinesCount;
        };
    };

    let gui = new dat.GUI();
    gui.add(controls, "scanlinesIntensity", 0, 1).onChange(controls.updateEffectFilm);
    gui.add(controls, "noiseIntensity", 0, 3).onChange(controls.updateEffectFilm);
    gui.add(controls, "grayscale").onChange(controls.updateEffectFilm);
    gui.add(controls, "scanlinesCount", 0, 2048).step(1).onChange(controls.updateEffectFilm);

    // call the render function
    render();

    function createMesh(geom) {
        let textureLoader = new THREE.TextureLoader();
        let planetTexture = textureLoader.load("../assets/textures/planets/Earth.png");
        let specularTexture = textureLoader.load("../assets/textures/planets/EarthSpec.png");
        let normalTexture = textureLoader.load("../assets/textures/planets/EarthNormal.png");


        let planetMaterial = new THREE.MeshPhongMaterial();
        planetMaterial.specularMap = specularTexture;
        planetMaterial.specular = new THREE.Color(0x4444aa);


        planetMaterial.normalMap = normalTexture;
        planetMaterial.map = planetTexture;
//               planetMaterial.shininess = 150;


        // create a multimaterial
        let mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [planetMaterial]);

        return mesh;
    }

    // render function
    function render() {
        stats.update();
        //sphere.rotation.y=step+=0.01;
        let delta = clock.getDelta();
        orbitControls.update(delta);

        sphere.rotation.y += 0.002;

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
