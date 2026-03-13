"use server";

import { cookies } from "next/headers";
import { setTokenInCookies } from "./token";

export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
) => {
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        path : "/",
        maxAge : maxAgeInSeconds,
    })
}

export const getCookie = async (name : string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export const deleteCookie = async (name : string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

export const setAuthCookie = async (accessToken:string,sessionToken:string,refreshToken:string)=>{
    "use server"
      try {
           await setTokenInCookies("accessToken", accessToken, 10 * 60);
                await setTokenInCookies("better-auth.session_token", sessionToken, 10 * 60);
                await setTokenInCookies("refreshToken", refreshToken, 30 * 60);
                return true
      } catch (error) {
                return false
        
      }
}