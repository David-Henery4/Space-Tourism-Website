# Space Toursim Website

This is a solution to the [Space tourism website challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/space-tourism-multipage-website-gRWj1URZ3).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)

- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The Challenge

Users Can:

- View the optimal layout for each of the website's pages depending on their device's screen size
- See hover states for all interactive elements on the page
- View each page and be able to toggle between the tabs to see new information

### Screenshot

![Home Page for the Space Tourism Website](public/assets/screenshot/screenshot.png)

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 Markup
- CSS Custom Properties
- Flexbox
- CSS Grid
- Mobile-First Workflow
- Typescript - For Type Safety
- TailwindCSS - For Styles
- AstroJS Framework
- ThreeJS - Javascript 3D Animation Library

### What I learned

There was a lot of things I learn't along the way while building this project, from things that I hadn't used in a while and had to jog my memory on, to things that were completely new to me.

The main things I learn't that were new to me are:

- The Navigation API & the View Transition API
- AstroJS' Content Collections
- Working with ThreeJS & using 3D Models

Some concepts that I had used in the past but was a bit rusty with were:

- Vanilla Javascript DOM Manipulation
- Event Delegation

---

#### The Navigation API & the View Transition API

##### The View Transition API

The viewTransitionAPI is a native browser API that enables us to create different types of animations when switching between different pages on a website (Multi-page App) or animation between different DOM states (Single-page App). It's a very versatile and powerful API that can be used in both SPA Applications and multi-page Websites. We can also target specific elements on the page to only apply the transitions animations to, instead of applying to the whole page or even every page.

It works creating two different snapshots of page, the old & new, then transitions the old one out and replaces it with then new.

In this project I opted to only use it when transitioning between the different tab/slide states that are on the destination, crew & technology pages. I didn't use it when transitioning between the main pages themselves. This is the single-page way of using the API by switching between the different DOM states.

In order to do this you have to use the **startViewTransition** call back function in javascript to activate the view transition and you also have to assign a specific name in css using the **view-transition-name** property to the elements you want to animate, you can then add any styles you want to apply to those elements for when the view transition takes effect. In CSS you can also apply different animations for old or exiting elements/pages and the new or entering elements/pages by targeting the old or new snapshot of the pages or dom elements.

```js
document.startViewTransition(async () => {
  // ...Additional code
});
```

```css
#crew-info {
  view-transition-name: crew-info;
}
::view-transition-old(crew-info) {
  animation: fade-out-left 1.5s forwards;
}
::view-transition-new(crew-info) {
  animation: fade-in-right 1.5s forwards;
}
```

##### The Navigation API

The Navigation API is used as a way of managing and using different browser actions. It can be really powerful when used in Single-page apps, where we will have to handle the different types of navigation ourselves manually. It also helps us avoid using the HistoryAPI, which was the old way of doing this but really wasn't designed to handle the ways we need to control the navigation in a single-page application.
We use it be accessing the navigation instance and we can use this instance to access all the different types of navigation actions in one place.

In this project, I used it by listening for the navigate eventlistener attached to the navigation instance, which is fired when any type of navigation is initiated. I then used the callback function to manage the navigation and get it to do what I need it to do. The navigation event is automatically passed in as a prop into this callback function which we can then use.

The Navigation event allows us to access a method called **intercept()**. It lets us decide what happens when the navigation happens and what happens just before the navigation. I used this method to fetch the new content and render it for the new page, whenever someone navigates between the different tabs.

```ts
navigation.addEventListener("navigate", (e) => {
  if (!e.canIntercept) return;
  if (
    !isDestination(e.destination.url) &&
    !isCrew(e.destination.url) &&
    !isTechnology(e.destination.url)
  )
    return;

  const urlPathArray = new URL(e.destination.url).pathname
    .trim()
    .split("/")
    .filter(Boolean);

  const page = urlPathArray[0];
  const slug = urlPathArray[1];
  //
  e.intercept({
    async handler() {
      const response = await fetch(`/api/${page}/${slug}`);
      const data = await response.json();
      //
      document.startViewTransition(async () => {
        if (page === "destination") {
          updateDestinationContent(data);
        }
        if (page === "crew") {
          updateCrewContent(data);
        }
        if (page === "technology") {
          updateTechContent(data);
        }
      });
    },
  });
});
```

