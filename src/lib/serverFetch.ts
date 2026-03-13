"use server"
import { envVeriables } from "@/config/envVariables"
import { cookies } from "next/headers"

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(cookiesStore: string): Promise<string | null> {
  
 
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                // [server to server] - for cookie set -runtime don't allow set cookie
                // 1. hit backend request to get refresh token (using nextjs api route)
                // 2. return token
            return await ""
           }
             catch (error) {
                console.log(error);

                return null
            }
        })()
    }
    return refreshPromise
}


export async function serverFetch(path: string, options: RequestInit = {}) {
    const cookieStore = await cookies()

    let res = await fetch(`${envVeriables.API_URL}${path}`, {
        ...options,
        headers: {
            ...((options && options.headers) || {}),
            cookie: cookieStore.toString()
        },
        credentials: "include",
    })



    // fallback: if 401, try refresh once and retry
    if (res.status === 401) {

    // const refreshTokenSuccess = refreshAccessToken()

    //    if(refreshTokenSuccess){
    //      res = await fetch(`${envVeriables.API_URL}${path}`, {
    //         ...options,
    //         headers: {
    //             ...((options && options.headers) || {}),
    //             cookie: cookieStore.toString()
    //         },
    //         credentials: "include",
    //         cache: "no-store",
    //     })
    //    }else{
    //     // throw error
    //    }
    }

    const data = await res.json()

    return JSON.parse(JSON.stringify(data));
}