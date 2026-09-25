"use server"
import httpClient from "@/lib/axios-client";
import { setTokenInCookies } from "@/lib/token";
import { cookies } from "next/headers";

import { deleteCookie } from "@/lib/cookie";
import { signInPayloadType } from "@/interfaces/auth.type";
import { revalidatePath } from "next/cache";
import { getCsrfRequestHeaders } from "@/lib/csrf";


export const getMe = async () => {
  // cookies() throws Next's own "needs dynamic rendering" bailout signal
  // during static prerendering - it has to propagate untouched, so it must
  // stay outside the try/catch below (which is only for genuine HTTP
  // errors from the actual fetch, not Next's internal control flow).
  const cookieStore = await cookies()
  try {
    const res = await httpClient.get("/auth/me", {
      headers: {
        "cookie": cookieStore.toString()
      }
    });
    return res.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch user");
  }
}

export const revalidateProfileData = async (path="/dashboard/profile") =>{
  console.log("re-start");
  
  await revalidatePath(path)
  console.log("re-end");

}


export const handleLogin = async (loginPayload: signInPayloadType) => {
  try {
    const res = await httpClient.post("/auth/login", loginPayload, {
      headers: await getCsrfRequestHeaders(),
    });

    const { sessionToken, user, message } = res.data.data;

    await setTokenInCookies("better-auth.session_token", sessionToken, 60 * 60);

    return {
      success: true,
      message: message,
      user
    }
  } catch (error: any) {
    // Validation failures (e.g. from validateRequest middleware) come back
    // as { success: false, errors: ZodIssue[] } with no top-level message -
    // forward errors too so SigninForm's field-level error mapping (which
    // already expects userData.errors) actually receives real data instead
    // of always falling through to a generic message.
    const errors = error.response?.data?.errors;
    const validationMessage = Array.isArray(errors) ? errors[0]?.message : undefined;
    return {
      success: false,
      message: validationMessage || error.response?.data?.message || error.message || "Failed to Login",
      errors,
    }
  }
}
export const handleLogout = async () => {
  try {
    const res = await httpClient.post("/auth/logout", {}, {
      headers: await getCsrfRequestHeaders(),
    });
    if (res.data.success) {
      await deleteCookie("better-auth.session_token")

      return {
        success: true,
        message: res.data.message,

      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to Login"
    }

  }
}

export const changePassword = async (payload) => {
  try {
    const res = await httpClient.put("/auth/change-password", payload, {
      headers: await getCsrfRequestHeaders(),
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


export const handleAvatarUpload = async (formData: FormData) => {
  const cookieStore = await cookies();
  try {
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

    const response = await httpClient.put("/auth/update-profile", payload, {
      headers: await getCsrfRequestHeaders(),
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
console.log(result);

  return result.data

}



export const handleChangeAvatar = async (uploadedUrl) =>{
 try {
 const {data} = await httpClient.put("/auth/change-avatar", {"profileAvatar":uploadedUrl},{
  headers: await getCsrfRequestHeaders(),
 })
 return data
 } catch (error) {
console.log("error",error);

 }
}