'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { envVeriables } from '@/config/envVariables';
import { useUser } from '@/context/UserContext';
import { useApiMutation } from '@/hooks/useApiMutation';
import { UserRole } from '@/interfaces/enums';
import { CreditPackage } from '@/interfaces/pricing';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Coins,
  Crown,
  Loader2,
  Sparkles,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface PricingCardProps {
  plan: CreditPackage;
  isPopular?: boolean;
  index: number;
}
const getFeaturesForCredits = (credits: number): string[] => {
  if (credits <= 100) {
    return [
      `${credits} AI Generation Credits`,
      'Access to 5 Basic Templates',
      'Standard PDF Export',
      '7‑Day History Retention',
    ];
  }
  if (credits <= 500) {
    return [
      `${credits} AI Generation Credits`,
      'Access to All Premium Templates',
      'ATS Optimization Audit',
      'Unlimited PDF & Docx Exports',
      'Priority AI Processing',
    ];
  }
  return [
    `${credits} AI Generation Credits`,
    'White‑label PDF Branding',
    'Advanced AI Cover Letter Builder',
    'Lifetime Document Storage',
    'Dedicated Priority Support',
  ];
};

// ----------------------------------------------------------------------
// Helper: Choose icon based on plan name or index
// ----------------------------------------------------------------------
const getPlanIcon = (name: string, index: number) => {
  const lower = name.toLowerCase();
  if (lower.includes('starter') || lower.includes('basic')) {
    return <Zap className="h-6 w-6 text-blue-500" />;
  }
  if (lower.includes('pro') || lower.includes('professional')) {
    return <Sparkles className="h-6 w-6 text-primary" />;
  }
  if (lower.includes('elite') || lower.includes('growth') || lower.includes('premium')) {
    return <Crown className="h-6 w-6 text-amber-500" />;
  }
  // fallback based on index
  if (index === 0) return <Zap className="h-6 w-6 text-blue-500" />;
  if (index === 1) return <Sparkles className="h-6 w-6 text-primary" />;
  return <Crown className="h-6 w-6 text-amber-500" />;
};


export const PricingCard = ({ plan, isPopular = false, index }: PricingCardProps) => {
  const features = getFeaturesForCredits(plan.credits);
  const icon = getPlanIcon(plan.name, index);
  const router = useRouter();
  const { user } = useUser();


  const buyCreditMutation = useApiMutation({
    endpoint: "/payment/buy-credit",
    actionName: "Buy Credit",
    actionType: "SERVER_SIDE",
    method: "POST",

  })

  const handleBuyCredit = async (planId: string) => {
    if (!user || user.user.role !== UserRole.USER) {
      toast.error("Please Login First To Buy Credit")
      router.push("/sign-in")
    }
    const payload = {
      planId,
      "cancelUrl": `${envVeriables.APP_URL}/payment/cancel`,
      "successUrl": `${envVeriables.APP_URL}/payment/success`
    }
    const result = await buyCreditMutation.mutateAsync(payload)
    if (result.success) {
      window.location.href = result.data.checkoutUrl
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 bg-card/50 backdrop-blur-sm ${isPopular
          ? 'border-primary ring-2 ring-primary/20 shadow-xl'
          : 'border-border'
        }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
            Most Popular
          </Badge>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-secondary border border-border/50">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{plan.name}</h3>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight">
            ${plan.price}
          </span>
          <span className="text-muted-foreground font-medium">one‑time</span>
        </div>
        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg w-fit">
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-primary">
            {plan.credits} Credits Included
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <p className="text-sm text-muted-foreground font-medium">
          {
            `Get ${plan.credits} credits to boost your job search.`}
        </p>
        <div className="space-y-3 pt-4">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="h-3 w-3 text-emerald-500" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant={isPopular ? 'default' : 'outline'}
        onClick={() => handleBuyCredit(plan.id)}
        disabled={buyCreditMutation.isPending}
        className={`w-full h-12 rounded-full font-bold group relative overflow-hidden transition-all ${isPopular ? 'shadow-lg shadow-primary/20' : ''
          } ${buyCreditMutation.isPending ? 'cursor-not-allowed opacity-80' : 'active:scale-95'}`}
      >
        {buyCreditMutation.isPending ? (
          <>
            <span className="opacity-0">Get {plan.credits} Credits</span>
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <Loader2 className='animate-spin mr-3' />
              <span>Processing...</span>
            </div>
          </>
        ) : (
          <>
            Get {plan.credits} Credits
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </motion.div>
  );
};