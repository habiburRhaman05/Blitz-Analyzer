"use server"

import httpClient from "@/lib/axios-client";
import { serverFetch } from "@/lib/serverFetch"
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getUserCredit = async ()=>{
 
    const cookieStore = await cookies()

  const res = await httpClient.get("/wallet/my-blance", {
      headers: {
        "cookie": cookieStore.toString()
      }
    });

    return res.data
}


export async function refreshWallet() {
  // Use the profile argument your specific setup requires
  console.log("REVALIDATING NOW...");
  revalidateTag("/wallet/my-blance", "default") 
}