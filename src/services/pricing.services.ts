"use server";

import { CreditPackage } from "@/interfaces/pricing";
import { ApiResponse } from "@/interfaces/response";
import httpClient from "@/lib/axios-client";


export const getAllPricingPlan = async ():Promise<ApiResponse<CreditPackage[]>> =>{
    const result  = await  httpClient.get("/pricing");

    return result.data
}