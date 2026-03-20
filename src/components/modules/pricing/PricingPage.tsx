'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditPackage } from '@/interfaces/pricing';
import { getAllPricingPlan } from '@/services/pricing.services';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Coins,
  Crown,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PricingCardSkeleton } from './pricingCardSkelection';
import { PricingCard } from './PricingCard';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface PricingCardProps {
  plan: CreditPackage;
  isPopular?: boolean;
  index: number;
}

// ----------------------------------------------------------------------
// Helper: Generate dynamic features based on credits
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------
// Main Component: PricingWrapper
// ----------------------------------------------------------------------
export default function PricingWrapper({ cacheKey }: { cacheKey: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [cacheKey],
    queryFn: getAllPricingPlan,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const pricingPlans: CreditPackage[] = data?.data || [];

  // Determine which plan is "popular" – e.g. the one with highest credits
  // or you can use a `isPopular` flag from the API if available.
  const popularPlanId = pricingPlans.length
    ? pricingPlans.reduce((prev, current) =>
        prev.credits > current.credits ? prev : current
      ).id
    : null;

  // Loading state: show 3 skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="text-center mb-16 space-y-4">
            <div className="h-8 w-32 bg-muted rounded-full mx-auto" />
            <div className="h-16 w-3/4 bg-muted rounded-md mx-auto" />
            <div className="h-12 w-1/2 bg-muted rounded-md mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <PricingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load pricing plans.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1 text-primary border-primary/20 bg-primary/5"
            >
              Pricing & Credits
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
          >
            Fuel your career with{' '}
            <span className="text-primary italic">Credits</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            One‑time purchase, no hidden subscriptions. Credits are deducted only
            when you use AI or export premium templates.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={plan.id === popularPlanId}
              index={index}
            />
          ))}
        </div>

        {/* Trust Footer */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-12">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold">Secure Checkout</h4>
            <p className="text-xs text-muted-foreground">
              Encrypted processing via Stripe & SSL.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <Rocket className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold">Instant Activation</h4>
            <p className="text-xs text-muted-foreground">
              Credits are added to your vault immediately.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
              <Coins className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-bold">No Expiry</h4>
            <p className="text-xs text-muted-foreground">
              Your credits never expire. Use them anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}