// const destinationTabsContainer = document.getElementById("destination-tabs");
// const destinationTextContent = document.getElementById(
//   "destination-title-description",
// );

// const links = document.querySelector(".test-link")?.addEventListener("click",(e) => {
//   e.preventDefault();
//   console.log("clicked")
// });

// const ORDER = ["moon", "mars", "europa", "titan"];

function isDestination(url: string) {
  return url.includes("/destination/");
}

// destinationTabsContainer?.addEventListener("click", async (e) => {
//   // if (!(e.target instanceof HTMLAnchorElement)) return;
//   // console.log("Event: ", e.target.dataset?.slug);
//   // e.preventDefault;
//   // destinationTextContent?.animate({}, {});
//   // document.startViewTransition({
//   //   update: () => {
//   //     console.log("Start!!!!")
//   //   },
//   //   types: ["spa"],
//   // });

//   const link = (e.target as Element).closest(
//     "a[href]",
//   ) as HTMLAnchorElement | null;

//   if (!link) return;

//   console.log("Event: ", link.dataset?.slug);
//   console.log("HREF: ", new URL(link.href));

//   // const previous = location.pathname;
//   // const next = new URL(link.href, location.href).pathname;
//   // console.log("Previous: ", previous, "Next: ", next);

//   // // Only intercept destination → destination navigation
//   // if (!isDestination(previous) || !isDestination(next)) return;

//   // const fromSlug = previous.split("/").pop()!;
//   // const toSlug = next.split("/").pop()!;
//   // if (fromSlug === toSlug) return;

//   e.preventDefault();

//   // document.startViewTransition(() => {
//   //   location.href = link.href;
//   // });

//   console.log("HEEREREREWRE")
// });

// document.startViewTransition({update: () => {
//   console.log("2#")
// }})

// function updateView(e: Event) {}

// const activeView = document.startViewTransition(() => {});

// activeView.finished

// navigation.addEventListener("navigate", (e) => {
//   if (!e.canIntercept) return;

//   const url = new URL(e.destination.url)
//   console.log("URL: ", url)

//   e.intercept({
//     async handler() {
//       document.startViewTransition(async () => {
//         console.log("Transitioned!")
//         // await navigation.navigate(url).finished;
//       })
//       // location.href = url.href;
//     }
//   })

// })

// navigation.addEventListener("navigate", (e: NavigateEvent) => {
//   const to = new URL(e.destination.url).pathname;
//   const from = location.pathname;

//   if (!isDestination(from) || !isDestination(to)) return;

//   const fromSlug = from.split("/").pop()!;
//   const toSlug = to.split("/").pop()!;

//   const dir =
//     ORDER.indexOf(toSlug) > ORDER.indexOf(fromSlug) ? "forward" : "backward";
//   document.documentElement.dataset.transition = dir;
//   // Don't call e.intercept() — let the browser handle the navigation naturally
// });

type TempDestinationData = {
  description: string;
  distance: string;
  id: number;
  image: string;
  name: string;
  slug: string;
  travelTime: string;
};

navigation.addEventListener("navigate", (e) => {
  if (!e.canIntercept) return;

  console.log(e.target);

  if (!isDestination(e.destination.url)) return;

  console.log("IS DESTINATION: ", isDestination(e.destination.url));

  // const allPosts = Object.values(
  //   import.meta.glob("../content/destination/*.md", { eager: true }),
  // )

  // console.log(allPosts)

  // const frontmatter: TempDestinationData[] = allPosts.map((collection) => {
  //   return collection.frontmatter
  // })

  // console.log(frontmatter)

  const url = new URL(e.destination.url);
  console.log("URL: ", url.pathname.split("/").pop());

  const testValue = "moon";

  e.intercept({
    async handler() {
      const response = await fetch(`/api/${url.pathname.split("/").pop()}`);
      const data = await response.json();
      console.log(data)

      document.startViewTransition(async () => {
        const titleEle = document.getElementById("destination-title");
        const descriptionEle = document.getElementById(
          "destination-description",
        );
        const distanceEle = document.getElementById(
          "destination-distance",
        );
        const travelTimeEle = document.getElementById(
          "destination-travel-time",
        );
        const imageEle = document.getElementById(
          "destination-image",
        );
        if (!titleEle) return;
        titleEle.innerHTML = data.name;
        console.log("Transitioned!");
        // await navigation.navigate(url).finished;
      });
      // location.href = url.href;
    },
  });
});

// Three ways I want to try and use to solve this problem

// 1) Pure CSS No javascript (MPS)
// 2) Mix of both - Use Javascript to only target the tabs for transition and have the page update when switching pages.
// 3) Only Javascript to trigger the transitions, Ignore/Cancel the full page refresh & update the URL and the DOM.
