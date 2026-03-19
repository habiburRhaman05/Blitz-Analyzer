"use server"
import { cookies } from "next/headers"

export const getAllCookies = async ()=>{
    return await cookies()
}
export const getCookies = async (name:string)=>{
    const cookieStore =  await cookies();
    return cookieStore.get(name) || null
}
