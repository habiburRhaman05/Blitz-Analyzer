"use server";

import httpClient from "@/lib/axios-client";


export const updateUserStatus = async (id: string, status: string) => {
  const { data } = await httpClient.patch(`/admin/users/${id}/status`, { status })
  return data
}

export const deleteUser = async (id: string) => {
  const { data } = await httpClient.delete(`/admin/users/${id}`)
  return data
}