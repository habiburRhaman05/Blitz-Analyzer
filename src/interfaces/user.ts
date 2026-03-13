

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: 'DOCTOR' | 'PATIENT' | 'ADMIN' | 'SUPER_ADMIN';
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

