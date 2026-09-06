
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

  try {
    const res = await fetch(`${process.env.API_URL}${path}`, fetchOptions)

    if (res.status === 401) {
      redirect("/sign-in")
    }

    const data = await res.json()

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.log("server api error", error);
  }
}
