"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Upload,
  Sun,
  Moon,
  Bolt
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import UserProfile from "../auth/UserProfilePopup";
import Logo from "@/components/global/Logo";
import Link from "next/link";
import CreditWallet from "./UserCreditCard";
import { UserRole } from "@/interfaces/enums";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Analysis", path: "/analysis" },
    { label: "Pricing", path: "/pricing" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-xl border-b",
        "border-b border-border/60  bg-[#f3f3f3] dark:bg-[#01020c]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* 🔷 LEFT: Logo + Sidebar */}
        <div className="flex items-center gap-3">

          <SidebarTrigger className="h-9 w-9 rounded-xl border bg-background/50 hover:bg-accent transition" />

          {/* Logo */}

          <Logo/>
        
        </div>

        {/* 🔶 CENTER: Navigation */}
        <nav className="hidden md:flex items-center gap-2 relative">

          {navLinks.map((link) => {
            const active = pathname === link.path;

            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-lg transition",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* 🔷 RIGHT: Actions */}
        <div className="flex items-center gap-2">

        

          {/* Theme Toggle */}
        <div className="w-full">
            {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
          {/* wallet */}

<div className=" w-full">
  {user && user.user.role === UserRole.USER &&
            <CreditWallet  />
         }
</div>

          {/* User */}
          {user ? (
            <UserProfile user={user} />
          ) : (
            <Button variant="outline" size="sm">
           <Link href={"/sign-in"}>
              Sign In
           </Link>
            </Button>
          )}
        </div>
      </div>

    </header>
  );
}