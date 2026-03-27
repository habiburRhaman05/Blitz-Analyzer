"use server"
import { envVeriables } from "@/config/envVariables";
import httpClient from "@/lib/axios-client";
import { setTokenInCookies } from "@/lib/token";
import { cookies } from "next/headers";

import { deleteCookie } from "@/lib/cookie";
import { serverFetch } from "@/lib/serverFetch";
import { NextRequest } from "next/server";
import { signInPayloadType } from "@/interfaces/auth.type";
import { revalidatePath } from "next/cache";


export const getMe = async () => {
      const cookieStore = await cookies()
 const res = await httpClient.get("/auth/me",{
  headers: {
        "cookie": cookieStore.toString()
      }
 });
 return res.data
}

export const revalidateProfileData = async (path="/dashboard/profile") =>{
  console.log("re-start");
  
  await revalidatePath(path)
  console.log("re-end");

}


export const handleLogin = async (loginPayload: signInPayloadType) => {
  try {
    const res = await httpClient.post("/auth/login", loginPayload);
    console.log(res.data);

    const { accessToken, refreshToken, sessionToken, user, message } = res.data.data;

    await setTokenInCookies("accessToken", accessToken, 60 * 60);
    await setTokenInCookies("better-auth.session_token", sessionToken, 60 * 60);
    await setTokenInCookies("refreshToken", refreshToken, 120 * 60);
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


export async function isTokenExpiringSoon(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const exp = payload.exp * 1000;
    return exp - Date.now() < 5 * 60 * 1000; // 5 minutes
  } catch {
    return true;
  }
}

export const changePassword = async (payload) => {
  const cookieStore = await cookies()


  try {
    const res = await httpClient.put("/auth/change-password", payload, {
      headers: {
        "cookie": cookieStore.toString()
      }
    });

    if (res.data) {
      return { success: true, message: res.data.message }
    }

  } catch (err: any) {
    const message = err.response?.data?.message || err.message || "An error occurred";
    return {
      success: false,
      message
    }
  }

}


export async function getTokens(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  return { accessToken, refreshToken };
}


export const handleAvatarUpload = async (formData: FormData) => {
  try {
    const cookieStore = await cookies();
    
    const response = await httpClient.post("/upload-media/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "cookie": cookieStore.toString()
      },
    });
    
    // Create a clean,
    const cleanResponse = {
      success: true,
      data: response.data?.secure_url || response.data?.url || response.data,
      status: response.status,
      message: response.data?.message || "Upload successful"
    };
    
    // Verify it's serializable
    JSON.stringify(cleanResponse);
    
    return cleanResponse;
  } catch (error: any) {
    console.error("Upload error:", error);
    
    // Return a clean error object
    return {
      success: false,
      data: null,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Upload failed"
    };
  }
};
export const handleProfileUpdate = async (payload) => {

    const cookieStore = await cookies();
    
    const response = await httpClient.put("/auth/update-profile", payload, {
      headers: {
        "cookie": cookieStore.toString()
      },
    });
    
    return response.data

    
};
export const handleEmailVerification = async ({ email, otp }) => {
  const cookieStore = await cookies()
  const result = await httpClient.post("/auth/verify-email", {
    email,
    otp,
  }, {
    headers: {
      "cookie": cookieStore.toString()
    }
  });

  return result.data

}



export const handleChangeAvatar = async (uploadedUrl) =>{
 try {
     const cookieStore = await cookies();

 const {data} = await httpClient.put("/auth/change-avatar", {"profileAvatar":uploadedUrl},{
  headers:{
     "cookie": cookieStore.toString()
  }
 })
 return data
 } catch (error) {
console.log("error",error);

 }
}