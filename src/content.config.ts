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
    }),
});

export const collections = {
  crewCollection,
};
