import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4173
  }
})
