"use server"
import httpClient from "@/lib/axios-client"
import { getAllCookies } from "./cookies"
import { cookies } from "next/headers"
import axios from "axios"

export const getAllResumeById = async () =>{
    const result = await httpClient.get(`/resume`,{
        headers:{
            "cookie":(await getAllCookies()).toString()
        }
    })

    if(result.status == 200 || result.data.success){
        return  result.data
    }
    return null
}
export const updateResumeName  = async (
    resumeId:string,
    body:any
) =>{
    const result = await httpClient.post(`/resume/${resumeId}/update-resume`,body, {
        headers:{
            "cookie":(await getAllCookies()).toString()
        }
      
    })

    if(result.status == 200 || result.data.success){
        return  result.data
    }
    return null
}
export const deleteResume  = async (resumeId:string) =>{
    const result = await httpClient.delete(`/resume/${resumeId}/delete-resume`, {
        headers:{
            "cookie":(await getAllCookies()).toString()
        }
      
    })

    if(result.status == 200 || result.data.success){
        return  result.data
    }
    return null
}




// Forwards a browser-generated resume PDF to the backend to get a shareable
// URL. Goes through this server action (not a direct browser call) so the
// session cookie can be attached server-side. Only called on explicit "share".
export const shareResumePdf = async (builderId: string, formData: FormData) => {
  const file = formData.get("file") as File | null;
  if (!file) return { success: false, message: "No PDF provided" };

  const buffer = Buffer.from(await file.arrayBuffer());
  const FormDataNode = (await import("form-data")).default;
  const fd = new FormDataNode();
  fd.append("file", buffer, { filename: "resume.pdf", contentType: "application/pdf" });

  const cookieStore = await cookies();
  try {
    const res = await httpClient.post(`/resume/${builderId}/share-pdf`, fd, {
      headers: { ...fd.getHeaders(), cookie: cookieStore.toString() },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return { success: true, url: res.data?.data?.resumeUrl as string };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Could not create shareable link",
    };
  }
};

export const uploadResumeImage = async (formData: FormData) => {
  const cookieStore = await cookies()
  try {
    const response = await httpClient.post("/upload-media/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "cookie": cookieStore.toString(),
      },
    })

    const url = response.data?.images?.[0]?.url
    if (!url) {
      return { success: false, message: "Upload failed - no file URL returned." }
    }

    return { success: true, data: url }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Upload failed. Please try again.",
    }
  }
}

export const downloadResumeHandler = async (builderId, retryCount = 0) => {
  const cookieStore = await cookies()
  const MAX_RETRIES = 2
  const TIMEOUT = 30000 // 30 seconds

  try {
    const result = await httpClient.post(
      `/resume/${builderId}/generate-download`,
      {},
      {
        timeout: TIMEOUT,
        headers: {
          "cookie": cookieStore.toString(),
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(TIMEOUT),
      }
    )
    return result.data
  } catch (error) {

    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      console.error(`Request timeout after ${TIMEOUT}ms for builderId: ${builderId}`)
      
      // Retry logic for timeout
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
        return downloadCustomResumeHandler(builderId, body, retryCount + 1)
      }
      
      throw new Error(`Resume generation timed out after ${TIMEOUT/1000} seconds. Please try again.`)
    }
    // Handle other errors
    console.error('Error in downloadCustomResumeHandler:', error)
    throw error
  }
}




export const downloadCustomResumeHandler = async (builderId, body, retryCount = 0) => {
  const cookieStore = await cookies()
  const MAX_RETRIES = 2
  const TIMEOUT = 30000 // 30 seconds


    const result = await httpClient.post(
      `/resume/${builderId}/generate-custom-download`,
      body,
      {
        timeout: TIMEOUT,
        headers: {
          "cookie": cookieStore.toString(),
          "Content-Type": "application/json",
        },
      
      }
    )
    return result.data
 
}