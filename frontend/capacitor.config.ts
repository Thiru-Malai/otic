import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thirumalai.otic',
  appName: 'Otic',
  webDir: 'www',
  android: {
    backgroundColor: '#1B182B',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 10000,
      launchFadeOutDuration: 500
    }
  }
};

export default config;
