import React from 'react'
import {motion} from "framer-motion"
import { Activity, Loader2 } from 'lucide-react'
const SignInSuccessLoader = () => {
  return (
     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                                <Activity className="h-8 w-8 text-primary-foreground animate-pulse" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <h3 className="text-lg font-bold tracking-tight">Preparing your portal</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span>Redirecting...</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
  )
}

export default SignInSuccessLoader