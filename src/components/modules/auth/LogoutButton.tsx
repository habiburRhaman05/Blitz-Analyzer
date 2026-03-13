"use client";

import { handleLogout } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoutHandler = async () => {
    setLoading(true);
    setError(null);
    
    try {
     const result = await handleLogout()
     console.log(result);
     
     if(result?.success){
      toast.success(result?.message)

         router.push("/sign-in");
      router.refresh(); // Clears any cached server-side data
      
     }else{
      toast.error(result?.message)
  
     }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <button 
        onClick={handleLogoutHandler} 
        disabled={loading}
        className="  flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-red-600 rounded-full animate-spin border-t-transparent"></span>
            Logging out...
          </>
        ) : (
          "Logout"
        )}
      </button>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default LogoutButton;