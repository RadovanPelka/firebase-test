import type { NextRequest } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { authConfig } from "./config/server-config";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    refreshTokenPath: "/api/refresh-token",
    debug: authConfig.debug,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    enableCustomToken: authConfig.enableCustomToken,
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    serviceAccount: authConfig.serviceAccount,
    experimental_enableTokenRefreshOnExpiredKidHeader:
      authConfig.experimental_enableTokenRefreshOnExpiredKidHeader,
    tenantId: authConfig.tenantId,
    dynamicCustomClaimsKeys: [],
    handleValidToken: async (tokens) => {
      console.log("tokens", tokens);
      return intlMiddleware(request);
    },
    handleInvalidToken: async (reason) => {
      console.log("reason", reason);
      return intlMiddleware(request);
    },
    handleError: async (error) => {
      console.log("error", error);
      return intlMiddleware(request);
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
    "/api/refresh-token",
  ],
};
