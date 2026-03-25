"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  CreditCard, 
  Clock, 
  ArrowRight,
  History,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useUser } from '@/context/UserContext';
import { getUserPaymentHistory } from '@/services/payment.services';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type SortKeys = 'createdAt' | 'amount';
type SortOrder = 'asc' | 'desc';

const PaymentListing = () => {
  const { user } = useUser();
  const [sortKey, setSortKey] = useState<SortKeys>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const { data, isLoading, isError } = useQuery({
    queryKey: [`fetch-user-payment-history-${user?.id}`],
    queryFn: () => getUserPaymentHistory(user?.id as string),
    enabled: !!user?.id,
  });

  
  const handleSort = (key: SortKeys) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const payments = useMemo(() => {
    if (!data?.data) return [];
    
    return [...data.data].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (sortOrder === 'asc') return (valA as number) - (valB as number);
      return (valB as number) - (valA as number);
    });
  }, [data, sortKey, sortOrder]);

  if (isError) return <ErrorState />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10 bg-background min-h-screen">
      
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary mb-1">
            <History className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Billing</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment History</h1>
          <p className="text-muted-foreground text-sm">Review your transactions and manage invoices.</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-muted/30">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">Reference</th>
                
                {/* Sortable Date Header */}
                <th 
                  className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Date {sortKey === 'createdAt' ? (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </th>

                {/* Sortable Amount Header */}
                <th 
                  className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount {sortKey === 'amount' ? (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
                  </div>
                </th>

                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                payments.map((item: any, idx: number) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-muted/20 transition-all"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{item.plan.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">#{item.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-foreground">
                        ${(item.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          item.status === "SUCCESS" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-400"
                        )} />
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider",
                          item.status === "SUCCESS" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-all"
                      >
                        <a href={item.invoiceUrl} target="_blank" rel="noreferrer">
                          <Download className="h-4 w-4 mr-2" /> Receipt
                        </a>
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && payments.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center">
             <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <CreditCard className="h-6 w-6" />
             </div>
             <p className="text-sm font-semibold text-foreground">No payment history</p>
             <p className="text-xs text-muted-foreground mt-1">Your transactions will appear here.</p>
          </div>
        )}
      </div>

      {/* Support Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-dashed border-border bg-muted/10">
        <p className="text-sm text-muted-foreground font-medium">Need help with a specific transaction?</p>
        <Button variant="ghost" className="text-foreground font-bold hover:bg-transparent p-0">
          Contact Support <ArrowRight className="ml-2 h-4 w-4 text-primary" />
        </Button>
      </div>
    </div>
  );
};



const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i}>
        <td className="px-6 py-5"><Skeleton className="h-4 w-32 animate-pulse" /></td>
        <td className="px-6 py-5"><Skeleton className="h-4 w-24 animate-pulse" /></td>
        <td className="px-6 py-5"><Skeleton className="h-4 w-16 animate-pulse" /></td>
        <td className="px-6 py-5"><Skeleton className="h-4 w-20 rounded-full animate-pulse" /></td>
        <td className="px-6 py-5 text-right"><Skeleton className="h-8 w-16 rounded-lg ml-auto animate-pulse" /></td>
      </tr>
    ))}
  </>
);

const ErrorState = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
    <div className="bg-destructive/10 p-4 rounded-full">
        <CreditCard className="h-6 w-6 text-destructive" />
    </div>
    <h3 className="font-bold text-lg">Unable to load billing</h3>
    <p className="text-muted-foreground text-sm max-w-xs">We encountered an error while fetching your history. Please try again.</p>
    <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
  </div>
);

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}

export default PaymentListing;