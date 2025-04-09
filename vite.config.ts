
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
      // Externalize all server-only dependencies
      external: [
        'puppeteer',
        'proxy-agent',
        '@puppeteer/browsers',
        'fs',
        'path',
        'http',
        'https',
        'stream',
        'url',
        'zlib',
        'crypto',
        'util',
        'net',
        'tls',
        'events',
        'assert',
        'os',
        'buffer',
        'querystring',
        // Add all other Node.js built-ins here
      ],
    },
  },
  // Properly handling Node.js built-ins
  optimizeDeps: {
    exclude: ['puppeteer', 'proxy-agent', '@puppeteer/browsers'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        {
          name: 'node-globals-polyfill',
          setup(build) {
            // Block all server-side imports that shouldn't be in the browser
            build.onResolve({ filter: /^(puppeteer|proxy-agent|@puppeteer\/browsers|fs|path|crypto|http|https|stream|url|zlib|util|net|tls|events|assert|os|buffer|querystring)$/ }, () => {
              return { external: true };
            });
          },
        },
      ],
    },
  }
}));
