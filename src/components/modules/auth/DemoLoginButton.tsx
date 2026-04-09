'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUser } from '@/context/UserContext'
import { UserRole } from '@/interfaces/enums'
import { handleLogin } from '@/services/auth.services'
import { LoginFormData } from '@/validations-schemas/auth/auth.schema'
import AppLoader from '@/components/global/AppLoader'

const DemoLoginButton = ({login,isLoading}) => {


    const demoLogin = {
        admin: { email: "admin@blitz-analyzer.com", password: "admin@blitz" },
        user: { email: "devhabib2005@gmail.com", password: "12345678" },
        manager: { email: "admin@gmail.com", password: "12345678" }
    }

 

    // Triggered automatically when a role is selected from the dropdown
    async function handleDemoSelect(role: keyof typeof demoLogin) {
       await login(demoLogin[role])
    }

    return (
        <div className='flex items-center w-full justify-center'>
    
            {/* Modern UI Select */}
            <Select 
              onValueChange={(value: keyof typeof demoLogin) => handleDemoSelect(value)} 
              disabled={isLoading}
            >
                <SelectTrigger className="w-[220px] bg-background/50 backdrop-blur-md border-white/10 hover:bg-accent/50 transition-all duration-300">
                    {/* Conditional Loading UI inside the Select Trigger */}
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm font-medium">Authenticating...</span>
                        </div>
                    ) : (
                        <SelectValue placeholder="Quick Demo Login" />
                    )}
                </SelectTrigger>
                
                <SelectContent className="backdrop-blur-xl bg-background/80 border-white/10 shadow-xl rounded-xl">
                    <SelectItem value="user" className="cursor-pointer focus:bg-primary/20">
                        Login as User
                    </SelectItem>
                    <SelectItem value="manager" className="cursor-pointer focus:bg-primary/20">
                        Login as Manager
                    </SelectItem>
                    <SelectItem value="admin" className="cursor-pointer focus:bg-primary/20">
                        Login as Admin
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default DemoLoginButton