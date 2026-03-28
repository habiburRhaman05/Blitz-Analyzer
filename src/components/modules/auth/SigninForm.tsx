'use client'


import { FormInput } from '@/components/forms/InputFeild'
import { FormPassword } from '@/components/forms/PasswordFeild'
import {
    Form
} from '@/components/ui/form'
import { handleLogin } from '@/services/auth.services'
import { LoginFormData, LoginSchema } from '@/validations-schemas/auth/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import SocialLogin from './SocialLogin'
import { UserRole } from '@/interfaces/enums'
import { useUser } from '@/context/UserContext'
import AppLoader from '@/components/global/AppLoader'
import FormSubmitButton from '@/components/forms/FromSubmitButton'

export function SignInForm() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const { fetchUser } = useUser()
    
    useEffect(() => {
        setMounted(true)
    }, [])

    const form = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema, {
            // This prevents Zod from throwing errors
       
        }),
        mode: "onChange",
        defaultValues: {
            email: '',
            password: '',
        },
        // Add this to prevent uncaught errors
        shouldUnregister: false,
    })

    const { mutateAsync: signInMutation, isPending: isLoading } = useMutation({
        mutationFn: async (data: LoginFormData) => {
            const result = await handleLogin(data)
            console.log(result)
            return result
        },
        onError: (error: any) => {
            if (error?.errors && Array.isArray(error.errors)) {
                form.clearErrors()
                error.errors.forEach((err: any) => {
                    const fieldName = err.path?.[0]
                    if (fieldName) {
                        form.setError(fieldName, {
                            type: "server",
                            message: err.message
                        })
                    }
                })
            } else {
                toast.error(error.message || "Login failed")
            }
            setShowLoading(false)
        },
        onSuccess: () => {
            setShowLoading(true)
        }
    })

    async function onSubmit(data: LoginFormData) {
        try {
            const userData = await signInMutation(data)
            if (userData?.success) {
                toast.success("You are Login Successfully")
                await fetchUser()
                if (userData.user.role !== UserRole.USER) {
                    router.push("/admin/dashboard")
                } else {
                    router.push("/dashboard")
                }
            } else {
                if (userData?.errors && Array.isArray(userData.errors)) {
                    form.clearErrors()
                    userData.errors.forEach((err: any) => {
                        const fieldName = err.path?.[0]
                        if (fieldName) {
                            form.setError(fieldName, {
                                type: "server",
                                message: err.message
                            })
                        }
                    })
                } else {
                    toast.error(userData?.message || "Login failed")
                }
                setShowLoading(false)
            }
        } catch (error: any) {
            console.error("Login Error:", error)
            toast.error(error?.message || "Something went wrong")
            setShowLoading(false)
        }
    }

    if (!mounted) return null

    return (
        <div className='relative w-full'>
            <AnimatePresence>
                {showLoading && <AppLoader />}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: showLoading ? 0 : 1 }}
                className="rounded-[2rem] border border-border bg-card/70 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl"
            >
                <div className="mb-8 text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Sign In</h2>
                    <p className="text-muted-foreground text-sm mt-2 font-medium">
                        Access your secure medical dashboard.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput
                            control={form.control}
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="example@gmail.com"
                            disabled={isLoading}
                        />

                        <FormPassword
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="*********"
                            disabled={isLoading}
                        />

                        <FormSubmitButton
                            text='Sign In'
                            className='w-full h-11 font-bold'
                            disabled={isLoading || showLoading}
                            isLoading={isLoading}
                        />

                        <p className="text-center text-xs text-muted-foreground py-2 font-medium">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/sign-up')}
                                className="text-primary font-black hover:underline underline-offset-4"
                            >
                                Sign Up
                            </button>
                        </p>
                    </form>
                </Form>

                <div className="my-6 flex items-center gap-3">
                    <div className="flex-1 border-t border-border" />
                    <span className="text-xs text-muted-foreground">or continue with</span>
                    <div className="flex-1 border-t border-border" />
                </div>

                <SocialLogin />
            </motion.div>
        </div>
    )
}