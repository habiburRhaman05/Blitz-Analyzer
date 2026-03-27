"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Camera, Loader2, Upload, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import httpClient from "@/lib/axios-client";
import { ApiResponse } from "@/interfaces/response";
import { IBaseUser, IUser } from "@/interfaces/user";
import { handleAvatarUpload, handleChangeAvatar } from "@/services/auth.services";

interface AvatarUploadProps {
  imageUrl?: string | null;
  initials: string;
  refetch:any
}

type Status = "idle" | "generating_preview" | "preview_ready" | "uploading" | "success";

export function AvatarUpload({ imageUrl, initials,refetch }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(imageUrl || null);
  const [file, setFile] = useState<File | null>(null);
  
  const requestAbort = new AbortController();
  // Clean up preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 1. SELECT FILE: Uploads immediately to get a server preview URL
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus("generating_preview");

    const formData = new FormData();
  formData.append("avatar", selectedFile); 

    try {
      // Fetching the preview/temp URL from your API
      const response =  await handleAvatarUpload(formData)
      setPreview(response.data.data.secure_url); 
      setStatus("preview_ready");
    } catch (error) {
      toast.error("Failed to process image");
      reset();
    }
  };

  // 2. CONFIRM: Finalize the upload
 const handleConfirm = async () => {
    if (!file) return;
    setStatus("uploading");
     const savedResult = await handleChangeAvatar(preview as string);
    console.log(savedResult);
    if(savedResult?.success){
      toast.success("Your Profile Updated Successfully")
      setPreview("success")
    setStatus("success");

 setProfileImage(savedResult.data?.image!)
 setTimeout(() => {
    setStatus("idle");
 }, 2000);

    }else{
      toast.success("Failed Your Updated Profile")
    setStatus("idle");
    }
  };

  const reset = () => {
    setStatus("idle");
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="relative group w-fit cursor-pointer">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div onClick={() => status === "idle" && fileInputRef.current?.click()}>
          <Avatar className="h-24 w-24 ring-2 ring-border transition group-hover:ring-primary">
            <AvatarImage src={profileImage || undefined} />
            <AvatarFallback className="text-lg bg-muted">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={status !== "idle"} 
      onOpenChange={(open) => {

    if (open) {

      if (status === "uploading") return;


      reset(); 
    }
  }}
      >
        <DialogContent className="sm:max-w-[380px] overflow-hidden">
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            
            {/* STATE: GENERATING PREVIEW (Initial API Call) */}
            {status === "generating_preview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="font-medium">Processing your image...</p>
              </motion.div>
            )}

            {/* STATE: PREVIEW READY OR FINAL UPLOADING */}
            {(status === "preview_ready" || status === "uploading") && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-6 w-full">
                <div className="relative mx-auto w-40 h-40">
                  <img
                    src={preview || ""}
                    alt="Preview"
                    className={`w-full h-full object-cover rounded-full border-4 border-background shadow-lg ${
                      status === "uploading" ? "brightness-50 blur-[2px]" : ""
                    }`}
                  />
                  {status === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {status === "uploading" ? "Saving..." : "Use this photo?"}
                  </h3>
                  
                  {status === "preview_ready" && (
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={reset}>
                        <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                      <Button className="flex-1" onClick={handleConfirm}>
                        <Upload className="h-4 w-4 mr-2" /> Confirm
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STATE: SUCCESS */}
            {status === "success" && (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-center space-y-4">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-xl font-bold text-green-600">Updated!</p>
              </motion.div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}