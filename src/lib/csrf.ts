"use server"

import { cookies } from "next/headers";
import httpClient from "@/lib/axios-client";
import { setCookie } from "@/lib/cookie";

/**
 * The CSRF-protected auth routes (login, logout, change-password,
 * update-profile, change-avatar) run as Next.js server actions, which call
 * the Express backend server-to-server - the browser never talks to it
 * directly for these. So the double-submit CSRF cookie has to be relayed
 * the same way the session cookie already is: fetch a token bound to this
 * cookie jar, copy the resulting Set-Cookie values onto our own jar for
 * next time, and also merge them into *this* request's outgoing cookie
 * header, since the relay only affects the browser's future requests.
 */
export const getCsrfRequestHeaders = async (): Promise<{
  "x-csrf-token": string;
  cookie: string;
}> => {
  const cookieStore = await cookies();

  try {
    const res = await httpClient.get("/auth/csrf-token", {
      headers: { cookie: cookieStore.toString() },
    });

    const setCookieHeaders: string[] = res.headers["set-cookie"] ?? [];
    const newCookiePairs = setCookieHeaders
      .map((c) => c.split(";")[0])
      .filter((pair): pair is string => Boolean(pair) && pair.includes("="));

    for (const pair of newCookiePairs) {
      const eq = pair.indexOf("=");
      const name = pair.slice(0, eq);
      const value = decodeURIComponent(pair.slice(eq + 1));
      await setCookie(name, value, 60 * 60);
    }

    const freshNames = new Set(newCookiePairs.map((p) => p.slice(0, p.indexOf("="))));
    const existingPairs = cookieStore
      .toString()
      .split("; ")
      .filter((pair) => pair && !freshNames.has(pair.slice(0, pair.indexOf("="))));

    const csrfToken: string = res.data?.data?.csrfToken ?? "";

    return {
      "x-csrf-token": csrfToken,
      cookie: [...existingPairs, ...newCookiePairs].join("; "),
    };
  } catch {
    // Fail open on the token fetch itself (network blip, backend down) -
    // the protected request will just get rejected with an explicit
    // "invalid csrf token" error instead of crashing here.
    return { "x-csrf-token": "", cookie: cookieStore.toString() };
  }
};
