type DestinationData = {
  description: string;
  distance: string;
  id: number;
  image: { src: string; format: string; width: number; height: number };
  name: string;
  slug: string;
  travelTime: string;
};
import { loadDestinationModel } from "../3D-loader/mainLoader";
// import assignImageAttributes from "../helpers/assignImageAttr";

function updateDestinationContent(data: DestinationData) {
  const getElement = (id: string) => document.getElementById(id);

  const elements = {
    title: getElement("destination-title"),
    description: getElement("destination-description"),
    distance: getElement("destination-distance"),
    travelTime: getElement("destination-travel-time"),

    // WAS USED WHEN HAD NORMAL IMAGES (NON-3D)
    // image: getElement("destination-image"),

    modelContainer: getElement("destination-image-container"),
    tabContainer: getElement("destination-tabs"),
  };

  // Validate all elements exist
  if (!Object.values(elements).every(Boolean)) return;

  // Update text content
  elements.title!.textContent = data.name;
  elements.description!.textContent = data.description;
  elements.distance!.textContent = data.distance;
  elements.travelTime!.textContent = data.travelTime;

  // Update Model Container Slug
  elements.modelContainer!.dataset.slug = data.slug;
  loadDestinationModel(data.slug);

  // Update image attributes

  // WAS USED WHEN HAD NORMAL IMAGES (NON-3D)
  // const imageElement = elements.image as HTMLImageElement;
  // assignImageAttributes({
  //   imageElement,
  //   imageAttributes: { ...data.image },
  // });

  // Update Tabs Underline Styles
  elements.tabContainer
    ?.querySelectorAll("div")
    ?.forEach((activeTabStyleElement) => {
      const tabSlug = activeTabStyleElement.dataset.slug;
      if (!tabSlug) return;
      if (tabSlug === data.slug) {
        activeTabStyleElement.classList.add("block");
        activeTabStyleElement.classList.remove("hidden");
        // activeTabStyleElement.style.color = "#ffffff"
      } else {
        // activeTabStyleElement.style.color = "#d0d6f9";
        activeTabStyleElement.classList.add("hidden");
        activeTabStyleElement.classList.remove("block");
      }
    });

  // Update Tabs Text Colour
  elements.tabContainer
    ?.querySelectorAll("a")
    ?.forEach((activeTabStyleElement) => {
      const tabSlug = activeTabStyleElement.dataset.slug;
      if (!tabSlug) return;
      if (tabSlug === data.slug) {
        activeTabStyleElement.style.color = "#ffffff"
      } else {
        activeTabStyleElement.style.color = "#d0d6f9";
      }
    });
}

export default updateDestinationContent;
