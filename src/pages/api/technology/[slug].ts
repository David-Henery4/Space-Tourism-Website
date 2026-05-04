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

  const techInfo = await getCollection("technologyCollection");

  const technology = techInfo.find((d) => d.data.slug === slug);

  if (!technology) {
    return new Response(JSON.stringify({ error: "technology not found" }), {
      status: 404,
    });
  }

  const imageResultLandscape = await getImage({ src: technology.data.image.landscape });
  const imageResultPortrait = await getImage({ src: technology.data.image.portrait });

  return new Response(
    JSON.stringify({
      ...technology.data,
      image: {
        portrait: {
          src: imageResultPortrait.src,
          format: imageResultPortrait.options.format,
          width: imageResultPortrait.attributes.width,
          height: imageResultPortrait.attributes.height,
        },
        landscape: {
          src: imageResultLandscape.src,
          format: imageResultLandscape.options.format,
          width: imageResultLandscape.attributes.width,
          height: imageResultLandscape.attributes.height,
        },
      },
    }),
  );

}) satisfies APIRoute;

export function getStaticPaths() {
  return [
    { params: { slug: "space-capsule" } },
    { params: { slug: "spaceport" } },
    { params: { slug: "launch-vehicle" } },
  ];
}
