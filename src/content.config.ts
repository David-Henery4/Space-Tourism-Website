import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const crewCollection = defineCollection({
  loader: glob({ base: "./src/content/crew", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      jobTitle: z.string(),
      slug: z.string(),
      profileImage: image(),
      altText: z.string()
    }),
});

const destinationCollection = defineCollection({
  loader: glob({ base: "./src/content/destination", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      slug: z.string(),
      distance: z.string(),
      travelTime: z.string(),
      image: image(),
      altText: z.string(),
    }),
});

const technologyCollection = defineCollection({
  loader: glob({ base: "./src/content/technology", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      slug: z.string(),
      image: z.object({
        portrait: image(),
        landscape: image(),
      }),
      altText: z.string(),
    }),
});

export const collections = {
  crewCollection,
  destinationCollection,
  technologyCollection
};
