import { envVeriables } from '@/config/envVariables'; // আপনার ভেরিয়েবল নাম অনুযায়ী চেক করুন
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { isTokenExpiring } from './jwt';
import { refreshAccessToken } from './serverApi';
import { getCookie } from './cookie';

const API_BASE_URL = envVeriables.NEXT_PUBLIC_API_URL;

// Create axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
// httpClient.interceptors.response.use(
//   (response) => response, 
//   async (error: AxiosError) => {
//     const originalRequest = error.config as any;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//          const refreshTokenCookie = await getCookie("refreshToken");
//          console.log(refreshTokenCookie);
         
  
//          if(!refreshTokenCookie){
//           window.location.href = '/sign-in'; // বা আপনার লগইন রাউট
//           return
//          }
//         const updatedToken = await refreshAccessToken(refreshTokenCookie!)
//         console.log(updatedToken)
        
//          if(updatedToken){
//            return httpClient(originalRequest); 
//          }else{
//           window.location.href = '/sign-in'; 
//          }
//       } catch (refreshError) {
//                 console.error("Refresh token expired or failed. Redirecting to login...");
        
//         if (typeof window !== 'undefined') {
//           window.location.href = '/sign-in'; 
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default httpClient;
