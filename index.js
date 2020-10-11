import { OrbitControls } from "./libs/examples/jsm/controls/OrbitControls.js";
import { MMDLoader } from "./libs/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "./libs/examples/jsm/animation/MMDAnimationHelper.js";
import { FBXLoader } from "./libs/examples/jsm/loaders/FBXLoader.js";

// atsu
import { backscreen } from "./Utils/objects/backscreen.js";
import { importFBX } from "./Utils/objects/model_import.js";
import { tweet_panel } from "./Utils/tweet/tweet_panel.js";
import { EffectComposer } from "./libs/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./libs/examples/jsm/postprocessing/RenderPass.js";
import { BloomPass } from "./libs/examples/jsm/postprocessing/BloomPass.js";
import { GlitchPass } from "./libs/examples/jsm/postprocessing/GlitchPass.js";
import { CopyShader } from "./libs/examples/jsm/shaders/CopyShader.js";
import { ShaderPass } from "./libs/examples/jsm/postprocessing/ShaderPass.js";

// watayo
import { metaball } from "./Utils/objects/metaball.js";

window.addEventListener('load', init);


function init() {
    /*const loadBtn = document.getElementById('loadBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const unpauseBtn = document.getElementById('unpauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    loadBtn.addEventListener('click', load);
    pauseBtn.addEventListener('click', pause);
    unpauseBtn.addEventListener('click', unpause);
    stopBtn.addEventListener('click', stop);*/

    let playBtn;

    let width = 920;
    let height = 540;
    var clock = new THREE.Clock();

    //Scene
    const scene = new THREE.Scene();

    //Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 30, +100);
    const orbit_cam = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    orbit_cam.position.set(0, 30, +100);

    //Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

	//PostProcess
	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, orbit_cam);
	const bloomPass = new BloomPass(1.4, 20, 0.5, 512);
	const glitchPass = new GlitchPass(32);
	const shaderPass = new ShaderPass(CopyShader);
	shaderPass.renderToScreen = true;
	composer.addPass(renderPass);
	composer.addPass(bloomPass);
	composer.addPass(glitchPass);
	composer.addPass(shaderPass);

    //Control
    const controls = new OrbitControls(orbit_cam, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    //Mesh
    const geometry = new THREE.SphereGeometry(300, 30, 30);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00FF00
    });
    const meshSphere = new THREE.Mesh(geometry, material);
    //scene.add(meshSphere);


    const stagePath = 'stage.fbx';
    //const modelPath = 'kizunaai/kizunaai.pmx';
    const modelPath = 'randomchan82/random-chan82.pmx';
    const motionPath = 'Addiction/[A]ddiction_Lat式.vmd';
    const audioPath = 'Addiction/addiction.wav';
    //const motionPath = 'shin/shin.vmd';
    //const audioPath = 'shin/shin.wav';
    const cameraMotionPath = 'Addiction/camera.vmd';

    let mmdLoader = new MMDLoader();
    let mmdHelper = new MMDAnimationHelper();

    let fbxLoader = new FBXLoader();

    let randomchanMesh;
    let randomchanMotion;
    let cameraMotion;

    let mixer;

    //Sound
    let listener = new THREE.AudioListener();
    camera.add(listener);

    let sound = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();

    let pauseBool = new Boolean(false);


    //Light
    const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 0.6);
    directionalLight1.position.set(1, 1, -4);
    scene.add(directionalLight1);
    const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
    directionalLight2.position.set(2, 1, 3);
    scene.add(directionalLight2);

	/*
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
    scene.add(ambientLight);
	*/


    document.addEventListener('moucemove', event => {
        mouseX = event.pageX;
    })

    load();

    tick();

    //onResize();

    //window.addEventListener('resize',onResize);

    function load() {
        /***** ステージロード *****/
        fbxLoader.load(
            stagePath,
            function (object) {
				object.scale.set(0.08, 0.08, 0.08);
                scene.add(object);
            },
            onProgress,
            onError
        );


        /*****らんだむちゃんロード*****/
        mmdLoader.load(
            modelPath,
            function (object) {
                console.log(modelPath + ' is loaded');
                randomchanMesh = object;
                randomchanMesh.position.set(0, 0, 0);
                randomchanMesh.rotation.set(0, 0, 0);
                scene.add(randomchanMesh);

                /*****アニメーションのロード*****/
                mmdLoader.loadAnimation(
                    motionPath,
                    randomchanMesh,
                    function (_outRandonchanMotion) {
                        console.log(motionPath + ' is loaded');
                        randomchanMotion = _outRandonchanMotion;

                        /*****音楽のロード*****/
                        audioLoader.load(
                            audioPath,
                            function (buffer) {
                                console.log(audioPath + ' is loaded');
                                sound.setBuffer(buffer);
                                sound.setLoop(true);
                                listener.position.z = 1;
                                sound.setVolume(0.1);

                                /*****option:カメラモーションのロード*****/
                                mmdLoader.loadAnimation(
                                    cameraMotionPath,
                                    camera,
                                    function (_outCameraMotion) {
                                        console.log(cameraMotionPath + ' is loaded');
                                        cameraMotion = _outCameraMotion;

                                        //Playボタンの設置
                                        playBtn = document.createElement('button');
                                        playBtn.innerText = "Play";
                                        document.body.appendChild(playBtn);
                                        playBtn.addEventListener('click', play);

                                    },
                                    onProgress,
                                    onError
                                );
                            },
                            onProgress,
                            onError
                        );
                    },
                    onProgress,
                    onError
                );
            },
            onProgress,
            onError
        );
    }

    function play() {
        mmdHelper.add(randomchanMesh, {
            animation: randomchanMotion,
            physics: true
        });
        mmdHelper.add(sound);
        mmdHelper.add(camera, {
            animation: cameraMotion,
            physics: true
        });
    }

    function stop() {
        //mixer = mmdHelper.objects.get( randomchanMesh ).mixer;
        //mixer.stopAllAction();
        /*mixer = mmdHelper.objects.get( mesh ).mixer;
        console.log(mesh);
        console.log(mmdHelper.objects.get( mesh ));

        let clip = mesh.geometry.animations;
        console.log(mesh.geometry);
        console.log(clip);
        //let mixer = mmdHelper.objects.get( mesh ).mixer;
        let action = mixer.clipAction(clip);
        //mixer = new THREE.AnimationMixer(mesh);
        //mixer.stopAllAction();
        action.stop();*/
    }

    function pause() {
        //pauseBool=true;
        //sound.pause();
    }

    function unpause() {
        //pauseBool=false;
        //sound.unpause();
    }

    function tick() {
        if (pauseBool == false) {
            mmdHelper.update(clock.getDelta());
        }
        //controls.update();

        meshSphere.rotation.y += 0.01;

        composer.render();
        requestAnimationFrame(tick);
    }

    function onResize() {
        width = window.innerWidth;
        height = width * 9 / 16;

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    function onProgress(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '%loaded');
    };

    function onError(error) {
        console.log('An error happened');
    };


	// atsu
	//// バックスクリーン
	function add_screen(){
		const screen = backscreen(920, 540, 0.11, scene, camera);
		screen.position.set(0.0, 28, -100.0);
		screen.lookAt(0.0, screen.position.y, 0.0);
		scene.add(screen);
	}
    add_screen();

	//// オブジェクト
	const crt = "./atsu_samples/models/Parts/brawn_kan.fbx";
	const display = "./atsu_samples/models/Parts/display.fbx";
	const PC = "./atsu_samples/models/Parts/PC_1.fbx";
	const crtobj = importFBX(crt, new THREE.Vector3(130.0, -4.0, 50.0), new THREE.Vector3(0.0, 40.0, 270.0), new THREE.Vector3(0.05, 0.05, 0.05), 2.2, scene);
	const displayobj = importFBX(display, new THREE.Vector3(0.0, 70.0, 132.0), new THREE.Vector3(20.0, 0.0, 0.0), new THREE.Vector3(0.05, 0.05, 0.05), 1.2, scene);
	const PCobj = importFBX(PC, new THREE.Vector3(61.0, 16.0, 140.0), new THREE.Vector3(0.0, 70.0, 20.0), new THREE.Vector3(0.05, 0.05, 0.05), 1.7, scene);

	//// ツイート表示
	function add_tweet(){
		const twe_panel = tweet_panel(0.1);
		twe_panel.position.set(70.0, 28, -50.0);
		twe_panel.lookAt(0.0, twe_panel.position.y, 0.0);
		scene.add(twe_panel);
	}
    add_tweet();
    
    // watayo
    let time = new THREE.Clock().elapsedTime;
    metaball(scene, camera, 0, 30, -30);

}
