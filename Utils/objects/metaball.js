import { basicVert, basicFrag, lineFrag, glitchFrag } from '../myLibs/shaders/shader.js';
// import "../myLibs/MarchingCubes.js";

let renderer;
let marchingCubes;
let time = 0.0;

export function metaball(scene, camera) {
    // init stats
    // let stats = initStats();

    const canvas = document.createElement('canvas');

    // renderer カメラオブジェクトからシーンがどのように見えるのか計算する.
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
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
    uniform.resolution.value.x = window.innerWidth;
    uniform.resolution.value.y = window.innerHeight;
    uniform.dirLightPos.value = light.position;
    uniform.dirLightColor.value = light.color;
    uniform.pointLightPos.value = pointLight.position;
    uniform.pointLightColor.value = pointLight.color;

    let material = new THREE.ShaderMaterial({
        uniforms: uniform,
        vertexShader: basicVert,
        fragmentShader: glitchFrag,
    });

    const resolution = 48;
    marchingCubes = new THREE.MarchingCubes(resolution, material, true, true);
    marchingCubes.position.set(0, 30, -30);
    marchingCubes.scale.set(15, 15, 15);

    scene.add(marchingCubes);

    // update metaball
    function updateCubes(marchingCubes, time) {
        // reset metaball
        marchingCubes.reset();

        let subtract = 18;
        let strength = 0.5;

        let ballx, bally, ballz;

        for (let i = 0; i < 20; i++) {
            ballx = Math.cos(i + time * Math.cos(1.22 + 0.1424 * i)) * 0.3 * Math.sin(time * 0.2) + 0.5;
            bally = Math.sin(i + time * Math.cos(1.22 + 0.1424 * i)) * 0.3 * Math.sin(time * 1.3)+ 0.5;
            ballz = Math.cos(i + time * Math.cos(1.22 + 0.1424 * i)) * Math.sin(i + time * Math.cos(1.22 + 0.1424 * i)) * 0.3 * Math.abs(Math.sin(time)) + 0.5;
            // debug
            // ballx = 0.5;
            // bally = 0.5;
            // ballz = 0.5;
            marchingCubes.addBall(ballx, bally, ballz, strength, subtract);
        }   
    }

    
    let clock = new THREE.Clock();

    // call the render function
    Update();

    // render function
    function Update() {
        // stats.update();
        //sphere.rotation.y=step+=0.01;
        let delta = clock.getDelta();

        time = clock.elapsedTime;

        uniform.time.value += delta;
        updateCubes(marchingCubes, time);

        lightPos.x = 20 * Math.cos(time);
        lightPos.y = 20 * Math.sin(time * 0.4);
        lightPos.z = 20 * Math.cos(time * 0.5);

        // render using requestAnimationFrame
        requestAnimationFrame(Update);
        renderer.render(scene, camera);
        // render.clear();
    }
}
