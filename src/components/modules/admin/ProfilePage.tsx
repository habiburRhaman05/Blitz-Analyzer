"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import httpClient from "@/lib/axios-client";
import { useApiMutation } from "@/hooks/useApiMutation";
import { AvatarUpload } from "@/components/modules/user/ProfileAvatar";
import { useForm } from "react-hook-form";
import { IUser } from "@/interfaces/user";
import { handleProfileUpdate, revalidateProfileData } from "@/services/auth.services";
import { useMutation } from "@tanstack/react-query";

// -------------------- TYPES --------------------
interface FormValues {
    name: string;
    email: string;
    location: string;
    contactNumber: string;
}

// -------------------- COMPONENT --------------------
export function AdminProfilePage({ user }: { user: IUser }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            email: "",
            location: "",
            contactNumber: "",
        },
    });

    const saveChangeMutation = useMutation({
        mutationKey: ["update-profile"],
        mutationFn: (payload) => handleProfileUpdate(payload),

    })

    // Sync user data to form
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                location: user.loaction || "",
                contactNumber: user.contactNumber || "",
            });
        }
    }, [user, reset]);

    // Initials
    const initials =
        user?.name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U";

    // -------------------- SUBMIT --------------------
    const onSubmit = async (data: FormValues) => {
        const { email, ...payload } = data;

        const result = await saveChangeMutation.mutateAsync(payload);
        console.log(result);

        if (result?.success) {
            await revalidateProfileData()
            toast.success("Profile updated successfully!");
        }
    };


    // -------------------- UI --------------------
    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-2xl font-bold mt-5">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information
                </p>
            </motion.div>

            {/* Avatar */}
            <div className="mt-5">

                <img src={user?.profileAvatar} alt="" className="hidden" />
                {user?.profileAvatar &&
                    <AvatarUpload
                        refetch={() => { }}
                        imageUrl={user?.profileAvatar}
                        initials={user?.name?.charAt(0) || "U"}
                    />
                }

            </div>

            {/* Form */}
            <motion.div className="mt-8">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-5 sm:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input {...register("name")} className="h-11" placeholder="Enter your fullname" />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input {...register("email")} disabled className="h-11" placeholder="example@gmail.com" />
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <Input {...register("location")} className="h-11" placeholder="Loaction..." />
                                </div>

                                {/* Contact */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Contact Number
                                    </label>
                                    <Input {...register("contactNumber")} className="h-11" placeholder="Contact number" />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end mt-6">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isDirty}
                                    className="min-w-[140px]"
                                >
                                    {isSubmitting ? (
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
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}