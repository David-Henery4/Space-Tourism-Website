import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const destinationImageContainer = document.getElementById(
  "destination-image-container",
);

let camera: THREE.PerspectiveCamera;
let currentPageSlug: string | undefined;
let model: THREE.Object3D | null = null;
const renderer = new THREE.WebGLRenderer({ alpha: true });
const scene = new THREE.Scene();
const loader = new GLTFLoader();

if (destinationImageContainer) {
  camera = new THREE.PerspectiveCamera(
    75,
    destinationImageContainer.clientWidth /
      destinationImageContainer.clientHeight,
    0.1,
    1000,
  );
  currentPageSlug = destinationImageContainer.dataset.slug;
  camera.position.z = 1000;
  destinationImageContainer.appendChild(renderer.domElement);

  // Ensure renderer matches the container size and camera aspect before first render
  resizeRendererToDisplaySize(renderer);
  camera.aspect =
    renderer.domElement.clientWidth / renderer.domElement.clientHeight;
  camera.updateProjectionMatrix();

  animate();
}

/**
 * Extracts the root scene object from a loaded GLTF object.
 * GLTF files can have their scene data stored in different properties depending on the export tool used.
 * This function prioritizes gltf.scene if it contains children, otherwise falls back to the first scene in gltf.scenes array.
 * This ensures compatibility with various GLTF exporters and prevents models from failing to load due to structural differences.
 * @param gltf The loaded GLTF object from the GLTFLoader.
 * @returns The root THREE.Object3D scene or null if no valid scene is found.
 */
function getModelFromGltf(gltf: any): THREE.Object3D | null {
  if (gltf.scene && gltf.scene.children.length > 0) {
    return gltf.scene;
  }
  if (Array.isArray(gltf.scenes) && gltf.scenes.length > 0) {
    return gltf.scenes[0];
  }
  return gltf.scene || null;
}

/**
 * Normalizes the scale, position, and materials of a 3D model to ensure consistent rendering.
 * This function scales the model so its largest dimension fits within a target size (980 units),
 * centers it at the origin for proper rotation, and sets all mesh materials to double-sided rendering.
 * This prevents issues where models of varying sizes or orientations appear incorrectly or invisibly,
 * ensuring all loaded GLTF models display uniformly in the scene regardless of their original export settings.
 * @param modelObject The THREE.Object3D model to normalize.
 */
function normalizeModel(modelObject: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(modelObject);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0) {
    const scale = 980 / maxDim;
    modelObject.scale.setScalar(scale);
  }

  const center = box.getCenter(new THREE.Vector3());
  modelObject.position.sub(center);

  modelObject.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const material = (child as THREE.Mesh).material;
      if (Array.isArray(material)) {
        material.forEach((mat) => {
          if (mat && "side" in mat) {
            mat.side = THREE.DoubleSide;
          }
        });
      } else if (material && "side" in material) {
        material.side = THREE.DoubleSide;
      }
    }
  });
}

export function loadDestinationModel(slug: string) {
  const modelPath = slug
    ? `/assets/3D-Models/${slug}/${slug}.glb`
    : "/assets/3D-Models/moon/moon.glb";
  loader.load(
    modelPath,
    function (gltf) {
      const loadedModel = getModelFromGltf(gltf);
      if (!loadedModel) {
        console.error("GLTF loaded but no scene found:", gltf);
        return;
      }
      model?.clear();
      model = loadedModel;
      normalizeModel(model);

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
}

/**
 * Resizes the WebGL renderer to match the display size while respecting a maximum pixel count limit.
 * This function calculates the optimal canvas size based on device pixel ratio and container dimensions,
 * then scales it down if the total pixel count exceeds the specified maximum to prevent performance issues.
 * This ensures smooth rendering on high-DPI displays and large screens without overwhelming the GPU,
 * maintaining a balance between visual quality and performance.
 * @param rendererItem The THREE.WebGLRenderer instance to resize.
 * @param maxPixelCount The maximum allowed pixel count (default 3840 * 2160 for 4K).
 * @returns True if the renderer was resized, false otherwise.
 */
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

export function animate() {
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

if (currentPageSlug) {
  loadDestinationModel(currentPageSlug);
}

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);
