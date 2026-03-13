"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  CreditCard, 
  Upload, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronDown 
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import Logo from "@/components/global/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import UserProfile from "../auth/UserProfilePopup";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user,  } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for theme icons
  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = user?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const handleLogout = async () => {
    try {
      // await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        
        {/* Left Section: Sidebar & Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
          <div className="hidden sm:block">
            <Logo size="sm" />
          </div>
        </div>

        {/* Center Section: Navigation Link Buttons */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard", path: "/profile" },
            { label: "Upload", path: "/upload" },
            { label: "Pricing", path: "/billing" },
          ].map((link) => (
            <Button 
              key={link.path} 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push(link.path)}
              className={cn(
                "transition-colors rounded-[var(--radius)]",
                pathname === link.path ? "text-primary bg-primary/5" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="hidden sm:inline-flex bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
            onClick={() => router.push("/upload")}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" /> New Analysis
          </Button>

          {mounted && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Moon className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}

         {
          user ? <UserProfile user={user}/> : <Button>SignIn</Button>
         }
        </div>
      </div>
    </header>
  );
}