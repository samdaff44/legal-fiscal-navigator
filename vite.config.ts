
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define global constants for the client
    'process.env.NODE_ENV': JSON.stringify(mode),
    'global': 'window'
  },
  // Optimizations for build
  build: {
    rollupOptions: {
      // Externalize server-only dependencies
      external: [
        'puppeteer',
        'fs',
        'path',
        'http',
        'https',
        'stream',
        'url',
        'zlib',
        'crypto',
      ],
    },
  },
  // Properly handling Node.js built-ins
  optimizeDeps: {
    exclude: ['puppeteer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        {
          name: 'node-globals-polyfill',
          setup(build) {
            // Use browser-compatible versions if available
            build.onResolve({ filter: /^(stream|http|https|zlib|url|crypto|fs|path)$/ }, () => {
              return { external: true };
            });
          },
        },
      ],
    },
  }
}));
