"use client";

import { createContext, useContext, useEffect, useState } from "react";


interface IUserContext {
  user: null,
  isLoading:boolean
}
export const UserContext = createContext<IUserContext | undefined>(undefined);

export default function UserContextWrapper({ children }: { children: React.ReactNode }) {
  const [userPayload, setUserPayload] = useState<{ user: any; isLoading: boolean }>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("")
        setUserPayload({ user: res?.data || null, isLoading: false });
      } catch (err) {
        console.error(err);
        setUserPayload({ user: null, isLoading: false });
      }
    };

    fetchUser();
  }, []);

  // Loading overlay
  if (userPayload.isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
        hello Loading...
      </div>
    );
  }

  return <UserContext.Provider value={userPayload}>{children}</UserContext.Provider>;
}

export const useUser = () => { const context = useContext(UserContext); if (context === undefined) { throw new Error('useUser must be used within a UserContextProvider'); } return context; };