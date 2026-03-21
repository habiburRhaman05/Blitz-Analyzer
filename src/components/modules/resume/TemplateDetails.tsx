'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Crown, 
  Zap, 
  Target, 
  Layout, 
  Briefcase, 
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Loader
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useApiQuery } from '@/hooks/useApiQuery';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useUser } from '@/context/UserContext';
import { useApiMutation } from '@/hooks/useApiMutation';
import { getUserCredit } from '@/services/credit.services';

interface TemplateDetailsProps {
  id: string;
}

const TemplateDetails = ({ id }: TemplateDetailsProps) => {
  const router = useRouter();
  // --- State for Credit Logic ---
  const {user} = useUser()
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLowCreditAlert, setShowLowCreditAlert] = useState(false);
  const { data, isFetching } = useApiQuery(
    ["template", id],
    `/template/templateDetails/${id}`,
    "axios",
    { staleTime: 1000 * 60 * 5 }
  );

  const initlizeResumeMutation = useApiMutation({
    actionName:"initlize-resume",
    actionType:"SERVER_SIDE",
    endpoint:"/resume/initlize-resume",
    method:"POST"
  })
  const checkCredit = useApiMutation({
    actionName:"initlize-resume",
    actionType:"SERVER_SIDE",
    endpoint:"/resume/initlize-resume",
    method:"POST"
  })

  // --- Handlers ---
  const handleUseTemplateClick =async () => {
    if(user && user.wallet.balance < 10){
  setShowLowCreditAlert(true)
return
}

   const result = await initlizeResumeMutation.mutateAsync({
    templateId:id
 })
 

window.location.href = `/dashboard/templates/${id}/builder/${result.data.id}`
  
  };



  const template:any = data?.data;

  if (isFetching) return <LoadingSkeleton />;

  if (!template) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
      <p className="text-muted-foreground">Template data not found.</p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Top Navigation */}
      <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Library
          </Button>
          <div className="flex items-center gap-4">
             {template.isPremium && (
               <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 gap-1">
                 <Crown className="h-3 w-3" /> Premium Template
               </Badge>
             )}
             <Button 
               onClick={handleUseTemplateClick} 
               disabled={initlizeResumeMutation.isPending}
               className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
             >
                Use Template {initlizeResumeMutation.isPending ?  <Loader className="ml-2 h-4 w-4" /> :  <ArrowRight className="ml-2 h-4 w-4" />}
             </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto mt-10 px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Left Column: Interactive Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-28 space-y-6">
              <div className="group relative overflow-hidden rounded-2xl border-4 border-card bg-card shadow-2xl transition-all hover:shadow-primary/5">
                <img 
                  src={template.previewUrl} 
                  alt={template.name}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card p-4 text-center">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price</p>
                   <p className="text-2xl font-bold">{template.price === 0 ? "Free" : `$${template.price}`}</p>
                </div>
                <div className="rounded-xl border bg-card p-4 text-center">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sections</p>
                   <p className="text-2xl font-bold">{template.sections.length}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Details & Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-10"
          >
            {/* Header Info */}
            <section className="space-y-4">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                {template.slug.replace('-', ' ').toUpperCase()}
              </Badge>
              <h1 className="text-5xl font-bold tracking-tighter">{template.name}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {template.descriptions.core_details}
              </p>
            </section>

            <Separator className="bg-border/60" />

            {/* Why This Template? */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold">Why choose this?</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {template.descriptions.whyBest}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.descriptions.benefits.map((benefit: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Target Audience */}
            <section className="rounded-2xl bg-card border p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <Target className="h-6 w-6 text-primary" />
                 <h3 className="text-xl font-bold">Ideal For</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {template.descriptions.targetUser}
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-primary italic">
                 <Briefcase className="h-4 w-4" />
                 {template.descriptions.whichNeedToUseIt}
              </div>
            </section>

            {/* Sections Breakdown */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Layout className="h-6 w-6 text-muted-foreground" />
                <h3 className="text-xl font-bold">Included Sections</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* {template.sections.map((section: string) => (
                  <Badge key={section} variant="secondary" className="px-4 py-1.5 rounded-full capitalize">
                    {section}
                  </Badge>
                ))} */}
              </div>
            </section>

            {/* Trust Footer */}
            <div className="pt-6">
               <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2 text-xs font-medium">
                     <ShieldCheck className="h-4 w-4" /> ATS Friendly
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                     <CheckCircle2 className="h-4 w-4" /> Export Ready
                  </div>
               </div>
            </div>
          </motion.div>
      {/* --- LOW CREDIT ALERT --- */}
      <AlertDialog open={showLowCreditAlert} onOpenChange={setShowLowCreditAlert}>
        <AlertDialogContent className="rounded-3xl border-2 border-destructive/20">
          <AlertDialogHeader className="items-center text-center">
            <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl">Insufficient Credits</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You need <span className="font-bold">10 credits</span> to unlock this template. 
              Your current balance is <span className="font-bold text-destructive">{user?.wallet?.balance} credits</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex-col sm:flex-row gap-3">
            <AlertDialogCancel className="rounded-full w-full">Maybe Later</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => router.push('/pricing')}
              className="rounded-full bg-primary px-8 w-full shadow-lg shadow-primary/30"
            >
              Top Up Credits
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const LoadingSkeleton = () => (
  <div className="container mx-auto px-6 py-20 space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
      <div className="lg:col-span-7 space-y-8">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export default TemplateDetails;