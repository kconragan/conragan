import { glob } from "astro/loaders";

import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    isPublic: z.boolean().default(false),
    link: z.string().url().optional(),
    type: z.enum(['post', 'link']).default('post'),
    tags: z.array(z.string()).optional(),
  }).refine(data => {
    if (data.type === 'link' && !data.link) {
      throw new Error("Link posts must have a 'link' attribute.");
    }
    return true;
  }, {
    message: "Link posts must have a 'link' attribute.",
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

