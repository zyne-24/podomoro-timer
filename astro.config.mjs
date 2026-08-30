import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Pure client-side static site. Tailwind driven by tailwind.config.js.
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false })],
});
