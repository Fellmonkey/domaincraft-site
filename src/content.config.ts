import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['getting-started', 'guides', 'reference', 'concepts']),
    order: z.number().default(0),
    updated: z.string().optional()
  })
});

export const collections = { docs };
