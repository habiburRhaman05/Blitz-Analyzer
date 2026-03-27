"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Download, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPaymentDetails } from '@/services/payment.services';
import { useQuery } from '@tanstack/react-query';
import Link from "next/link";

const PaymentDetails = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [`fetch-payment-details-${id}`],
    queryFn: () => getPaymentDetails(id),
  });
  console.log("[paymenterror",data);
  if (isLoading) return <LoadingState />;
  if (isError || !data?.success) return <ErrorState />;

  const payment = data.data;

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#fafafa] dark:bg-[#050505] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden"
      >
        {/* Success Header - Minimalist */}
        <div className="p-8 pb-0 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Payment successful
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Thank you for your purchase, {payment.user.name}.
          </p>
        </div>

        {/* Amount Section */}
        <div className="px-8 py-10 text-center">
          <div className="text-5xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-50">
            ${payment.amount.toFixed(2)}
          </div>
          <div className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-400 mt-3">
            {payment.plan.name} — {payment.plan.credits} Credits
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="px-8 pb-8 space-y-3">
          <div className="flex justify-between items-center py-3 border-t border-zinc-100 dark:border-zinc-900">
            <span className="text-sm text-zinc-500">Transaction ID</span>
            <span className="text-sm font-mono text-zinc-900 dark:text-zinc-300">
               {payment.id.slice(0, 13).toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-zinc-100 dark:border-zinc-900">
            <span className="text-sm text-zinc-500">Date</span>
            <span className="text-sm text-zinc-900 dark:text-zinc-300">
              {new Date(payment.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-zinc-100 dark:border-zinc-900">
            <span className="text-sm text-zinc-500">Payment method</span>
            <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-300">
              <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
              {payment.paymentMethod}
            </div>
          </div>
        </div>

        {/* Professional Actions */}
        <div className="p-8 bg-zinc-50/50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3">
          <Button 
            asChild
            className="w-full h-11 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black hover:opacity-90 rounded-lg font-medium transition-all"
          >
            <a href="/dashboard">
              Continue to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            asChild
            className="w-full h-11 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium"
          >
            <Link href={payment.invoiceUrl || ""} target="_blank" rel="noreferrer">
              <Download className="mr-2 h-4 w-4" /> Download PDF Receipt
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Subcomponents ---

const LoadingState = () => (
  <div className="min-h-[80vh] flex items-center justify-center p-6">
    <div className="w-full max-w-[500px] border border-zinc-100 dark:border-zinc-900 rounded-2xl p-8 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
      <Clock className="h-6 w-6 text-red-500" />
    </div>
    <h2 className="text-lg font-semibold">Payment info unavailable</h2>
    <p className="text-zinc-500 text-sm mt-1 mb-6">We couldn't fetch the details for this transaction.</p>
    <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
  </div>
);

export default PaymentDetails;