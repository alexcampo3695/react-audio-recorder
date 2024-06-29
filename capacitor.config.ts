import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.transcribe.app',
  appName: 'transcribe',
  webDir: 'dist',
  server: {
    url: 'http://localhost:4173/',
    cleartext: true
  }
};

export default config;