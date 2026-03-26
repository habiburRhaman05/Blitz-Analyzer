"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Plus,
  History,
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
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreditWallet = () => {
  const { data, isLoading } = useQuery<{ data: { balance: number } }>({
    queryKey: ["fetch-user-credit"],
    queryFn: getUserCredit,
    refetchOnWindowFocus: true,
  });

  const balance = data?.data?.balance ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group relative flex h-10 w-10 items-center justify-center rounded-xl",
            "border border-border bg-background transition-all",
            "hover:bg-accent hover:ring-4 hover:ring-primary/10 active:scale-90"
          )}
        >
          <Wallet className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          {balance > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-80 overflow-hidden rounded-[24px] border border-border bg-background p-0 shadow-2xl backdrop-blur-xl"
      >
        <div className="relative p-6">
          {/* Background Gradient */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-[50px]" />

          <div className="relative space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Current Credits
              </span>
            </div>

            {/* Balance Display */}
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <Skeleton className="h-10 w-24 bg-muted" />
              ) : (
                <h2 className="text-4xl font-black tracking-tighter text-foreground">
                  {balance.toLocaleString()}
                </h2>
              )}
              <span className="text-sm font-medium text-muted-foreground">Credits</span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                <span>Usage Limit</span>
                <span>{((balance / 1000) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-primary to-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="default" className="h-10 rounded-xl text-[12px] font-bold">
                <Link href="/pricing">
                  <Plus className="h-4 w-4" />
                  Add Credits
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-xl text-[12px] font-bold">
                <Link href="/dashboard/payments">
                  <History className="h-4 w-4" />
                  History
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreditWallet;