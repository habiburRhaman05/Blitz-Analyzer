"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import httpClient from "@/lib/axios-client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { handleEmailVerification } from "@/services/auth.services";

// ==================
// Validation Schema
// ==================
const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

type FormData = z.infer<typeof otpSchema>;

export default function EmailVerificationUI() {
      const searchParams = useSearchParams();
  const email = searchParams.get("email"); 
    // alert(email)
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(120);

  const form = useForm<FormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const { register, handleSubmit, formState, reset } = form;

  // Timer Logic
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Format timer mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Submit OTP (REAL API)
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);


    try {
      
 const result = await  handleEmailVerification({email,otp:data.otp})
      if (result.success) {
        setVerified(true);
        toast.success(result.message || "Email verified successfully!");
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.message || "Verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP (REAL API)
  const handleResend = async () => {
    setIsResending(true);

    try {
      const result = await httpClient.post("/auth/resend-otp", {
        email,
        verificationType: "EMAIL_VERIFY",
      });


      if (result.data?.success) {
        toast.success(result.data?.message || "OTP resent successfully");
        setTimer(120);
        reset();
      } else {
        toast.error(result.data?.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Resend failed"
      );
    } finally {
      setIsResending(false);
    }
  };

  // UI
  return (
    <div className=" flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">

        <AnimatePresence mode="wait">
          {!verified ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-6"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Verify Your Email
                </h2>

                <p className="text-sm text-zinc-500 mt-2">
                  OTP sent to <span className="font-medium">{email}</span>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <Input
                    {...register("otp")}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    inputMode="numeric"
                    className="text-center text-lg tracking-[8px] font-semibold"
                  />

                  {formState.errors.otp && (
                    <p className="text-red-500 text-xs mt-2">
                      {formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>

              {/* Resend */}
              <div className="mt-6 text-center text-sm text-zinc-500">
                {timer > 0 ? (
                  <p>
                    Resend OTP in{" "}
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {formatTime(timer)}
                    </span>
                  </p>
                ) : (
                 
                 <button
                    onClick={handleResend}
                    disabled={isResending}
                    className="flex items-center justify-center gap-2 mx-auto text-blue-600 hover:underline"
                  >
                    {isResending ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Resend OTP
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            // SUCCESS UI
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-8 text-center"
            >
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Email Verified 🎉
              </h2>

              <p className="text-sm text-zinc-500 mt-2">
                Your email has been successfully verified.
              </p>

              <Button className="mt-6 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
               <Link href={"/sign-in"}>
              Go to Login
               </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}