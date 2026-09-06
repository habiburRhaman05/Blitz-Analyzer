import { envVeriables } from '@/config/envVariables';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = envVeriables.NEXT_PUBLIC_API_URL;

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
