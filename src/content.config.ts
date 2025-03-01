import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    subType: z.string().optional(),
  }),
});

const photography = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/photography" }),
    schema: ({ image }) =>
      z.object({
        name: z.string(),
        title: z.string(),
        cover: image()
    })
});

export const collections = { photography, blog };

