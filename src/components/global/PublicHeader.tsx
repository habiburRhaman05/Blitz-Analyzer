"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Zap, Menu, X, Sun, Moon, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes"; // Recommended for Next.js

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import LogoutButton from "../modules/auth/LogoutButton";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Upload Resume", path: "/upload" },
  { label: "Create Resume", path: "/create-resume" },
  { label: "Services", path: "/#services" },
  { label: "Pricing", path: "/#pricing" },
  { label: "Feedback", path: "/#feedback" },
];

export default function PublicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme icons
  useEffect(() => setMounted(true), []);

  const handleNav = (path: string) => {
    setMobileOpen(false);
    
    if (path.startsWith("/#")) {
      const targetId = path.replace("/#", "");
      if (pathname !== "/") {
        router.push("/");
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(path);
    }
  };

  const initials = user?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <Zap className="h-4 w-4 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Blitz <span className="text-primary">Analyzer</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={cn(
                "px-4 py-2 rounded-[var(--radius)] text-sm font-medium transition-all",
                pathname === link.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 hover:border-primary/30 transition-all focus:outline-none">
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-[var(--radius)]">
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/account")} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" /> Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                
                  className="text-destructive focus:bg-destructive/10 cursor-pointer"
                >
            <LogoutButton/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/sign-in")}>
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                onClick={() => router.push("/sign-up")}
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden animate-in slide-in-from-top duration-300 border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className="block w-full text-left px-4 py-3 rounded-[var(--radius)] text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
            {!user && (
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-border mt-4">
                <Button variant="outline" onClick={() => { setMobileOpen(false); router.push("/sign-in"); }}>
                  Sign In
                </Button>
                <Button className="bg-primary" onClick={() => { setMobileOpen(false); router.push("/sign-up"); }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}