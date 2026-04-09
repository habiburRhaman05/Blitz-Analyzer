"use server";


import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";

export const getAllIssues = async (url) => {
    const cookieStore = await cookies()
    const result = await httpClient.get(url, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}
export const createIssue = async (payload) => {
    const cookieStore = await cookies()
    const result = await httpClient.post("/issue", payload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}

export const deleteIssue = async (issueId) => {
    const cookieStore = await cookies()
    const result = await httpClient.delete(`/issue/${issueId}`, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}

export const updateIssue = async (updatepayload,issueId) => {
    const cookieStore = await cookies()
    const result = await httpClient.patch(`/issue/${issueId}`, updatepayload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}


