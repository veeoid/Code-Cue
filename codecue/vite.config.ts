// File: vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath((import.meta as any).url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: chunk => {
          if (chunk.name === 'content') return 'content.js';
          if (chunk.name === 'background') return 'background.js';
          return 'assets/[name]-[hash].js';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});