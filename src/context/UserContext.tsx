"use client";

import AppLoader from "@/components/global/AppLoader";
import { IUser } from "@/interfaces/user";
import { getMe } from "@/services/auth.services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, SetStateAction, Dispatch } from "react";

interface IUserContext {
  user: IUser | null;
  isLoading: boolean;
  isError: boolean;
  fetchUser: () => Promise<void>;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  refetch: () => void;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export default function UserContextWrapper({ children }: { children: React.ReactNode }) {
  const cacheKey = "fetch-profile-data";
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: isQueryLoading,
    isError,
    error,
    refetch,
    
  } = useQuery({
    queryKey: [cacheKey],
    queryFn: getMe,
    retry: (failureCount, error: any) => {
      // Don't retry on 401
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 0,
  });

  const [user, setUser] = useState<IUser | null>(null);

  // Update user state when query data changes
  useEffect(() => {
    if (userData?.data) {
      setUser(userData.data);
      console.log(userData.data);
    } else if (isError) {
      setUser(null);
    }
  }, [userData, isError]);

  // Handle 401 errors by redirecting to login
  useEffect(() => {
    if (isError && (error as any)?.response?.status === 401) {
      // Clear any cached user data
      queryClient.invalidateQueries({ queryKey: [cacheKey] });
      setUser(null);
      // Redirect to login page
      router.push("/login");
    }
  }, [isError, error, router, queryClient]);

  const fetchUser = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Loading overlay
  if (isQueryLoading) {
    return <AppLoader />;
  }

  const contextValue: IUserContext = {
    user,
    isLoading: isQueryLoading,
    isError,
    fetchUser,
    setUser,
    refetch,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};