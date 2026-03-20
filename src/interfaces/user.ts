import { AnalysisResult } from "./analysis";


export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  contactNumber: string;
  location: string;
  experienceLevel: string;
  profession: string;
  profileAvatar:string
  isFreeCreditClaim:boolean
  analysisHistory:AnalysisResult[]
  wallet:{
    balance:number
  }
  user:IBaseUser
}


export interface IBaseUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role:  'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BANNED' | 'DELETED';
  needPasswordChange: boolean;
  emailVerified: boolean;
  isDeleted: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // Optional Relations
  sessions?: any[];
  accounts?: any[];
}
