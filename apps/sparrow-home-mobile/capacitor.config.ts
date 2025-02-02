import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'sparrow-home-mobile',
  webDir: '../../dist/apps/sparrow-home-mobile/browser',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    url: `http://192.168.0.116:8100`, // If you run on another port, adjust it
  },
};

export default config;
