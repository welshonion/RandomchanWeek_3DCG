const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.z = 1000;
const controls = new THREE.OrbitControls(camera);

const planeWidth = 640;
const planeHeight = 480;

let textureWidth = 0;
for (let i = 1, l = planeWidth * planeHeight; ; i++) {
  const w = Math.pow(2.0, i);
  if (w * w > l) {
    textureWidth = w;
    break;
  }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const plane = new THREE.PlaneBufferGeometry(planeWidth, planeHeight);

let myUniforms = {
  textureLifeGame: {value: null},
  planeSize: {value: new THREE.Vector2(planeWidth, planeHeight)},
  textureSize: {value: new THREE.Vector2(textureWidth, textureWidth)},
  color1: {type: "v4", value: new THREE.Vector4(0, 0, 0.0, 0)},
  color2: {type: "v4", value: new THREE.Vector4(0, 1, 0, 0.2)},
  color3: {type: "v4", value: new THREE.Vector4(1, 1, 0, 0.21)},
  color4: {type: "v4", value: new THREE.Vector4(1, 0, 0, 0.4)},
  color5: {type: "v4", value: new THREE.Vector4(1, 1, 1, 0.6)}
};

const material = new THREE.ShaderMaterial({
  uniforms: myUniforms,
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent,
  side: THREE.DoubleSide
});

scene.add(new THREE.Mesh(plane, material));

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gpuCompute = new GPUComputationRenderer(textureWidth, textureWidth, renderer);
const textureLifeGame = gpuCompute.createTexture();
// sets initial state randomly
let div4 = textureLifeGame.image.data.length / 4;
console.log(div4);
for (let i = 0, l = textureLifeGame.image.data.length; i < l; i += 4) {
  
  textureLifeGame.image.data[i + 0] = 0.0;
  textureLifeGame.image.data[i + 1] = 0.0;
  if (i > div4 - 10 || i < div4 + 10) {
    textureLifeGame.image.data[i + 0] = Math.random() > 0.7 ? 1.0 : 0.0;
  }
  textureLifeGame.image.data[i + 2] = 0.0;
  textureLifeGame.image.data[i + 3] = 0.0;
}
const variableLifeGame = gpuCompute.addVariable("textureLifeGame", document.getElementById('shaderLifeGame').textContent, textureLifeGame);
gpuCompute.setVariableDependencies(variableLifeGame, [variableLifeGame]);
variableLifeGame.material.uniforms.planeSize = {value: new THREE.Vector2(planeWidth, planeHeight)};
const error = gpuCompute.init();
if (error !== null) {
  console.error(error);
}

animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  gpuCompute.compute();
  material.uniforms.textureLifeGame.value = gpuCompute.getCurrentRenderTarget(variableLifeGame).texture;
  renderer.render(scene, camera);
}
