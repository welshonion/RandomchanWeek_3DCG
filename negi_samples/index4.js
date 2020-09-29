import { OrbitControls } from "./libs/examples/jsm/controls/OrbitControls.js";
import { MMDLoader } from "./libs/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "./libs/examples/jsm/animation/MMDAnimationHelper.js";

window.addEventListener('load',init);


function init(){
    const loadBtn = document.getElementById('loadBtn');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const unpauseBtn = document.getElementById('unpauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    loadBtn.addEventListener('click',load);
    playBtn.addEventListener('click',play);
    pauseBtn.addEventListener('click',pause);
    unpauseBtn.addEventListener('click',unpause);
    stopBtn.addEventListener('click',stop);

    
    let btnbtn;



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

    

    const modelPath = 'kizunaai/kizunaai.pmx';
    const motionPath = 'Addiction/[A]ddiction_モーション/[A]ddiction_Lat式.vmd';
    const audioPath = 'Addiction/addiction.wav';
    //const motionPath = 'shin/shin.vmd';
    //const audioPath = 'shin/shin.wav';
    const cameraPath = 'Addiction/camera.vmd';

    let mmdLoader = new MMDLoader();
    let mmdHelper = new MMDAnimationHelper();

    

    let mesh;
    let vmd;
    let mixer;

    let cameravmd;

    

    let listener = new THREE.AudioListener();
    camera.add(listener);

    let sound = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();







    //Light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1,1,1);
    scene.add(directionalLight);

    document.addEventListener('moucemove',event=>{
        mouseX=event.pageX;
    })

    tick();

    //onResize();

    //window.addEventListener('resize',onResize);

    function load(){
        loadModel(modelPath,motionPath);
        loadAudio(audioPath);
    }

    function loadModel(inputModelPath,inputMotionPath){
        mmdLoader.load(
            inputModelPath,
            function(object) {
                mesh = object;
                mesh.position.set(0, 0, 0);
                mesh.rotation.set(0, 0, 0);
                scene.add(mesh);
                console.log(inputModelPath+' is loaded');

                mmdLoader.loadAnimation(
                    inputMotionPath,
                    mesh,
                    function(outvmd) {
                        vmd=outvmd;
                        mmdLoader.loadAnimation(
                            cameraPath,
                            camera,
                            function(ss) {
                                cameravmd=ss;
                                btnbtn=document.createElement('button');
                                btnbtn.innerText = "PPPPP";
                                document.body.appendChild(btnbtn);
                                btnbtn.addEventListener('click',play);
                                
                    
                            },
                            onProgress,
                            onError
                        )
            
                    },
                    onProgress,
                    onError
                )
            },
            onProgress,
            onError
        )
    }

    function loadAudio(inputAudioPath){
        
        audioLoader.load(
            inputAudioPath,
            function ( buffer ) {

                console.log(buffer);
                sound.setBuffer(buffer);
                sound.setLoop(true);


                listener.position.z = 1;


                sound.setVolume(0.5);
            },
            onProgress,
            onError
        );
    }

    function changeVolume(){

    }

    function play(){
        mmdHelper.add(mesh,{
            animation:vmd,
            physics:true
        });
        mmdHelper.add(sound);
        mmdHelper.add(camera,{
            animation:cameravmd,
            physics:true
        });
        //sound.play();
    }

    function stop(){
        mixer = mmdHelper.objects.get( mesh ).mixer;
        console.log(mesh);
        console.log(mmdHelper.objects.get( mesh ));
        
        let clip = mesh.geometry.animations;
        console.log(mesh.geometry);
        console.log(clip);
        //let mixer = mmdHelper.objects.get( mesh ).mixer;
        let action = mixer.clipAction(clip);
        //mixer = new THREE.AnimationMixer(mesh);
        //mixer.stopAllAction();
        action.stop();
    }

    function pause(){
        mixer = mmdHelper.objects.get( mesh ).mixer;
        mixer.stopAllAction();
        //mmdHelper.remove(mesh);
        //sound.pause();
    }

    function unpause(){
        sound.play();
    }

    function tick(){
        mmdHelper.update(clock.getDelta());
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

}