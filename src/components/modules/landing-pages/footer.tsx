"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Github, Send, ArrowUpRight } from "lucide-react";

import Logo from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const footerLinks = {
  Tools: [
    { label: "Resume Analyzer", href: "/analysis" },
    { label: "ATS Optimizer", href: "/analysis" },
    { label: "Templates", href: "/pricing" },
    { label: "AI Rewriter", href: "/analysis" },
  ],
  Company: [
    { label: "About", href: "/about-us" },
    { label: "Careers", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact-us" },
  ],
  Resources: [
    { label: "Documentation", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Reviews", href: "/reviews" },
    { label: "Help Center", href: "/contact-us" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background text-foreground border-t border-border transition-colors duration-300 overflow-hidden">
      <div className="container max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* TOP: Newsletter & Branding */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <Logo />
            <p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
              Empowering engineers and creatives with AI-driven ATS optimization and production-grade resume architecture.
            </p>
            <div className="flex gap-3">
              <SocialIcon href="#" icon={<Github className="w-4 h-4" />} />
              <SocialIcon href="#" icon={<Linkedin className="w-4 h-4" />} />
              <SocialIcon href="#" icon={<Twitter className="w-4 h-4" />} />
            </div>
          </div>

          {/* Newsletter / CTA Area */}
          <div className="lg:col-span-7 bg-muted/50 border border-border p-8 rounded-3xl relative overflow-hidden group">
            {/* Background Decorative Icon */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
               <Send className="w-24 h-24 -rotate-12 text-primary" />
            </div>

            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-bold tracking-tight">Stay ahead of the curve.</h4>
              <p className="text-muted-foreground text-sm max-w-sm">
                Get monthly engineering career tips and AI automation workflows delivered to your inbox.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <Input 
                  placeholder="Enter your work email" 
                  className="bg-background border-border focus:ring-1 focus:ring-primary rounded-xl h-11"
                />
                <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl px-6 h-11 transition-all active:scale-95">
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* MIDDLE: Links Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 border-t border-border">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-foreground text-sm transition-all flex items-center group/link w-fit"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover/link:opacity-100 transition-all -translate-x-1 group-hover/link:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM: Final Credits */}
        <div className="py-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs text-muted-foreground font-medium">
            <p>&copy; {currentYear} Blitz Analyzer. Built by Habib.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              System Status: All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Component ---
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300",
        "bg-muted border border-border text-muted-foreground",
        "hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/20"
      )}
    >
      {icon}
    </a>
  );
}