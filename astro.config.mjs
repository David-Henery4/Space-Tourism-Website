// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Bellefair",
      cssVariable: "--bellefair",
    },
    {
      provider: fontProviders.google(),
      name: "Barlow Condensed",
      cssVariable: "--barlow-condensed",
    },
    {
      provider: fontProviders.google(),
      name: "Barlow ",
      cssVariable: "--barlow",
    },
  ],
});
