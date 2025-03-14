import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Needed for `signInWithRedirect` and custom `authDomain` configuration. See https://firebase.google.com/docs/auth/web/redirect-best-practices#proxy-requests
  // If you don't plan to use `signInWithRedirect` or custom `authDomain`, you can safely remove `rewrites` config.
  async rewrites() {
    return [
      {
        source: "/__/auth",
        destination: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com/__/auth`,
      },
      {
        source: "/__/auth/:path*",
        destination: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com/__/auth/:path*`,
      },
      {
        source: "/__/firebase/init.json",
        destination: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com/__/firebase/init.json`,
      },
    ];
  },
  env: {
    VERCEL: process.env.VERCEL,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
