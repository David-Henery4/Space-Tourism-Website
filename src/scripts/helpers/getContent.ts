// import { type RenderedContent } from "astro:content";
// import { getImage } from "astro:assets";

// interface DestinationContent {
//   id: string;
//   body?: string | undefined;
//   collection: "destinationCollection";
//   data: {
//     id: number;
//     name: string;
//     description: string;
//     slug: string;
//     distance: string;
//     travelTime: string;
//     image: {
//       src: string;
//       width: number;
//       height: number;
//       format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
//     };
//   };
//   rendered?: RenderedContent | undefined;
//   filePath?: string;
// }


// interface CrewContent {
//   id: string;
//   body?: string | undefined;
//   collection: "crewCollection";
//   data: {
//     id: number;
//     name: string;
//     description: string;
//     jobTitle: string;
//     slug: string;
//     profileImage: {
//       src: string;
//       width: number;
//       height: number;
//       format: "png" | "jpg" | "jpeg" | "tiff" | "webp" | "gif" | "svg" | "avif";
//     };
//   };
//   rendered?: RenderedContent | undefined;
//   filePath?: string;
// }

// interface TechnologyContent {
//   id: string;
//   body?: string | undefined;
//   collection: "technologyCollection";
//   data: {
//     id: number;
//     name: string;
//     description: string;
//     slug: string;
//     image: {
//       portrait: {
//         src: string;
//         width: number;
//         height: number;
//         format:
//           | "png"
//           | "jpg"
//           | "jpeg"
//           | "tiff"
//           | "webp"
//           | "gif"
//           | "svg"
//           | "avif";
//       };
//       landscape: {
//         src: string;
//         width: number;
//         height: number;
//         format:
//           | "png"
//           | "jpg"
//           | "jpeg"
//           | "tiff"
//           | "webp"
//           | "gif"
//           | "svg"
//           | "avif";
//       };
//     };
//   };
//   rendered?: RenderedContent | undefined;
//   filePath?: string;
// }

// type PageContent = DestinationContent | CrewContent | TechnologyContent


// const getPageContent = async (pageContent: PageContent[], slug: string) => {
//   const destination = pageContent.find((d) => d.data.slug === slug);

//   if (!destination) {
//     return new Response(JSON.stringify({ error: "Destination not found" }), {
//       status: 404,
//     });
//   }

//   const imageResult = await getImage({ src: destination.data.image });

//   return new Response(
//     JSON.stringify({
//       ...destination.data,
//       image: {
//         src: imageResult.src,
//         format: imageResult.options.format,
//         width: imageResult.attributes.width,
//         height: imageResult.attributes.height,
//       },
//     }),
//   );
// };
