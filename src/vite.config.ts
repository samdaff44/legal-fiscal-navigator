
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
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    },
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
        'http-proxy-agent',
        'https-proxy-agent',
        'socks-proxy-agent',
        'pac-proxy-agent',
        'agent-base',
        // Add all other Node.js built-ins here
      ],
    },
  },
  // Properly handling Node.js built-ins
  optimizeDeps: {
    include: ['i18next', 'react-i18next'],
    exclude: [
      'puppeteer', 
      'proxy-agent', 
      '@puppeteer/browsers', 
      'http-proxy-agent', 
      'https-proxy-agent', 
      'socks-proxy-agent', 
      'pac-proxy-agent', 
      'agent-base',
      'void-elements', 
      'html-parse-stringify'
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      // Add proper handling for CommonJS modules
      plugins: [
        {
          name: 'node-globals-polyfill',
          setup(build) {
            // More aggressive blocking of server-side imports
            build.onResolve({ filter: /^(puppeteer|proxy-agent|@puppeteer\/browsers|fs|path|crypto|http|https|stream|url|zlib|util|net|tls|events|assert|os|buffer|querystring|http-proxy-agent|https-proxy-agent|socks-proxy-agent|pac-proxy-agent|agent-base)$/ }, () => {
              return { external: true, path: 'empty-module' };
            });
            
            // Block any imports from node_modules that include these patterns
            build.onResolve({ filter: /node_modules\/(puppeteer|proxy-agent|@puppeteer\/browsers|http-proxy-agent|https-proxy-agent|socks-proxy-agent|pac-proxy-agent|agent-base)/ }, () => {
              return { external: true, path: 'empty-module' };
            });

            // Custom resolver for CommonJS modules
            build.onResolve({ filter: /^(void-elements|html-parse-stringify)/ }, (args) => {
              return { path: args.path, namespace: 'file' };
            });
          },
        },
      ],
    },
  }
}));
