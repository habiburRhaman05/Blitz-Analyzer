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
  Loader,
  Star,
  FileText,
  ThumbsUp
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '@/context/UserContext';
import { useApiMutation } from '@/hooks/useApiMutation';
import { getUserCredit } from '@/services/credit.services';
import { getAllTemplateDetailsPublic, getAllTemplatePublic } from '@/services/admin.services';
import { useQuery } from '@tanstack/react-query';

interface TemplateDetailsProps {
  id: string;
}

const TemplateDetails = ({ id }: TemplateDetailsProps) => {
  const router = useRouter();
  const {user} = useUser()
  const [showLowCreditAlert, setShowLowCreditAlert] = useState(false);

  const { data,isFetching } = useQuery(
    {
      queryKey:[`templates-${id}`],
      queryFn:()=>getAllTemplateDetailsPublic(id)

    }
  )
console.log(data);

  const initlizeResumeMutation = useApiMutation({
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
 
router.push(`/dashboard/templates/${id}/builder/${result.data.id}`)
  
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
          {template.descriptions?.whyBest ?   <>
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
          </> :            <section className="space-y-6">{template.descriptions}</section>
}
          
        

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

            {/* Reviews Section */}
            <TemplateReviews />
          </motion.div>
      {/* Related Templates */}
      <div className="col-span-full">
        <RelatedTemplates currentId={id} />
      </div>

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

// --- Mock Reviews Data ---
const mockReviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    date: "2 weeks ago",
    comment: "This template helped me land 3 interviews in one week. The ATS formatting is perfect and recruiters loved the clean layout.",
    helpful: 24,
  },
  {
    id: 2,
    name: "James Carter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 4,
    date: "1 month ago",
    comment: "Very professional look. Easy to customize and the sections are well organized. Would love to see more color options.",
    helpful: 18,
  },
  {
    id: 3,
    name: "Emily Nguyen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    date: "1 month ago",
    comment: "Best template I've used. The ATS score went from 62% to 94% after switching to this layout. Highly recommend!",
    helpful: 31,
  },
];

function TemplateReviews() {
  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <section className="space-y-6 pt-4">
      <Separator className="bg-border/60" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Reviews & Ratings</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{avgRating}</span>
              <span className="text-xs text-muted-foreground">({mockReviews.length} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="rounded-2xl border bg-card/50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{review.helpful} found this helpful</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedTemplates({ currentId }: { currentId: string }) {
  const { data } = useQuery({
    queryKey: ["templates-list"],
    queryFn: () => getAllTemplatePublic(),
  });

  const router = useRouter();
  const templates = (data?.data || []).filter((t: { id: string }) => t.id !== currentId).slice(0, 4);

  if (templates.length === 0) return null;

  return (
    <section className="mt-16 space-y-8">
      <Separator className="bg-border/60" />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-bold">Related Templates</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((t: { id: string; name: string; previewUrl: string; isPremium: boolean; price: number; sections: string[] }) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -4 }}
            onClick={() => router.push(`/dashboard/templates/${t.id}?mode=template`)}
            className="group cursor-pointer rounded-2xl border overflow-hidden bg-card hover:border-primary/50 hover:shadow-xl transition-all"
          >
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
              <img src={t.previewUrl} alt={t.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              {t.isPremium && (
                <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white border-none text-[10px] shadow-lg">
                  <Crown className="h-2.5 w-2.5 mr-1" /> Premium
                </Badge>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold group-hover:text-primary transition-colors truncate">{t.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{t.sections.length} sections</span>
                <span className="text-xs font-bold">{t.price === 0 ? "Free" : `$${t.price}`}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

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