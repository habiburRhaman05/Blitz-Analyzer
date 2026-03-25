"use server";

import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";


export const updateUserStatus = async (id: string, status: string) => {
    const cookieStore = await cookies()

  const { data } = await httpClient.patch(`/admin/users/${id}/status`, { status },{
     headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}

export const deleteUser = async (id: string) => {
    const cookieStore = await cookies()
  const { data } = await httpClient.delete(`/admin/users/${id}`,{
     headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}

export const getAdminDashboardData = async ()=>{
    const cookieStore = await cookies()

  const {data} = await httpClient.get("/admin/dashboard/insight",{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
export const getAllTransactionns = async (page,limit)=>{
    const cookieStore = await cookies()

  const {data} = await httpClient.get(`/payment/get-all-transactions?page=${page}&limit=${limit}`,{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
export const getAllUsers = async (page,search)=>{
    const cookieStore = await cookies()

  const {data} = await httpClient.get(`/admin/users?page=${page}&limit=10&search=${search}`,{
headers: {
        "cookie": cookieStore.toString()
      }
  })
  return data
}
// export const getAllTransactionns = async (page,limit)=>{
//     const cookieStore = await cookies()

//   const {data} = await httpClient.get(`/payment/get-all-transactions?page=${page}&limit=${limit}`,{
// headers: {
//         "cookie": cookieStore.toString()
//       }
//   })
//   return data
// }