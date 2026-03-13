
"use server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isTokenExpiring } from "./jwt"
import { StringDecoder } from "string_decoder"
import { setTokenInCookies } from "./token"

let refreshPromise: Promise<string | null> | null = null

export async function refreshAccessToken(cookies:string): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
     try {
       const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
        method: "POST",
        headers:{
          cookie:cookies,
        },
        credentials: "include",
        cache: "no-store",
      })
      if (!res.ok) {
        refreshPromise = null
        return null
      }
      const json = await res.json().catch(() => null)
      refreshPromise = null


      const {accessToken,refreshToken,sessionToken} = json?.data;

      await setTokenInCookies("accessToken",accessToken,10*60)
      await setTokenInCookies("refreshToken",refreshToken,30*60)
      await setTokenInCookies("better-auth.session_token",sessionToken,10*60)

      return json?.data.accessToken ?? null
     } catch (error) {
      console.log("refresh token error",error);
     }
    })()
  }
  return refreshPromise
}

/**
 * serverApi: for Server Actions (POST/PUT/DELETE)
 * central 401 handling + proactive refresh
 */
export async function serverApi(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies()

const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    cookie: cookieStore.toString(),
  };

  // 2. Stringify body if it exists and isn't already a string
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
    let res = await fetch(`${process.env.API_URL}${path}`,fetchOptions)



  if (res.status === 401) {
    console.log("receive 401 error");
    
    const newAccess = await refreshAccessToken(cookieStore.toString())
console.log(cookieStore.toString());

    if (!newAccess) redirect("/sign-in")

    res = await fetch(`${process.env.API_URL}${path}`, {
      ...options,
      headers: {
        ...((options && options.headers) || {}),
      cookie:cookieStore.toString()
      },
      credentials: "include",
    })
    console.log(res);
    
    if(!res.ok){
      console.log("creating error");
      
    }
    const data = await res.json()

    return JSON.parse(JSON.stringify(data));

  }

    const data = await res.json()

    return JSON.parse(JSON.stringify(data));


} catch (error) {
  console.log("servre api error",error);
  
}
}