#### AstroJS' Content Collections

Astro Content Collections is a way of creating and managing content/data locally by using markdown files. It can be a handy way of handling content with the need of any external software or CMS.

In this project I used Content Collections to handle each of the different pages data and the data needed on their different tabs/slides.

We can use a method from Astro called **getCollection()** to fetch any collections data, from our markdown files, from anywhere within the project. I used it to fetch data that was needed in individual components, to get metadata that was needed for dynamic pages and when I needed to update the DOM with the new content in the tabs/slides pages.

The only thing with the **getCollection()** is that it can only be used server side and for my project, I needed to fetch the data on the client when updating the DOM for the tabs/slides. In order for me to fetch the data on the client I had to create an API endpoint in Astro and then use **getCollection()** in the API and send the resulting data back as the response from the API. I could then use this API to fetch the content collection data on the client when I needed it.

##### Heres an example of me using **getCollection()** in a component
```ts
  ---
import { getCollection } from "astro:content";
const crew = await getCollection("crewCollection");
const linksArray = crew
  .map((crewData) => {
    return {
      id: crewData.data.id,
      href: `/crew/${crewData.data.slug}`,
      slug: crewData.data.slug,
    };
  })
  .sort((a, b) => b.id - a.id);
---

< menu >
  {
    linksArray.map((item) => {
      return (
        < li >
          <a/>
        </li>
      );
    })
  }
</menu>
```

##### Heres an example of using it in an API endpoint
```ts
import type { APIRoute } from "astro";
import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

export const GET = (async ({ params, request }) => {
  const slug = params.slug;
  
  if (!slug) {
    return new Response(JSON.stringify({ error: "No slug provided" }), {
      status: 400,
    });
  }
  
  const destinations = await getCollection("destinationCollection");
  
  const destination = destinations.find((d) => d.data.slug === slug);
  
  if (!destination) {
    return new Response(JSON.stringify({ error: "Destination not found" }), {
      status: 404,
    });
  }
  
  const imageResult = await getImage({ src: destination.data.image });
  
  return new Response(
    JSON.stringify({
      ...destination.data,
      image: {
        src: imageResult.src,
        format: imageResult.options.format,
        width: imageResult.attributes.width,
        height: imageResult.attributes.height,
      },
    }),
  );
}) satisfies APIRoute;

export async function getStaticPaths() {
  const destinationInfo = await getCollection("destinationCollection");
  return destinationInfo.map((destination) => {
    return {
      params: { slug: destination.data.slug },
    };
  });
}
```

#### Working with ThreeJS & using 3D Models

