"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Loader2, 
  MessageSquare, 
  Globe 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a textarea component
import { cn } from "@/lib/utils";
import Link from "next/link";

// 1. Define Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid business email"),
  subject: z.string().min(5, "Subject is too short"),
  message: z.string().min(10, "Tell us a bit more about your needs"),
  privacy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy policy" }),
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsPending(true);
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form Data:", data);
    setIsPending(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="relative w-full bg-white dark:bg-[#030303] py-20 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-blue-50/50 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-[1200px] mx-auto px-4">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/" className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: Content & Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold tracking-widest uppercase"
              >
                Contact Us
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Let&apos;s build <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">something great.</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Have a technical challenge or a SaaS idea? Habib and the team are ready to architect your next big move.
              </p>
            </div>

            <div className="grid gap-6">
              <ContactInfoCard 
                icon={<Mail className="w-5 h-5" />} 
                title="Email us" 
                value="hello@blitz.com" 
                href="mailto:hello@blitz.com"
              />
              <ContactInfoCard 
                icon={<MessageSquare className="w-5 h-5" />} 
                title="Live Chat" 
                value="Average response: 2h" 
              />
              <ContactInfoCard 
                icon={<Globe className="w-5 h-5" />} 
                title="Office" 
                value="Dhaka, Bangladesh" 
              />
            </div>
          </div>

          {/* RIGHT: Modern Form Card */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-1 rounded-3xl bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent"
            >
              <div className="bg-white dark:bg-[#0a0a0a] rounded-[22px] p-8 md:p-10 shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormGroup label="Full Name" error={errors.name?.message}>
                      <Input 
                        {...register("name")} 
                        placeholder="John Doe" 
                        className={cn("h-12 bg-slate-50 dark:bg-slate-900", errors.name && "border-red-500")}
                      />
                    </FormGroup>
                    <FormGroup label="Work Email" error={errors.email?.message}>
                      <Input 
                        {...register("email")} 
                        placeholder="john@company.com" 
                        className={cn("h-12 bg-slate-50 dark:bg-slate-900", errors.email && "border-red-500")}
                      />
                    </FormGroup>
                  </div>

                  <FormGroup label="Subject" error={errors.subject?.message}>
                    <Input 
                      {...register("subject")} 
                      placeholder="Project architecture inquiry" 
                      className={cn("h-12 bg-slate-50 dark:bg-slate-900", errors.subject && "border-red-500")}
                    />
                  </FormGroup>

                  <FormGroup label="Message" error={errors.message?.message}>
                    <Textarea 
                      {...register("message")} 
                      placeholder="Tell us about your project goals..." 
                      className={cn("min-h-[150px] bg-slate-50 dark:bg-slate-900 resize-none", errors.message && "border-red-500")}
                    />
                  </FormGroup>

                  <div className="flex items-start gap-3 py-2">
                    <Checkbox id="privacy" {...register("privacy")} />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="privacy" className="text-sm text-muted-foreground font-medium cursor-pointer">
                        I agree to the <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
                      </label>
                      {errors.privacy && <p className="text-xs text-red-500 font-medium">{errors.privacy.message}</p>}
                    </div>
                  </div>

                  <Button 
                    disabled={isPending} 
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-bold transition-all active:scale-[0.98]"
                  >
                    <AnimatePresence mode="wait">
                      {isPending ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                        </motion.div>
                      ) : isSuccess ? (
                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Message Sent
                        </motion.div>
                      ) : (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                          Send Message <Send className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- Helper Components ---

function FormGroup({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
}

function ContactInfoCard({ icon, title, value, href }: { icon: any; title: string; value: string; href?: string }) {
  const Content = (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-border group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-slate-900 dark:text-white font-semibold">{value}</p>
      </div>
    </div>
  );

  return href ? <a href={href}>{Content}</a> : Content;
}