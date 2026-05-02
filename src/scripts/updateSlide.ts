// Remember to handle the error responses for the above API calls.

// Three ways I want to try and use to solve this problem

// 1) Pure CSS No javascript (MPS)
// 2) Mix of both - Use Javascript to only target the tabs for transition and have the page update when switching pages.
// 3) Only Javascript to trigger the transitions, Ignore/Cancel the full page refresh & update the URL and the DOM.

function isDestination(url: string) {
  return url.includes("/destination/");
}
function isCrew(url: string) {
  return url.includes("/crew/");
}
function isTechnology(url: string) {
  return url.includes("/technology/");
}

type DestinationData = {
  description: string;
  distance: string;
  id: number;
  image: { src: string; format: string; width: number; height: number };
  name: string;
  slug: string;
  travelTime: string;
};

function handleDestinationContentTransitions(data: DestinationData) {
  const getElement = (id: string) => document.getElementById(id);

  const elements = {
    title: getElement("destination-title"),
    description: getElement("destination-description"),
    distance: getElement("destination-distance"),
    travelTime: getElement("destination-travel-time"),
    image: getElement("destination-image"),
    tabContainer: getElement("destination-tabs"),
  };

  // Validate all elements exist
  if (!Object.values(elements).every(Boolean)) return;

  // Update text content
  elements.title!.innerHTML = data.name;
  elements.description!.innerHTML = data.description;
  elements.distance!.innerHTML = data.distance;
  elements.travelTime!.innerHTML = data.travelTime;

  // Update image attributes
  const imageElement = elements.image as HTMLImageElement;
  Object.assign(imageElement, {
    src: data.image.src,
    width: data.image.width,
    height: data.image.height,
  });
  imageElement.setAttribute("format", data.image.format);

  // Update Tabs styles
  elements.tabContainer
    ?.querySelectorAll("div")
    ?.forEach((tabUnderlineElement) => {
      const tabSlug = tabUnderlineElement.dataset.slug;
      if (!tabSlug) return;
      if (tabSlug === data.slug) {
        // Because of Tailwind behaviour, Might have to change.
        tabUnderlineElement.classList.add("block");
        tabUnderlineElement.classList.remove("hidden");
      } else {
        tabUnderlineElement.classList.add("hidden");
        tabUnderlineElement.classList.remove("block");
      }
    });
}

type CrewData = {
  id: number;
  name: string;
  description: string;
  jobTitle: string;
  slug: string;
  profileImage: { src: string; format: string; width: number; height: number };
};

function handleCrewContentTransitions() {}

type TechnologyData = {
  id: number;
  name: string;
  description: string;
  slug: string;
  image: {
    portrait: { src: string; format: string; width: number; height: number };
    landscape: { src: string; format: string; width: number; height: number };
  };
};

function handleTechnologyContentTransitions() {}

navigation.addEventListener("navigate", (e) => {
  if (!e.canIntercept) return; 
  if (!isDestination(e.destination.url)) return;
  
  const urlPathArray = new URL(e.destination.url).pathname
  .trim()
  .split("/")
  .filter(Boolean);
  
  const page = urlPathArray[0];
  const slug = urlPathArray[1];
  
  //
  e.intercept({
    async handler() {
      const response = await fetch(`/api/${slug}`);
      const data = await response.json();
      //
      document.startViewTransition(async () => {
        handleDestinationContentTransitions(data);
      });
    },
  });
});
