import { getOrInitializeAppCheck } from "@/app-check";
import { clientConfig } from "@/config/client-config";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";

export const getFirebaseApp = () => {
  if (getApps().length) {
    return getApp();
  }

  const app = initializeApp(clientConfig);

  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    getOrInitializeAppCheck(app);
  }

  return app;
};

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp());

  // App relies only on server token. We make sure Firebase does not store credentials in the browser.
  // See: https://github.com/awinogrodzki/next-firebase-auth-edge/issues/143
  setPersistence(auth, inMemoryPersistence);

  if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST) {
    // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
    interface ExtendedAuth extends ReturnType<typeof getAuth> {
      _canInitEmulator?: boolean;
    }
    (auth as ExtendedAuth)._canInitEmulator = true;
    connectAuthEmulator(
      auth,
      `http://${process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST}`,
      {
        disableWarnings: true,
      }
    );
  }

  if (clientConfig.tenantId) {
    auth.tenantId = clientConfig.tenantId;
  }

  return auth;
}
