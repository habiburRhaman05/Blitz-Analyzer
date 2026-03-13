"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookie";
import { envVeriables } from "../config/envVariables";
import { UserRole } from "@/features/shared/types";


const getTokenSecondsRemaining =  (token: string): number => {
    if(!token) return 0;

    try {
        const tokenPayload= envVeriables.JWT_ACCESS_SECRET ? jwt.verify(token, envVeriables.JWT_ACCESS_SECRET as string) as JwtPayload : jwt.decode(token) as JwtPayload;

        if (tokenPayload && !tokenPayload.exp){
            return 0;
        }

        const remainingSeconds = tokenPayload.exp as number - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

    } catch (error) {
        console.error("Error decoding token:", error);
        return 0;
    }
} 

export const setTokenInCookies = async (
    name : string,
    token : string,
    fallbackMaxAgeInSeconds:number
) => {
   
    await setCookie(name, token, fallbackMaxAgeInSeconds);
}

export const decodeToken = async(token:string):Promise<{user:{role:UserRole;name:string,email:string}  | null}> =>{
    try {
        // const isvalidToken = jwt.verify(token,envVeriables.JWT_ACCESS_SECRET!);
           const userdata = jwt.decode(token) as {role:UserRole;name:string,email:string}
        return {
            user:userdata || null
        }
      
    } catch (error) {
          return {
              user: null,
           
          }
    }
}
// export default async function OrdersPage() {
//   const res = await serverFetch("/orders")
//   if (!res.ok) throw new Error("Failed to load")
//   const orders = await res.json()
//   return (
//     <div>{orders.map((o: any) => <div key={o.id}>{o.title}</div>)}</div>
//   )
// }