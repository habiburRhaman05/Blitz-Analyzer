// "use client"
// import { AnimatedCard, PageLayout } from "@/components/shared";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useApiMutation } from "@/hooks/useApiMutation";
// import { useApiQuery } from "@/hooks/useApiQuery";
// import { updateIssue } from "@/services/issuse.services";
// import {
//     MessageSquare,
//     Send
// } from "lucide-react";
// import { useState } from "react";
// import { useStackId } from "recharts/types/cartesian/BarStack";
// import { toast } from "sonner";




// const statusColors: Record<string, string> = {
//   PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
//   IN_PROGRESS: "bg-primary/10 text-primary border-primary/20",
//   RESOLVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
//   Published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
//   Draft: "bg-muted text-muted-foreground border-border",
//   Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
// };


// //  add loading state, add reply issue same like update issue
// const ManagerIssues = () => {


//     const {data} = useApiQuery(["fetch-issues"],"/issue","axios");


//     const managerIssues = data?.data;
//     const pagination =data?.meta
// //  meta?: {
// //         page?: number | undefined;
// //         limit?: number | undefined;
// //         total: number;
// //         totalPage: number;
// //     } | 
//     const handleIssueStatus =async (id,value) =>{
//        const result = await updateIssue({status:value},id);
//        if(result.success){
//         toast.success(result.message)
//        }else{
//         toast.error(result.message)
//        }
//     }
//     const handleIssueReply =async (id,value) =>{
//        const result = await updateIssue({status:value},id);
//        if(result.success){
//         toast.success(result.message)
//        }else{
//         toast.error(result.message)
//        }
//     }
//   return (
//      <PageLayout>
//     <section className="py-12 relative overflow-hidden">
//       {/* Decorative Blur */}
//       <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      
//       <div className="mx-auto max-w-7xl px-4 sm:px-6">
   
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* 2. Issue Management (2/3 width) */}
//           <div className="lg:col-span-2 space-y-6">
//             <AnimatedCard delay={0.2} title="Active Investigations">
//               <div className="flex items-center gap-2 mb-6">
//                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
//                  <span className="text-sm font-medium">Attention Required: {managerIssues.length} issues</span>
//               </div>
              
//               <div className="space-y-4">
//                 {managerIssues.map(issue => (
//                   <div key={issue.id} className="group rounded-2xl border border-border/50 bg-background/30 p-5 transition-all hover:bg-background/60">
//                     <div className="flex justify-between items-start mb-3">
//                       <div>
//                         <div className="flex items-center gap-2 mb-1">
//                           <Badge variant="secondary" className="rounded-sm text-[10px] uppercase font-bold tracking-wider">{issue.type}</Badge>
//                           <span className="text-xs text-muted-foreground">#{issue.id} • {issue.date}</span>
//                         </div>
//                         <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{issue.title}</h4>
//                       </div>
//                       <Select defaultValue={issue.status} onValueChange={(e)=> handleIssueStatus(e,issue.id)}>
//                         <SelectTrigger className={`h-8 w-[130px] text-xs font-semibold ${statusColors[issue.status]} border-none`}>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="PENDING">Pending</SelectItem>
//                           <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
//                           <SelectItem value="RESOLVED">Resolved</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
                    
//                     <div className="flex items-center justify-between pt-4 border-t border-border/20">
//                       <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                         <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> {issue.replies} replies</span>
//                         <span className="flex items-center gap-1.5">User: <span className="text-foreground">@{issue.username}</span></span>
//                       </div>
//                       <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs">
//                         <Send className="h-3.5 w-3.5" /> Quick Reply
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </AnimatedCard>
//           </div>

        
//         </div>
//       </div>
//     </section>
//   </PageLayout>
//   )
// }

// export default ManagerIssues

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page