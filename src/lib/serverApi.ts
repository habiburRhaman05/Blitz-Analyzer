
"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * serverApi: for Server Actions (POST/PUT/DELETE)
 * A 401 here means the session is genuinely gone, so it redirects
 * straight to sign-in instead of trying to refresh a separate token.
 */
export async function serverApi(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies()

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    cookie: cookieStore.toString(),
  };

  const body = options.body && typeof options.body === 'object'
    ? JSON.stringify(options.body)
    : options.body;

  const fetchOptions = {
    ...options,
    headers,
    body,
    credentials: "include" as const,
  };

  let res: Response;
  try {
    res = await fetch(`${process.env.API_URL}${path}`, fetchOptions);
  } catch (error: any) {
    return { success: false, message: error?.message || "Network error - please try again" };
  }

  // redirect() throws Next's own internal navigation signal - it must stay
  // outside any try/catch that could swallow it (same class of bug as the
  // "Dynamic server usage" bailout: catching indiscriminately breaks it).
  if (res.status === 401) {
    redirect("/sign-in")
  }

  try {
    const data = await res.json()
    return JSON.parse(JSON.stringify(data));
  } catch {
    return { success: false, message: "Unexpected response from server" };
  }
}
