"use server";

import httpClient from "@/lib/axios-client";
import { serverApi } from "@/lib/serverApi";
import { cookies } from "next/headers";

export const deleteAnalysis = async (analysisId:string) =>{
    const cookieStore = await cookies()
    const res = await httpClient.delete(`/analyzer/analysis/delete/${analysisId}`,{
          headers: {
        "cookie": cookieStore.toString()
      }
    });
    if(res.status === 200 || res.data.success){
         return {
        success: true,
        message: res.data.message,
      }

    }

}



export const getAnalysisDetails = async (id) =>{
      const cookieStore = await cookies()

   const {data}  = await httpClient.post(`/analyzer/analysis/${id}`,{},{
      headers: {
          "Content-Type": "multipart/form-data",
          "cookie": cookieStore.toString()
        },
  });
  return data
}


export const handleAnalysis = async (formData)=>{
    const cookieStore = await cookies()

    const response = await httpClient.post(
        `/analyzer/parse-resume`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            
        "cookie": cookieStore.toString()
      
          },
        }
      );
      return response.data
}
export const jobMatcher = async (formData)=>{
    const cookieStore = await cookies()

    const response = await httpClient.post(
        `/analyzer/job-matcher`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
        "cookie": cookieStore.toString()
          },
        }
      );
      console.log("res",response);
      
      return response.data
}
export const getUserAnalysisHistory = async ()=>{
    const cookieStore = await cookies()
    const response = await httpClient.get(
        `/analyzer/get-analysis-history`, 
        {
          headers: {
        "cookie": cookieStore.toString()
          },
        }
      );
      return response.data
}


 