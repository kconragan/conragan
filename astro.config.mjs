// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'always',
  site: 'https://conragan.com',
  integrations: [mdx()]
});
