"use client"

import React, { useState, useEffect, useRef } from 'react'
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ProfessionalOTP() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
  const [status, setStatus] = useState<Status>('idle')
  const [timer, setTimer] = useState(59)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const handleSubmit = async () => {
    setStatus('submitting')
    
  
  }

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className={`w-full max-w-md transition-all duration-500 transform ${status === 'error' ? 'animate-shake' : ''}`}>
        
        {/* Main Card */}
        <div className="bg-card border border-border shadow-2xl rounded-[var(--radius)] overflow-hidden">
          
          {/* Header Accent */}
          <div className={`h-1.5 w-full transition-colors duration-500 ${
            status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-destructive' : 'bg-primary'
          }`} />

          <div className="p-8">
            {/* 1. SUCCESS UI */}
            {status === 'success' ? (
              <div className="flex flex-col items-center text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Verification Complete</h1>
                <p className="text-muted-foreground mb-8">Your identity has been confirmed. Welcome back!</p>
                <button className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-[var(--radius)] flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* 2. INPUT & ERROR UI */
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground text-balance text-center">Check your email</h1>
                <p className="text-sm text-muted-foreground text-center mt-2 mb-8">
                  We've sent a 6-digit code to <span className="text-foreground font-medium">user@example.com</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex gap-2 mb-8">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      disabled={status === 'submitting'}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-[var(--radius)] border-2 bg-background transition-all outline-none
                        ${status === 'error' ? 'border-destructive text-destructive animate-pulse' : 'border-muted focus:border-primary focus:ring-4 focus:ring-primary/10'}
                      `}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-destructive text-sm mb-6 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Invalid code. Please try again.</span>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  onClick={handleSubmit}
                  disabled={status === 'submitting' || otp.some(d => !d)}
                  className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-[var(--radius)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                {/* Resend Logic */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    {timer > 0 ? (
                      <span className="text-primary font-medium">Wait {timer}s</span>
                    ) : (
                      <button 
                        onClick={() => setTimer(59)}
                        className="text-primary font-bold hover:underline underline-offset-4"
                      >
                        Resend Now
                      </button>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Support */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by SecureAuth. Having trouble? <a href="#" className="hover:text-primary underline transition-colors">Contact Support</a>
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}