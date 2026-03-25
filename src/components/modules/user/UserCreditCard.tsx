"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  Coins, 
  Sparkles, 
  ChevronRight,
  History
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getUserCredit } from "@/services/credit.services";
import { cn } from "@/lib/utils";

const CreditWallet = () => {
  const { data, isLoading } = useQuery<{ data: { balance: number } }>({
    queryKey: ["fetch-user-credit"],
    queryFn: getUserCredit,
    refetchOnWindowFocus: true,
  });

  const balance = data?.data?.balance ?? 0;

  return (
    <Popover>
      {/* Trigger: The Professional Icon Button */}
      <PopoverTrigger asChild>
        <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-background transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-primary/10 active:scale-90">
          <Wallet className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-white" />
          {balance > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      {/* Modern SaaS Style Popover Content */}
      <PopoverContent 
        align="end" 
        sideOffset={12} 
        className="w-80 overflow-hidden rounded-[24px] border border-white/10 bg-background p-0 shadow-2xl backdrop-blur-xl"
      >
        <div className="relative p-6">
          {/* Background Gradient Mesh */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-[50px]" />
          
          <div className="relative space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Current Credits
              </span>
             
            </div>

            {/* Balance Display */}
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <Skeleton className="h-10 w-24 bg-white/5" />
              ) : (
                <h2 className="text-4xl font-black tracking-tighter text-white">
                  {balance.toLocaleString()}
                </h2>
              )}
              <span className="text-sm font-medium text-zinc-500">Credits</span>
            </div>

            {/* Quick Stats/Progress (Linear Style) */}
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-medium text-zinc-500">
                  <span>Usage Limit</span>
                  <span>{((balance/1000)*100).toFixed(0)}%</span>
               </div>
               <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((balance/1000)*100, 100)}%` }}
                    className="h-full bg-gradient-to-r from-primary to-blue-500"
                  />
               </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-[12px] font-bold text-black transition-transform active:scale-95">
                <Plus className="h-4 w-4" />
                Add Credits
              </button>
              <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-[12px] font-bold text-white transition-colors hover:bg-white/10 active:scale-95">
                <History className="h-4 w-4" />
                History
              </button>
            </div>
          </div>
        </div>

       
      </PopoverContent>
    </Popover>
  );
};

export default CreditWallet;