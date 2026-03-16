"use server"
import { envVeriables } from "@/config/envVariables";
import httpClient from "@/lib/axios-client";
import { setTokenInCookies } from "@/lib/token";
import { cookies } from "next/headers";

import { deleteCookie } from "@/lib/cookie";
import { serverFetch } from "@/lib/serverFetch";
import { NextRequest } from "next/server";
import { signInPayloadType } from "@/interfaces/auth.type";

export const getProfile = async (): Promise<{ user: { data: any } } | null> => {
  const cookieStore = await cookies();
  const res = await fetch(`${envVeriables.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      cookie: cookieStore.toString(),
    },
    cache: "no-store",
    credentials: "include",
  });

  console.log("cookies", cookieStore.toString());

  if (!res.ok) return null;
  const user = await res.json()


  return { user }
};

export const getMe = async ()=>{
try {
    let data = await serverFetch("/auth/me");
  return data
} catch (error) {
  console.log(error);
  
}
}

export const handleLogin = async (loginPayload: signInPayloadType) => {
  try {
    const res = await httpClient.post("/auth/login", loginPayload);
    console.log(res.data);

    const { accessToken, refreshToken, sessionToken, user, message } = res.data.data;

    await setTokenInCookies("accessToken", accessToken,15*60);
    await setTokenInCookies("better-auth.session_token", sessionToken,15*60);
    await setTokenInCookies("refreshToken", refreshToken,30*60);
    //  redirect("/dashboard")
    return {
      success: true,
      message: message,
      user
    }
  } catch (error: any) {
    console.log(error.message);
    return {
      success: false,
      message: error.response.data.message || error.message || "Failed to Login"
    }

  }
}
export const handleLogout = async () => {
  try {
    const cookieStore = await cookies()
    const res = await httpClient.get("/auth/logout", {
      headers: {
        "cookie": cookieStore.toString()
      }
    });
    if (res.data.success) {
      await deleteCookie("accessToken")
      await deleteCookie("refreshToken")
      await deleteCookie("better-auth.session_token")

      return {
        success: true,
        message: res.data.message,

      }
    }
  } catch (error: any) {
    // console.log(error.response);
    return {
      success: false,
      message: error.response.data.message || error.message || "Failed to Login"
    }

  }
}



let refreshPromise: Promise<any> | null = null;


export async function refreshTokens(refreshToken: string, apiUrl: string) {
  if (!refreshPromise) {
    refreshPromise = fetch(`${apiUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${refreshToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed');
        return res.json();
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}


export async function  isTokenExpiringSoon(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const exp = payload.exp * 1000;
    return exp - Date.now() < 5 * 60 * 1000; // 5 minutes
  } catch {
    return true;
  }
}


export async function getTokens(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  return { accessToken, refreshToken };
}