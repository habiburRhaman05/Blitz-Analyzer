"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import httpClient from "@/lib/axios-client";
import { changePassword } from "@/services/auth.services";

// -------------------- ZOD --------------------
const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof passwordSchema>;

const AccountSettingspage = () => {
  const { toast } = useToast();

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // -------------------- SUBMIT --------------------
  const onSubmit = async (formData: FormValues) => {
    setSuccess(false);
    setErrorMsg("");
    setLoading(true);

    const payload = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    try {
      const res = await changePassword(payload)

      if (res?.success) {
        setSuccess(true);
        reset();

        // ✅ SUCCESS TOAST
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully.",
        });
      } else {
        throw new Error(res?.message || "Something went wrong");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Server error";

      setErrorMsg(message);

      // ❌ ERROR TOAST
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Change your password securely
        </p>
      </motion.div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" {...register("currentPassword")} />
              {errors.currentPassword && (
                <p className="text-red-500 text-xs">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" {...register("newPassword")} />
              {errors.newPassword && (
                <p className="text-red-500 text-xs">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Inline Error */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-red-500 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inline Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-500 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  Password changed successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingspage;