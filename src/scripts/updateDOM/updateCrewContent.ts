type CrewData = {
  id: number;
  name: string;
  description: string;
  jobTitle: string;
  slug: string;
  profileImage: { src: string; format: string; width: number; height: number };
};

import assignImageAttributes from "../helpers/assignImageAttr";

function updateCrewContent(data: CrewData) {
  const getElement = (id: string) => document.getElementById(id);
  
  const elements = {
    jobTitle: getElement("crew-job-title"),
    description: getElement("crew-description"),
    name: getElement("crew-name"),
    image: getElement("crew-image"),
    tabContainer: getElement("crew-tabs"),
  };
  
  if (!Object.values(elements).every(Boolean)) return;
  
  elements.name!.textContent = data.name;
  elements.jobTitle!.textContent = data.jobTitle;
  elements.description!.textContent = data.description;
  
  const imageElement = elements.image as HTMLImageElement;
  assignImageAttributes({
    imageElement,
    imageAttributes: {...data.profileImage}
  })
  
  elements.tabContainer
    ?.querySelectorAll("a")
    ?.forEach((activeTabStyleElement) => {
      const tabSlug = activeTabStyleElement.dataset.slug;
      if (!tabSlug) return;
      if (tabSlug === data.slug) {
        // Because of Tailwind behaviour, Might have to change.
        activeTabStyleElement.classList.add("bg-white");
        activeTabStyleElement.classList.remove("bg-white/15");
      } else {
        activeTabStyleElement.classList.add("bg-white/15");
        activeTabStyleElement.classList.remove("bg-white");
      }
  });
}

export default updateCrewContent