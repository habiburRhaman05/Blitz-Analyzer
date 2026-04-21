"use server";

import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";

export const getPaymentDetails = async (id:string) =>{

    const cookieStore = await cookies();
    const result = await httpClient.get(`/payment/${id}`,{
        headers:{
            "cookie":cookieStore.toString()
        }
    })
    return result.data
}
export const getUserPaymentHistory = async (userId:string) =>{

    const cookieStore = await cookies();
    const result = await httpClient.get(`/payment/user/${userId}/transactions`,{
        headers:{
            "cookie":cookieStore.toString()
        }
    })
    return result.data
}
export const getAllPaymentHistory = async () =>{

    const cookieStore = await cookies();
    const result = await httpClient.get(`/payment/get-all-transactions`,{
        headers:{
            "cookie":cookieStore.toString()
        }
    })
    return result.data
}

