window.addEventListener('load',ahoy);



function ahoy(){
    var btn = document.getElementById('btn');
 
 
    btn.addEventListener('click',init);


    function hello(){
        alert('Hello!');
    }
    
}

function init(){
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
    const controls = new THREE.OrbitControls(camera);

    controls.enableDamping = true;
    controls.dampingFactor=0.1;

    //Mesh
    const geometry = new THREE.SphereGeometry(300,30,30);
    const material = new THREE.MeshStandardMaterial({
        color:0x00FF00
    });
    const meshSphere = new THREE.Mesh(geometry,material);
    //scene.add(meshSphere);

    var mmdLoader = new THREE.MMDLoader();
    var mmdHelper = new THREE.MMDAnimationHelper();

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
    );

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

    mmdLoader.loadWithAnimation(
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
    )

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

    function tick(){
        mmdHelper.update(clock.getDelta());
        controls.update();

        meshSphere.rotation.y+=0.01;

        renderer.render(scene,camera);
        requestAnimationFrame(tick);
    }

    onResize();
    window.addEventListener('resize',onResize);

    function onResize(){
        width = window.innerWidth;
        height = window.innerHeight; 

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width,height);

        camera.aspect=width/height;
        camera.updateProjectionMatrix();
    }
}