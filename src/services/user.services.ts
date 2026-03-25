"use server";

import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";

export const getUserDashboardData = async ()=>{
    const cookieStore = await cookies()

  const {data} = await httpClient.get("/user/dashboard/kpis",{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}

