"use client";

import AppLoader from "@/components/global/AppLoader";
import { IUser } from "@/interfaces/user";
import { getMe } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useCallback, SetStateAction, Dispatch } from "react";

interface IUserContext {
  user: IUser | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  setUser:  Dispatch<SetStateAction<IUser | null>>
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export default function UserContextWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter()
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getMe();
      console.log(res);
      
      const userData = res?.data || null;
      setUser(userData);
      console.log(userData);
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("calling");
    
    fetchUser();
  }, [fetchUser]);



  // Loading overlay
  if (isLoading) {
    return <AppLoader />;
  }

  const contextValue: IUserContext = {
    user,
    isLoading,
    fetchUser,
    setUser
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};