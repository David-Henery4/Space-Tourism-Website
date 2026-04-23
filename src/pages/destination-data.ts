import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET = (async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  console.log("Backend url request: ", url)
  console.log("Backend Slug: ", slug)

  // if (!slug) {
  //   return new Response(JSON.stringify({ error: "No slug provided" }), {
  //     status: 400,
  //   });
  // }

  // const destinations = await getCollection("destinationCollection");
  // const destination = destinations.find((d) => d.data.slug === slug);

  // if (!destination) {
  //   return new Response(JSON.stringify({ error: "Destination not found" }), {
  //     status: 404,
  //   });
  // }

  return new Response(JSON.stringify({testName: slug}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}) satisfies APIRoute;