In this project, I decided to use 3D models of the planets instead of the 2D images provided, as I thought this would bring the pages to life a bit more, be more interactive and generally be a better experience. I looked around and found the 3D Model assets I needed on the NASA website, which were free to use. You can find links to these in the references on the [bottom of this page.](#useful-resources)

Now I needed to load, render and create a rotate animation for the 3D model planets, this is where I decided to use ThreeJS. ThreeJS is a javascript 3D animation library which comes with different tools out of the box to render and load 3D Models in all sorts of different formats and impliment different animations. When reading the documentation it become clear that it is a vast library that can be used to create som many different animations, ranging from very simple to extremely complex, to the point that it can even be used for things like games. For this project I only needed a render and a very basic animation but reading and exploring the documentation has inspired me to come back to the library in the future, to want to learn more about it and create some interesting projects in the future.

To get started with rendering 3D models with ThreeJS you need to set up three things:

- Render
- Camera
- Scene

The scene is almost like the box/container our animation or 3D model lives inside, the camera is the users perspective of how were viewing the animation or 3D model and the render loads and displays the assests that are needed by using the canvas element in the HTML.

Each three things will need their own configurations and settings in order to come together and display the scene properly. It took a lot of playing around and some trial & error to get the 3D Models and the animation to work as it was my first experience with ThreeJS & 3D Models and I won't go into full depth about every function I used to get it working but here is the script I used for the 3D Models and their animations, also each function should have a description of what it is doing.

```ts
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
```

---

#### Vanilla Javascript DOM Manipulation & Event Delegation
Both of these concepts I had used in my projects before but I hadn't used them for a while and this project provided a good refresher for them. I used DOM manipulation to update the content from the content collections when switching between the tabs and I was going to use event delegation to help impliment it and update the content when clicking on a specific tab button but instead I choose not to use event delegation to handle the button click. 

Event delegation would have allowed me to place just one event listener on the container of the tabs and listen out for specific tab clicks without having an event listener for every individual tab, which would have affected performance.
Instead I opted to used the Navigation API, which allowed me to update the DOM everytime a navigation event was fired when switching to a new page.

---

### Continued Development

#### AstroJS

Going forward I will be using AstroJS a lot more in my projects, especially for static sites like this one. AstroJS allows me to start off slow and slowly build up complexity as and when I need it. It allows me to use different frameworks into it if I need to use them, it runs on the server side so is good for SEO & works well when working with high content driven websites. As it provides a way to render content from markdown files using AstroJS' built-in Content Collections, while also being able to seemingly work with most CMS.

These are just a small few benefits of using AstroJS and I look forward to discovering many more as I build more project with it in the future.

#### Navigation API & the viewTransition API

The Navigation & the viewTransition APIs are two browser native APIs I hadn't mush experience with before this project and I will most likely be using them a lot more in future projects.

### Useful Resources

- [AstroJS Docs](https://docs.astro.build/en/getting-started/)

- [AstroJS Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)

- [AstroJS API Endpoint Docs](https://docs.astro.build/en/guides/endpoints/)

- [MDN Docs - Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)

- [MDN Docs - ViewTransition API](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition)

- [Google Developers Docs - Navigation API](https://developer.chrome.com/docs/web-platform/navigation-api)

- [Web.dev Docs - Navigation API Blog](https://web.dev/blog/baseline-navigation-api)

- [Coding in Public | YouTube Video - ViewTransition API Video](https://www.youtube.com/watch?v=LAozCuoZXm0)

- [Syntax | YouTube Video - ViewTransition API Video](https://www.youtube.com/watch?v=jnYjIDKyKHw)

- [Kevin Powell | YouTube Video - ViewTransition API Video](https://www.youtube.com/watch?v=quvE1uu1f_I)

- [Gabriel Molter | YouTube Video - Adding a 3D model to a website using THREE.JS Video](https://www.youtube.com/watch?v=lGokKxJ8D2c)

- [NASA - 3D-Model Resources](https://science.nasa.gov/3d-resources/)
  - [Europa | NASA - 3D-Model Resource](https://science.nasa.gov/resource/europa-3d-model/)
  - [Mars | NASA - 3D-Model Resource](https://science.nasa.gov/resource/planet-mars-3d-model/)
  - [Moon | NASA - 3D-Model Resource](https://svs.gsfc.nasa.gov/14959/)
  - [Titan | NASA - 3D-Model Resource](https://science.nasa.gov/resource/titan-3d-model/)

- [ThreeJS](https://threejs.org/)
  - [ThreeJS Docs - Fundamentals](https://threejs.org/manual/#en/fundamentals)
  - [ThreeJS Docs - Loading a .GLTF File](https://threejs.org/manual/#en/load-gltf)
  - [ThreeJS Docs - Loading 3D Models](https://threejs.org/manual/#en/loading-3d-models)

- [Model View Component](https://modelviewer.dev/)
  - [Web.dev Article - The model-viewer web component](https://web.dev/articles/model-viewer)

## Author

- Portfolio - [www.djhwebdevelopment.com](https://www.djhwebdevelopment.com)
- Frontend Mentor - [@David-Henery4](https://www.frontendmentor.io/profile/David-Henery4)
- Github - [David-Henery4](https://github.com/David-Henery4)
- LinkedIn - [David Henery](https://www.linkedin.com/in/david-henery-725458241)
