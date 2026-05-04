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
