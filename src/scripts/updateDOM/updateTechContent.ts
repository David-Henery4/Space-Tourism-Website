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

import assignImageAttributes from "../helpers/assignImageAttr";

function updateTechContent(data: TechnologyData) {
  const getElement = (id: string) => document.getElementById(id);

  const elements = {
    title: getElement("technology-title"),
    description: getElement("technology-description"),
    landscapeImage: getElement("technology-landscape-image"),
    portraitImage: getElement("technology-portrait-image"),
    tabContainer: getElement("technology-tabs"),
  };

  if (!Object.values(elements).every(Boolean)) return;

  elements.description!.textContent = data.description;
  elements.title!.textContent = data.name;

  const landscapeElement = elements.landscapeImage as HTMLImageElement;
  const portraitElement = elements.portraitImage as HTMLImageElement;
  assignImageAttributes({
    imageElement: landscapeElement,
    imageAttributes: { ...data.image.landscape },
  });
  assignImageAttributes({
    imageElement: portraitElement,
    imageAttributes: { ...data.image.portrait },
  });

  elements.tabContainer
    ?.querySelectorAll("a")
    ?.forEach((activeTabStyleElement) => {
      const tabSlug = activeTabStyleElement.dataset.slug;
      if (!tabSlug) return;
      if (tabSlug === data.slug) {
        // Because of Tailwind behaviour, Might have to change.
        activeTabStyleElement.classList.add(...["bg-white", "text-primary"]);
        activeTabStyleElement.classList.remove("text-white");
      } else {
        activeTabStyleElement.classList.remove(...["bg-white", "text-primary"]);
        activeTabStyleElement.classList.add("text-white");
      }
    });
}

export default updateTechContent;
