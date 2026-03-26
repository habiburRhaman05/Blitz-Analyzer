"use client";

import { useState, useMemo, useRef, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Loader2, Upload, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import ClaimFreeCredits from "./ClamFreeCredit";
import { AvatarUpload } from "./ProfileAvatar";
import httpClient from "@/lib/axios-client";
import { log } from "handlebars/runtime";
import { useApiMutation } from "@/hooks/useApiMutation";
import { handleChangeAvatar } from "@/services/auth.services";


// AvatarUpload Component

interface AvatarUploadProps {
  imageUrl?: string | null;
  initials: string;
  onUpload: (file: File) => Promise<void>;
}




// Main AccountPage Component

export default function AccountPage() {
  const { user, isLoading ,refetch,setUser} = useUser();


  // Initial form state from user data
  const initialForm = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      profession: user?.profession || "",
      experienceLevel: user?.experienceLevel || "",
      location: user?.location || "",
      contactNumber: user?.contactNumber || "",
    }),
    [user]
  );

  const saveChangeMutation = useApiMutation({
    endpoint:"/auth/update-profile",
    actionName:"save changes - update profile",
    actionType:"SERVER_SIDE",
    method:"PUT"
  })

  const [form, setForm] = useState(initialForm);

  // Compute if form has changes
  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  // Initials for avatar fallback
  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";


  // Handle save changes
  const handleSave = async () => {
    
   
   const {email,...refindPayload} =  form;
 
    
   const result = await saveChangeMutation.mutateAsync(refindPayload);
   console.log(result);
   
   if(result?.success){
    setUser(result.data)
    toast.success("Profile updated successfully!");
   }
    
    // In a real app you would update the context with new values
  };


  useEffect(()=>{
    if(user){
      setForm({
             name: user?.name || "",
      email: user?.email || "",
      profession: user?.profession || "",
      experienceLevel: user?.experienceLevel || "",
      location: user?.location || "",
      contactNumber: user?.contactNumber || "",
      })
    }
  },[user,isLoading])
  

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
        // Inside your Navbar component, after the logo or before the theme switch:

        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 md:py-8">

{!user?.isFreeCreditClaim && <ClaimFreeCredits userId={user?.id}/>}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mt-5">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal information and preferences</p>
      </motion.div>

<img src={user?.profileAvatar} alt="" className="hidden" />
   {user?.profileAvatar && 
   <AvatarUpload
   refetch={refetch}
  imageUrl={user?.profileAvatar}
  initials={user?.name?.charAt(0) || "U"}
  
  onUpload={async (uploadedUrl) => {
    // Replace with actual API call
     const response = await handleChangeAvatar(uploadedUrl);
    return response.data
   
  }}
/>
   }

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11 bg-card border-border focus-visible:ring-1"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={form.email}
                  disabled
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 bg-card border-border focus-visible:ring-1"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Profession</label>
                <Input
                  value={form.profession}
                  onChange={(e) => setForm({ ...form, profession: e.target.value })}
                  className="h-11 bg-card border-border focus-visible:ring-1"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <Input
                  value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                  className="h-11 bg-card border-border focus-visible:ring-1"
                  placeholder="e.g., Senior, Junior"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="h-11 bg-card border-border focus-visible:ring-1"
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Number</label>
                <Input
                  value={form.contactNumber}
                  onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                  className="h-11 bg-card border-border focus-visible:ring-1"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saveChangeMutation.isPending || !isDirty}
                className="min-w-[140px]"
              >
                {saveChangeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}