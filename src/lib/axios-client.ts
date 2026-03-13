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
httpClient.interceptors.response.use(
  (response) => response, 
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // যদি ৪০১ হয় এবং এটি আগে ট্রাই করা না হয়ে থাকে
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ১. সাইলেন্টলি টোকেন রিফ্রেশ কল করুন (Better Auth বা আপনার ব্যাকেন্ড অনুযায়ী)
        // নোট: এখানে সরাসরি axios ইউজ করা ভালো যাতে এই রিকোয়েস্ট আবার ইন্টারসেপ্টরে না ফেঁসে যায়
        // await axios.post(
        //   `${API_BASE_URL}/auth/refresh-token`, 
        //   {
        //     cookie:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1T1hqY2V2RkVaSEd3bmRQZ04wRVozbElPRWloMDdvWiIsInJvbGUiOiJQQVRJRU5UIiwibmFtZSI6IkhhYmliIFJhaG1hbiIsImVtYWlsIjoidGhpc2lzaGFiaWIyMDA1QGdtYWlsLmNvbSIsInN0YXR1cyI6IkFDVElWRSIsImlhdCI6MTc3MjU1NzU4OCwiZXhwIjoxNzczMTYyMzg4fQ.h2yoixiy8VGK83ZaBvgRJ5u0mBxCcf7RF8NCiyne-Kg",
        //    token:"KPmt0uQf28LCiRDglLB66EJJWTUhWoN2"
        //   }, 
        //   { withCredentials: true,headers:{
            
        //   } }
        // );
         const refreshTokenCookie = await getCookie("refreshToken");
         if(!refreshTokenCookie){
          window.location.href = '/sign-in'; // বা আপনার লগইন রাউট
          return
         }
        const updatedToken = await refreshAccessToken(refreshTokenCookie)
         if(updatedToken){

           // ২. রিফ্রেশ সাকসেস হলে অরিজিনাল রিকোয়েস্টটি আবার পাঠান
           // ইন্টারসেপ্টর এখানেই রিকোয়েস্টটি মিটিয়ে ফেলবে, কম্পোনেন্ট জানবেও না যে এরর হয়েছিল
           return httpClient(originalRequest); 
         }else{
          window.location.href = '/sign-in'; // বা আপনার লগইন রাউট
         }
      } catch (refreshError) {
        // ৩. যদি রিফ্রেশ ফেইল করে (ইউজার ব্লকড বা সেশন শেষ)
        console.error("Refresh token expired or failed. Redirecting to login...");
        
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in'; // বা আপনার লগইন রাউট
        }
        return Promise.reject(refreshError);
      }
    }

    // ৪০১ ছাড়া অন্য সব এররের জন্য কম্পোনেন্ট লেভেলে এরর পাঠানো হবে (Toast দেখাবে)
    return Promise.reject(error);
  }
);

export default httpClient;
