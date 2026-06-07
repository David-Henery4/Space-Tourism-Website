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
  
  const crewInfo = await getCollection("crewCollection");
  
  const crew = crewInfo.find((d) => d.data.slug === slug);
  
  if (!crew) {
    return new Response(JSON.stringify({ error: "crew not found" }), {
      status: 404,
    });
  }
  
  const imageResult = await getImage({ src: crew.data.profileImage });
  
  return new Response(
    JSON.stringify({
      ...crew.data,
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
  const crewInfo = await getCollection("crewCollection");
  return crewInfo.map((crew) => {
    return {
      params: { slug: crew.data.slug },
    };
  });
}
