//import { AnimationMixer } from "./libs/src/animation/AnimationMixer";


import { OrbitControls } from "./libs/examples/jsm/controls/OrbitControls.js";
import { MMDLoader } from "./libs/examples/jsm/loaders/MMDLoader.js";
import { MMDAnimationHelper } from "./libs/examples/jsm/animation/MMDAnimationHelper.js";
//import { Ammo } from "./libs/builds/ammo.js";
//import {Ammo} from "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r103/examples/js/libs/ammo.js";
//import * as  Ammo from "./libs/examples/jsm/libs/";

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

    let mmdLoader = new MMDLoader();
    let mmdHelper = new MMDAnimationHelper();

    

    let mesh;
    let vmd;
    let mixer;

    

    let listener = new THREE.AudioListener();
    camera.add(listener);

    let sound = new THREE.Audio(listener);
    let audioLoader = new THREE.AudioLoader();


    /*mmdLoader.load(
        'kizunaai/kizunaai.pmx',
        function(object) {
            mesh = object;
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            scene.add(mesh);
        },
        function(xhr){
            console.log((xhr.loaded/xhr.total*100)+'%loaded');
        },
        function(error){
            console.log('An error happened');
        }
    );/*

    mmdLoader.loadAnimation(
        'Addiction/[A]ddiction_モーション/[A]ddiction_Lat式.vmd',
        mesh,
        function(object) {
            console.log('success!');
        },
        function(xhr){
            console.log((xhr.loaded/xhr.total*100)+'%loaded');
        },
        function(error){
            console.log('An error happened');
        }
    )*/

    /*mmdLoader.loadWithAnimation(
        'kizunaai/kizunaai.pmx',
        'Addiction/[A]ddiction_モーション/[A]ddiction_Lat式.vmd',
        function(mmd){
            mmdHelper.add(mmd.mesh,{
                animation:mmd.animation,
                physics:true
            });
            scene.add(mmd.mesh);

            var listener = new THREE.AudioListener();
            camera.add(listener);

            var sound = new THREE.Audio(listener);

            var audioLoader = new THREE.AudioLoader();

            audioLoader.load(
                'Addiction/addiction.wav',
                function ( buffer ) {

                    sound.setBuffer(buffer);
                    sound.setLoop(true);
                    sound.setVolume(0.5);
                    sound.play();
    
    
                    listener.position.z = 1;
    
                }
    
            );
        },
        function(xhr){
            console.log((xhr.loaded/xhr.total*100)+'%loaded');
        },
        function(error){
            console.log('An error happened');
        }
    )*/

    //Light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1,1,1);
    scene.add(directionalLight);

    document.addEventListener('moucemove',event=>{
        mouseX=event.pageX;
    })

    function aho(){
        console.log('An error happened');
    }

    tick();

    onResize();

    window.addEventListener('resize',onResize);

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
                //mmdHelper.add(mesh);
                console.log(inputModelPath+' is loaded');

                /*mmdLoader.loadVMD(
                    inputMotionPath,
                    function(vmd){
                        mmdLoader.createAnimation(mesh,vmd,
                            )
                    }
                )*/
                /*mmdLoader.loadVMD(
                    inputMotionPath,
                    function(outvmd){
                        vmd = outvmd;
                        mmdHelper.add(mesh,{
                            animation:vmd,
                            physics:true
                        });
                        //mmdHelper.add(mesh);
                        //mmdLoader.animationBuilder.build(vmd,mesh);
                        //mmdHelper.enable('animation',vmd);
                        //mmdHelper.enable('physics',true);
                        //mmdHelper.setAnimation(mesh);
                        //mmdHelper.setPhysics(mesh);

                    }
                )*/


                mmdLoader.loadAnimation(
                    inputMotionPath,
                    mesh,
                    function(outvmd) {
                        vmd=outvmd;
                        /*mmdHelper.setAnimation(object);

                        let clip = mesh.geometry.animation;

                        mmdHelper.setPhysics(object);
                        sound.play();
                        console.log('success!');*/

                        //mmdHelper.enabled[animation] = vmd;
                        //mmdHelper.enabled[physics] = true;
                        //mmdHelper.enable(physics,true);

                        

                        /*mmdHelper.add(mesh,{
                            animation:vmd,
                            physics:true
                        });*/
                        //scene.add(mmd.mesh);
            
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
        sound.play();
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
        mmdHelper.remove(mesh);
        sound.pause();
    }

    function unpause(){
        sound.play();
    }

    function tick(){
        mmdHelper.update(clock.getDelta());
        controls.update();

        meshSphere.rotation.y+=0.01;

        renderer.render(scene,camera);
        requestAnimationFrame(tick);
    }

    function onResize(){
        width = window.innerWidth;
        height = window.innerHeight; 

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