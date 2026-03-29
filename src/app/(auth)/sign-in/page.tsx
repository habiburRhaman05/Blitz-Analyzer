"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/modules/auth/layout";
import { AuthInput } from "@/components/modules/auth/input";
import {SignInForm} from "@/components/modules/auth/SigninForm";


export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // TODO: Implement sign-in logic
    setTimeout(() => setLoading(false), 1000);
  };

  const testimonials = [
    {
      name: "Michael Carter",
      role: "Software Engineer at DevCore",
      text: "Blitz-Analyzer.com has completely transformed our testing process. It's reliable, efficient, and ensures our releases are always top-notch.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ];

  const companies = [
    "Discord",
    "Mailchimp",
    "Grammarly",
    "Attentive",
    "Hello Sign",
    "Intercom",
    "Square",
    "Dropbox",
  ];

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Sign in to access your dashboard and continue optimizing your QA process."
      rightContent={
        <div className="w-full max-w-lg space-y-12 text-black dark:text-white animate-fadeIn">
          {/* Testimonial */}
          <div className="space-y-6 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="text-5xl font-bold leading-tight">
              Revolutionize QA with Smarter Automation
            </div>
            <blockquote className="text-lg opacity-90 leading-relaxed">
              "{testimonials[0].text}"
            </blockquote>
          </div>


          {/* Companies */}
          <div className="space-y-4">
            <p className="text-sm font-semibold opacity-75 uppercase tracking-wider">
              JOIN 1K TEAMS
            </p>
            <div className="grid grid-cols-2 gap-4">
              {companies.map((company) => (
                <div
                  key={company}
                  className="text-sm font-medium opacity-75 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SignInForm/>
    </AuthLayout>
  );
}
