"use server"

import { setCookie } from "./cookie";

export const setTokenInCookies = async (
    name : string,
    token : string,
    fallbackMaxAgeInSeconds:number
) => {

    await setCookie(name, token, fallbackMaxAgeInSeconds);
}
