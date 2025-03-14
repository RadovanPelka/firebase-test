"use client";

import { getFirebaseAuth } from "@/auth/firebase";
import { Button } from "@/components/ui/button";
import { getRedirectResult, type UserCredential } from "firebase/auth";
import { useEffect } from "react";
import { getGoogleProvider, loginWithProviderUsingRedirect } from "./firebase";
import { useRedirectAfterLogin } from "@/app/shared/useRedirectAfterLogin";
import { loginWithCredential } from "@/api";

const auth = getFirebaseAuth();

export function LoginPage() {
  const redirectAfterLogin = useRedirectAfterLogin();

  async function handleLogin(credential: UserCredential) {
    await loginWithCredential(credential);
    redirectAfterLogin();
  }

  async function handleLoginWithRedirect() {
    const credential = await getRedirectResult(auth);

    if (credential?.user) {
      await handleLogin(credential);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    handleLoginWithRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Button
        onClick={async () => {
          const auth = getFirebaseAuth();
          await loginWithProviderUsingRedirect(auth, getGoogleProvider(auth));
        }}
      >
        Log in with Google (Redirect)
      </Button>
    </div>
  );
}
