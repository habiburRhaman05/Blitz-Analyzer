"use server"
import httpClient from "@/lib/axios-client"
import { getAllCookies } from "./cookies"

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
export const updateResumeName  = async (data:{
    resumeId:string,
    body:{name:string}
}) =>{
    const result = await httpClient.post(`/resume/${data.resumeId}/update-resume`,data.body, {
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