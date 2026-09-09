import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'src/main.ts'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
    sourcemap: false,
    minify: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/img': 'http://localhost:5000',
    },
  },
});
