// @ts-nocheck
import Constants from 'expo-constants';

let devHost = 'localhost';

if (__DEV__) {
  const debuggerHost =
    Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost;

  if (debuggerHost && typeof debuggerHost === 'string') {
    devHost = debuggerHost.split(':')[0];
  }
}

export const API_BASE_URL = __DEV__
  ? `http://${devHost}:5000/api`
  : 'https://api.your-domain.com/api';
