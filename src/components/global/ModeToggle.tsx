"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"; 

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border border-transparent hover:border-border bg-slate-50 dark:bg-zinc-900/50 transition-all focus-visible:ring-0"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl mt-2 min-w-[140px] backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-slate-200 dark:border-zinc-800 p-1">
        
  
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center justify-between rounded-lg cursor-pointer py-2 px-2.5 transition-colors focus:bg-slate-100 dark:focus:bg-zinc-900",
            theme === "light" && "bg-slate-100 dark:bg-zinc-900 text-amber-500 font-semibold"
          )}
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span className={cn("text-sm", theme === "light" ? "text-amber-600 dark:text-amber-400" : "font-medium")}>Light</span>
          </div>
          {theme === "light" && <Check className="w-3.5 h-3.5 text-amber-500" />}
        </DropdownMenuItem>

    
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center justify-between rounded-lg cursor-pointer py-2 px-2.5 transition-colors focus:bg-slate-100 dark:focus:bg-zinc-900",
            theme === "dark" && "bg-slate-100 dark:bg-zinc-900 text-blue-400 font-semibold"
          )}
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-400" />
            <span className={cn("text-sm", theme === "dark" ? "text-blue-400" : "font-medium")}>Dark</span>
          </div>
          {theme === "dark" && <Check className="w-3.5 h-3.5 text-blue-400" />}
        </DropdownMenuItem>

  
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center justify-between rounded-lg cursor-pointer py-2 px-2.5 transition-colors focus:bg-slate-100 dark:focus:bg-zinc-900",
            theme === "system" && "bg-slate-100 dark:bg-zinc-900 font-semibold"
          )}
        >
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-slate-500" />
            <span className={cn("text-sm", theme === "system" ? "text-slate-900 dark:text-zinc-100" : "font-medium")}>System</span>
          </div>
          {theme === "system" && <Check className="w-3.5 h-3.5 text-slate-500" />}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}