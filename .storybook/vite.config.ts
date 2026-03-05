import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from "path";
import { fileURLToPath } from 'node:url';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'shared': path.resolve(dirname, '../shared')
    }
  }
});