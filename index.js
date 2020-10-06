import { OrbitControls } from "./libs/examples/jsm/controls/OrbitControls.js";
import { MMDLoader } from "./libs/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "./libs/examples/jsm/animation/MMDAnimationHelper.js";
import { FBXLoader } from "./libs/examples/jsm/loaders/FBXLoader.js";

// atsu
import { backscreen } from "./Utils/objects/backscreen.js";

// watayo
import { metaball } from "./Utils/objects/metaball.js";

window.addEventListener('load',init);


function init(){
    const loadBtn = document.getElementById('loadBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const unpauseBtn = document.getElementById('unpauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    loadBtn.addEventListener('click',load);
    pauseBtn.addEventListener('click',pause);
    unpauseBtn.addEventListener('click',unpause);
    stopBtn.addEventListener('click',stop);

    let playBtn;

    let width = 920;
    let height = 540;
    var clock = new THREE.Clock();
    
    //Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas:document.querySelector('#myCanvas')
    });
    renderer.setSize(width,height);
    renderer.setPixelRatio(window.devicePixelRatio);

    //Scene
    const scene = new THREE.Scene();

    //Camera
    const camera = new THREE.PerspectiveCamera(45,width/height,1,10000);
    camera.position.set(0,30,+100);

    //Control
    const controls = new OrbitControls(camera,renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor=0.1;

    //Mesh
    const geometry = new THREE.SphereGeometry(300,30,30);
    const material = new THREE.MeshStandardMaterial({
        color:0x00FF00
    });
    const meshSphere = new THREE.Mesh(geometry,material);
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
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1,1,1);
    //scene.add(directionalLight);

    const ambientLight = new THREE.DirectionalLight(0xFFFFFF);
    ambientLight.position.set(1,1,100);
    scene.add(ambientLight);

    document.addEventListener('moucemove',event=>{
        mouseX=event.pageX;
    })

    tick();

    //onResize();

    //window.addEventListener('resize',onResize);

    function load(){
        /***** ステージロード *****/
        fbxLoader.load(
            stagePath,
            function(object){
                scene.add(object);
            },
            onProgress,
            onError
        );
        

        /*****らんだむちゃんロード*****/
        mmdLoader.load(
            modelPath,
            function(object) {
                console.log(modelPath+' is loaded');
                randomchanMesh = object;
                randomchanMesh.position.set(0, 0, 0);
                randomchanMesh.rotation.set(0, 0, 0);
                scene.add(randomchanMesh);

                /*****アニメーションのロード*****/
                mmdLoader.loadAnimation(
                    motionPath,
                    randomchanMesh,
                    function(_outRandonchanMotion) {
                        console.log(motionPath+' is loaded');
                        randomchanMotion=_outRandonchanMotion;

                        /*****音楽のロード*****/
                        audioLoader.load(
                            audioPath,
                            function ( buffer ) {
                                console.log(audioPath+' is loaded');
                                sound.setBuffer(buffer);
                                sound.setLoop(true);
                                listener.position.z = 1;
                                sound.setVolume(0.5);

                                /*****option:カメラモーションのロード*****/
                                mmdLoader.loadAnimation(
                                    cameraMotionPath,
                                    camera,
                                    function(_outCameraMotion) {
                                        console.log(cameraMotionPath+' is loaded');
                                        cameraMotion=_outCameraMotion;

                                        //Playボタンの設置
                                        playBtn=document.createElement('button');
                                        playBtn.innerText = "Play";
                                        document.body.appendChild(playBtn);
                                        playBtn.addEventListener('click',play);
                                        
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

    function play(){
        mmdHelper.add(randomchanMesh,{
            animation:randomchanMotion,
            physics:true
        });
        mmdHelper.add(sound);
        mmdHelper.add(camera,{
            animation:cameraMotion,
            physics:true
        });
    }

    function stop(){
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

    function pause(){
        //pauseBool=true;
        //sound.pause();
    }

    function unpause(){
        //pauseBool=false;
        //sound.unpause();
    }

    function tick(){
        if(pauseBool==false){
            mmdHelper.update(clock.getDelta());
        }
        //controls.update();

        meshSphere.rotation.y+=0.01;

        renderer.render(scene,camera);
        requestAnimationFrame(tick);
    }

    function onResize(){
        width = window.innerWidth;
        height = width*9/16; 

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width,height);

        camera.aspect=width/height;
        camera.updateProjectionMatrix();
    }

    function onProgress( xhr ) {
        console.log((xhr.loaded/xhr.total*100)+'%loaded');
    };

    function onError( error ){
        console.log('An error happened');
    };


	// atsu
	function add_screen(){
		const screen = backscreen(920, 540, 0.7, scene, camera);
		screen.position.set(0.0, 70, -200.0);
		screen.lookAt(0.0, screen.position.y, 0.0);
		scene.add(screen);
	}
    add_screen();
    
    // watayo
    metaball(scene, camera);

}
