"use server";

import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";


export const getAllBlogs = async (url) => {
    const cookieStore = await cookies()
    const result = await httpClient.get(url, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });

    return result.data

}
export const createBlog = async (payload) => {
    const cookieStore = await cookies()
    const result = await httpClient.post("/blog", payload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    console.log(result);
    
    return result.data
}

export const deleteBlog = async (blogId) => {
    const cookieStore = await cookies()
    const result = await httpClient.delete(`/blog/${blogId}`, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}


