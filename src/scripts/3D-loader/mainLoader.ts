import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const destinationImageContainer = document.getElementById(
  "destination-image-container",
) as HTMLDivElement;
// import { TrackballControls } from "three/addons/controls/TrackballControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  destinationImageContainer.clientWidth /
    destinationImageContainer.clientHeight,
  0.1,
  1000,
);

let object;
let controls;

const loader = new GLTFLoader();

let model: THREE.Group | null = null;

loader.load(
  "/assets/3D-Models/mars/24881_Mars_1_6792.gltf",
  function (gltf) {
    model = gltf.scene;

    // Tilt the model 90 degrees on the X axis once on load
    // model.rotation.x = Math.PI / 5;

    model.rotation.z = THREE.MathUtils.degToRad(23.5);

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

destinationImageContainer.appendChild(renderer.domElement);

camera.position.z = 1100;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// controls = new OrbitControls(camera, renderer.domElement);
// controls = new TrackballControls(camera, renderer.domElement);

function resizeRendererToDisplaySize(
  rendererItem: THREE.WebGLRenderer,
  maxPixelCount = 3840 * 2160,
) {
  const canvas = rendererItem.domElement;
  const pixelRatio = window.devicePixelRatio;
  let width = Math.floor(canvas.clientWidth * pixelRatio);
  let height = Math.floor(canvas.clientHeight * pixelRatio);
  const pixelCount = width * height;
  const renderScale =
    pixelCount > maxPixelCount ? Math.sqrt(maxPixelCount / pixelCount) : 1;
  width = Math.floor(width * renderScale);
  height = Math.floor(height * renderScale);

  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    rendererItem.setSize(width, height, false);
  }
  return needResize;
}

function animate() {
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // Steady rotation on Y axis — runs every frame
  if (model) {
    model.rotation.y += 0.002; // adjust speed here
  }

  renderer.render(scene, camera);
}

animate();

// Previous attempt

// renderer.setSize(window.innerWidth, window.innerHeight);
// // renderer.setAnimationLoop(animate);
// destinationImageContainer.appendChild(renderer.domElement);

// // const geometry = new THREE.BoxGeometry(1, 1, 1);
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// // const cube = new THREE.Mesh(geometry, material);
// // scene.add(cube);

// camera.position.z = 5;
// // camera.position.set(-1.8, 0.6, 2.7);

// // function animate(time= 1000) {
// //   cube.rotation.x = time / 2000;
// //   cube.rotation.y = time / 1000;
// // renderer.render(scene, camera);
// // }

// // const controls = new OrbitControls(camera, renderer.domElement);
// const loader = new GLTFLoader();

// loader.load(
//   "/assets/3D-Models/mars/24881_Mars_1_6792.gltf",
//   function (gltf) {
//     console.log("Called");
//     scene.add(gltf.scene);
//     // renderer.render(scene, camera);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   },
// );

// renderer.render(scene, camera);
