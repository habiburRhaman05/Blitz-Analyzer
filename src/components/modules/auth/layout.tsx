"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/global/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export function AuthLayout({
  children,
  rightContent,
  title,
  subtitle,
  showBackButton = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left side - Form */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between animate-slideInLeft" style={{ animationDelay: "0.1s" }}>
            {/* LEFT: Logo */}
          <Link href="/" className="scale-90 md:scale-100 origin-left">
            <Logo />
          </Link>
            {showBackButton && (
              <Link
                href="/"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
            )}
          </div>

          {/* Form Container */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            {title && (
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-muted-foreground text-base">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            <p>© 2026 Blitz-Analyzer.com All rights reserved.</p>
          </div>
        </div>

        {/* Right side - Visual Content */}
        {rightContent && (
          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center bg-gradient-to-br from-primary/5 via-primary/2 to-background p-12 animate-slideInRight" style={{ animationDelay: "0.1s" }}>
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
