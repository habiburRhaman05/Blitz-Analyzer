"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

import Logo from "@/components/global/Logo";
import { UserRole } from "@/interfaces/enums";
import UserProfile from "../modules/auth/UserProfilePopup";
import CreditWallet from "../modules/user/UserCreditCard";

export default function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Analyzer", path: "/analysis" },
    { label: "Pricing", path: "/pricing" },
    { label: "Reviews", path: "/reviews" },
    { label: "Blogs", path: "/blog" },
    { label: "Issues", path: "/issues" },
    { label: "About", path: "/about-us" },
    { label: "Contact", path: "/contact-us" },
  ];

  if (!mounted) return null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
          "h-16 md:h-20 flex items-center",
          scrolled
            ? "bg-white/80 dark:bg-[#01020c]/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <Link href="/" className="scale-90 md:scale-100 origin-left">
            <Logo />
          </Link>

          {/* CENTER: Desktop Nav (Hidden on Mobile) */}
          <nav className="hidden lg:flex items-center gap-1 bg-muted/50 border border-border/50 p-1 rounded-2xl">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-semibold transition-all rounded-xl",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-background border border-border/50 shadow-sm rounded-xl z-[-1]"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Essential Actions (Theme, Avatar, Menu) */}
          <div className="flex items-center gap-1.5 md:gap-3">
            
            {/* Theme Toggle - Always Visible */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl border border-transparent hover:border-border"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5 text-blue-600" />}
            </Button>

            {/* Auth Section - Always Visible */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block">
                    {user.user.role === UserRole.USER && <CreditWallet />}
                  </div>
                  <UserProfile user={user} />
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => router.push("/sign-in")} 
                  className="h-9 px-4 bg-primary text-white rounded-xl text-xs font-bold"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle - Visible only on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 rounded-xl bg-muted/50 border border-border"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU CONTENT: ONLY LINKS */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-[80] lg:hidden bg-background/95 backdrop-blur-2xl pt-24 px-6 pb-10"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2 mb-2">Menu</p>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl text-xl font-bold transition-all",
                    pathname === link.path 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-muted/30 text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                  <ChevronRight className={cn("w-5 h-5", pathname === link.path ? "opacity-100" : "opacity-30")} />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="h-16 md:h-20" />
    </>
  );
}