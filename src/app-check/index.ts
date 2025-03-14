import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "@firebase/app-check";

import type { AppCheck } from "@firebase/app-check";

import type { FirebaseApp } from "@firebase/app";
import { getFirebaseApp } from "@/auth/firebase";

let appCheck: AppCheck | null = null;

export function getOrInitializeAppCheck(app: FirebaseApp): AppCheck {
  if (appCheck) {
    return appCheck;
  }

  // Firebase uses a global variable to check if app check is enabled in a dev environment
  if (process.env.NODE_ENV !== "production") {
    Object.assign(window, {
      FIREBASE_APPCHECK_DEBUG_TOKEN:
        process.env.NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN,
    });
  }

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  return (appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY || ""
    ),
    isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
  }));
}

export function getAppCheck() {
  const app = getFirebaseApp();

  return getOrInitializeAppCheck(app);
}
