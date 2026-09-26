"use server"
import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";

import { deleteCookie } from "@/lib/cookie";
import { signInPayloadType } from "@/interfaces/auth.type";
import { revalidatePath } from "next/cache";
import { getCsrfRequestHeaders } from "@/lib/csrf";

const isProduction = process.env.NODE_ENV === "production";

// Replays raw Set-Cookie header strings from a backend response onto this
// domain's cookie jar, preserving the exact cookie name (incl. __Secure-/
// __Host- prefixes) and value. This is what lets the middleware later forward
// a cookie better-auth will actually accept.
const replaySetCookies = async (setCookie?: string[] | string) => {
  if (!setCookie) return;
  const headers = Array.isArray(setCookie) ? setCookie : [setCookie];
  const cookieStore = await cookies();

  for (const raw of headers) {
    const [pair, ...attrs] = raw.split(";");
    if (!pair) continue;
    const eq = pair.indexOf("=");
    if (eq < 0) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();

    const maxAgeAttr = attrs
      .map((a) => a.trim())
      .find((a) => a.toLowerCase().startsWith("max-age="));
    const maxAge = maxAgeAttr ? Number(maxAgeAttr.split("=")[1]) : 60 * 60;

    cookieStore.set(name, decodeURIComponent(value), {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: Number.isFinite(maxAge) ? maxAge : 60 * 60,
    });
  }
};


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
    // Not authenticated (or backend unreachable) is a normal, expected state
    // for this call - return a logged-out shape instead of throwing, so the
    // server action responds 200 with { data: null } rather than a 500. The
    // caller (UserContext / server pages) already treats missing data as
    // "logged out" and lets the middleware handle any redirect.
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || "Not authenticated",
    };
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

    // Replay the backend's real Set-Cookie header(s) onto this domain's
    // cookie jar, exact name + signed value + attributes. In production the
    // session cookie is `__Secure-better-auth.session_token`; hardcoding the
    // non-prefixed name (old approach) meant better-auth never found/validated
    // it, so login "succeeded" but every later request read as logged-out.
    await replaySetCookies(res.headers["set-cookie"]);

    const { user, message } = res.data.data;

    return {
      success: true,
      message: res.data.message ?? message,
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