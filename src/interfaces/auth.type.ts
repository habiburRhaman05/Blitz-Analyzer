import { IUser } from "@/interfaces/user";

export type signInPayloadType = {
    email:string;
    password:string
}
export type signUpPayloadType = {

    name:string;
    email:string;
    password:string
    role:"STUDENT" | "TUTOR"
}
export type ILoginResponse = {
   success:boolean;message:string;data:{
    sessionToken:string,user:IUser
   }
}

