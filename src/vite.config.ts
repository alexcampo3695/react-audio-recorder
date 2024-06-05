import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@helpers': path.resolve(__dirname, 'src/helpers'),
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['react', 'react-dom', 'openai'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'openai': 'OpenAI'
        }
      }
    }
  },
  server: {
    port: 4173
  }
});
