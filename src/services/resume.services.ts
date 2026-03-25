"use server"
import httpClient from "@/lib/axios-client"
import { getAllCookies } from "./cookies"
import { cookies } from "next/headers"

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

export const downloadResumeHandler = async (builderId) =>{
       const cookieStore = await cookies()

    const result = await  httpClient.post(`/resume/${builderId}/generate-download`,{},{
        headers:{
             "cookie":cookieStore.toString()
        }
       })
return result.data
}