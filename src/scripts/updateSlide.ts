

import {
  updateCrewContent,
  updateDestinationContent,
  updateTechContent,
} from "./updateDOM";
import { isDestination, isCrew, isTechnology } from "./helpers/checkPaths";

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
