import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const usernames = ["moon", "mars", "titan", "europa"];

export const GET = (async ({ params, request }) => {
  const slug = params.slug;

  console.log("Checking slug!: ", slug);

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

  return new Response(
    JSON.stringify(destination.data),
  );
}) satisfies APIRoute;

export function getStaticPaths() {
  return [
    { params: { slug: "moon" } },
    { params: { slug: "mars" } },
    { params: { slug: "titan" } },
    { params: { slug: "europa" } },
  ];
}
