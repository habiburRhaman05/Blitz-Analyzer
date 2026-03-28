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