"use server"
import { envVeriables } from "@/config/envVariables"
import { cookies } from "next/headers"

export async function serverFetch(path: string, options: RequestInit = {},revalidate: number | false = 3600) {
    const cookieStore = await cookies()
console.log(`🌐 FETCH: ${path}`);
    let res = await fetch(`${envVeriables.API_URL}${path}`, {
        ...options,
        headers: {
            ...((options && options.headers) || {}),
            cookie: cookieStore.toString()
        },
        credentials: "include",
        cache:"no-cache",
    })

const cacheStatus = res.headers.get('x-nextjs-cache');
    console.log(`🌐 FETCH: ${path} | Cache: ${cacheStatus || 'N/A'}`);

    const data = await res.json()

    return JSON.parse(JSON.stringify(data));
}

