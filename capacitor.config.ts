import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.carevoice.app',
  appName: 'CareVoice',
  webDir: 'dist',
  server: {
    // does prod url got here?
    url: 'http://localhost:4173/',
    cleartext: true
  }
};

export default config;
