'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select' // Added Select imports
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useApiMutation } from '@/hooks/useApiMutation'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SocialLogin from './SocialLogin'
import { RegisterFormData, RegisterSchema } from '@/validations-schemas/auth/auth.schema'

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'USER', // Added default role
      acceptTerms: false,
    },
  })

  const { mutateAsync: handleSignup, isPending: isLoading } = useApiMutation({
    method: "POST",
    endpoint: "/auth/register",
    actionName: "Register User",
    actionType: "SERVER_SIDE",
  })

  async function onSubmit(data: RegisterFormData) {
    const payload = {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role, // Sending role to server
    }

    const result = await handleSignup(payload);

    if (result.success) {
      const url = `/verify-email?email=${result.data.user.email}`
      router.push(url)
    }
    setIsModalOpen(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Habibur Rahman" {...field} disabled={isLoading} className="h-9" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Role Field - Select Menu */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User (Standard)</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Email Address */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="habib@example.com" {...field} disabled={isLoading} className="h-9" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                      className="h-9 pr-10"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Terms */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2 space-y-0 py-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <FormLabel className="text-xs font-normal leading-tight cursor-pointer">
                  I agree to the Terms & Conditions and Privacy Policy
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-10 font-semibold" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Create Account'}
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <SocialLogin />

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={() => router.push('/sign-in')} 
              className="text-primary font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </Form>
    </motion.div>
  )
}