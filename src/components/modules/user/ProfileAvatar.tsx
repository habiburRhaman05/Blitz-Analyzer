"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Camera, Loader2, Upload, Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AvatarUploadProps {
  imageUrl?: string | null;
  initials: string;
  onUpload: (file: File) => Promise<string>;
}

type Status = "idle" | "preview" | "uploading" | "success";

export function AvatarUpload({
  imageUrl,
  initials,
  onUpload,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Clean up object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 1️⃣ SELECT FILE
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Clean up previous preview if any
    if (preview) URL.revokeObjectURL(preview);

    const objectUrl = URL.createObjectURL(selected);
    setFile(selected);
    setPreview(objectUrl);
    setStatus("preview");
  };

  // 2️⃣ CONFIRM UPLOAD
  const handleConfirm = async () => {
    if (!file) return;

    setStatus("uploading");

    try {
      await onUpload(file);
      setStatus("success");
      toast.success("Profile picture updated");

      // Close modal after success animation
      setTimeout(() => {
        setStatus("idle");
        setPreview(null);
        setFile(null);
        // Reset file input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 1200);
    } catch {
      toast.error("Upload failed");
      setStatus("preview"); // Stay in preview mode so user can retry or cancel
    }
  };

  // 3️⃣ CANCEL
  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Determine if avatar click should be allowed
  const isAvatarClickable = status === "idle";

  return (
    <>
      {/* Avatar */}
      <div className="relative group w-fit">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div
          onClick={() => {
            if (isAvatarClickable) fileInputRef.current?.click();
          }}
          className={isAvatarClickable ? "cursor-pointer" : "cursor-default"}
        >
          <Avatar className="h-20 w-20 ring-2 ring-border group-hover:ring-primary transition">
            <AvatarImage src={imageUrl || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {/* Hover overlay – shows status icon */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition">
            {status === "uploading" ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : status === "success" ? (
              <Check className="h-5 w-5 text-green-400" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Modal – shown when preview is available and status is not idle/success */}
      <AnimatePresence>
        {(status === "preview" || status === "uploading") && preview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-[340px] text-center space-y-5 shadow-xl"
            >
              <h3 className="font-semibold text-lg">
                {status === "uploading" ? "Uploading..." : "Preview Image"}
              </h3>

              <img
                src={preview}
                alt="preview"
                className="w-32 h-32 object-cover rounded-full mx-auto border"
              />

              {status === "uploading" ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Do you want to upload this image?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button onClick={handleConfirm}>
                      <Upload className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}