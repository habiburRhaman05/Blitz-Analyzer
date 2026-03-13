"use client"

import httpClient from "@/lib/axios-client";
import { queryClient } from "@/lib/react-query";
import { serverApi } from "@/lib/serverApi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { ErrorInfo } from "react";
import { toast } from "sonner";

type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

type VariableWithMeta<T> = T & {
  meta?: {
    successMessage?: string;
    errorMessage?: string;
  }
};

interface MutationConfig {
  actionName: string;
  endpoint: string;
  method: MutationMethod;
  actionType:"CLIENT_SIDE" | "SERVER_SIDE"
  invalidateKeys?: string[];
  successMessage?: string;
  errorMessage?: string;
}

export function useApiMutation<TData = any, TVariables = any, TContext = unknown>(
  config: MutationConfig,
  hookOptions?: UseMutationOptions<TData, Error, VariableWithMeta<TVariables>, TContext>
) {
  const { method,actionName, endpoint, actionType, invalidateKeys, successMessage: configSuccess, errorMessage: configError } = config;

  return useMutation<TData, Error, VariableWithMeta<TVariables>, TContext>({
    mutationFn: async (variables) => {
      const { meta, ...payload } = (variables || {}) as any;
      const actionsInfo = {
        
        url: endpoint,
        method,
        body: payload,
        actionName:actionName
      }
      if (actionType === "SERVER_SIDE")  return await handleServerAction(actionsInfo) 
      
      const response = await httpClient(actionsInfo);
      return response.data;
    },

    onSuccess: (data, variables, context) => {
      // 1. Resolve Success Message
      const finalSuccessMessage = 
        variables?.meta?.successMessage || 
        configSuccess || 
        (data as any)?.message || 
        "Action completed successfully";

      toast.success(finalSuccessMessage);

      // 2. Invalidate Queries
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      // 3. FIX: Execute hook-level options using 'apply' or spreading to ignore argument count
      if (hookOptions?.onSuccess) {
        (hookOptions.onSuccess as Function)(data, variables, context);
      }
    },

    onError: (error: any, variables, context) => {
      // 1. Resolve Error Message
      const apiErrorMessage = error.response?.data?.error?.message || error.response?.data?.message;
      const finalErrorMessage = 
        variables?.meta?.errorMessage || 
        configError || 
        apiErrorMessage || 
        "Something went wrong.";

      toast.error(finalErrorMessage, {
        description: `Error Code: ${error.response?.status || "Unknown"}`,
      });

      // 2. FIX: Execute hook-level error callback
      if (hookOptions?.onError) {
        (hookOptions.onError as Function)(error, variables, context);
      }
    },
    
    // Spread other options like onMutate or retry
    ...hookOptions,
  });
}


export const handleServerAction = async (actionsInfo:{
    url:string,
  method:"POST" | "PUT" | "PATCH" | "DELETE",
  body:any,
  actionName:string
})=>{
  try {
        const response = await serverApi(actionsInfo.url,{
        body:JSON.stringify(actionsInfo.body),
        method:actionsInfo.method
    });
  return response
  } catch (error:any) {
    console.log(error);
    
    return {
      success:false,
      message:error.message || `Something Wrong Doing ${actionsInfo.actionName}! Check Logs`
    }
  }
}