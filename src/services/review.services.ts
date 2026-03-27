"use server";

import httpClient from "@/lib/axios-client";
import { cookies } from "next/headers";


export const getAllReviews = async (url) => {
    const cookieStore = await cookies()
    const result = await httpClient.get(url, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });

    return result.data

}
export const createReview = async (payload) => {
    const cookieStore = await cookies()
    const result = await httpClient.post("/review", payload, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}

export const deleteReview = async (reviewId) => {
    const cookieStore = await cookies()
    const result = await httpClient.post(`/review/${reviewId}`, {}, {
        headers: {
            "cookie": cookieStore.toString()
        }
    });
    return result.data
}


