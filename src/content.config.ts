import { glob } from "astro/loaders";

import { defineCollection, z } from 'astro:content';

// 1. Schema for your standard blog posts (replaces type: 'post')
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    author: z.string().default('Kai Conragan'),
    heroImage: z.string().optional(),
    isPublic: z.boolean().default(true), // Assuming posts are public by default
    tags: z.array(z.string()).optional(),
  }),
});

// 2. Schema for dive logs
const diveLogsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // --- Core Info (Required) ---
    title: z.string(),
    description: z.string(),
    date: z.date(),
    isPublic: z.boolean().default(true),

    // --- Optional Thematic Tags ---
    tags: z.array(z.string()).optional(),
    author: z.string().default('Kai Conragan'),

    // --- Dive Details (Most are now optional) ---
    dive_details: z.object({
      // Essential manual entries
      dive_number_in_year: z.number(),
      location: z.string(),
      duration_min: z.number(),

      // Optional computer/calculated data
      coordinates: z.string().optional(),
      gas_mix: z.string().optional(),
      tank_description: z.string().optional(),
      max_depth_m: z.string().optional(),
      max_depth_ft: z.string().optional(),
      average_depth_m: z.string().optional(),
      average_depth_ft: z.string().optional(),
      average_depth_m_raw: z.number().nullable().optional(), // Can be missing or null
      water_temp_c: z.string().optional(),
      water_temp_f: z.string().optional(),
      start_pressure_bar: z.string().optional(),
      start_pressure_psi: z.string().optional(),
      end_pressure_bar: z.string().optional(),
      end_pressure_psi: z.string().optional(),
      scr_l_min: z.string().optional(),
      scr_cf_min: z.string().optional(),
    }).optional(),

    // The entire dive profile can be absent
    dive_profile: z.any().optional(),
  }),
});

// 3. Schema for short, external links (replaces type: 'link')
const linksCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    externalURL: z.string().url(), // Using a more descriptive name than 'link'
    isPublic: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
  }),
});

// 4. Schema for short, random notes
const notesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(), // Title is optional for a quick note
    date: z.date(),
    isPublic: z.boolean().default(true),
    tags: z.array(z.string()).optional(),
  }),
});

const photographyCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/photography" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      title: z.string(),
      cover: image()
    })
});

export const collections = {
  'posts': postsCollection,
  'divelogs': diveLogsCollection,
  'links': linksCollection,
  'notes': notesCollection,
  'photography': photographyCollection
};

