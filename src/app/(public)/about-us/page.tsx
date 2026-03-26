"use client";

import { Users, Target, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen pt-32">
      <div className="container max-w-6xl mx-auto px-6 space-y-32">
        
        {/* Mission Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
            Our Mission
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">
            We bridge the gap between <span className="text-primary">Talent</span> and <span className="text-muted-foreground">Opportunity</span>.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Blitz Analyzer was born in 2024 to solve a simple problem: job descriptions are written for robots, but resumes are written for humans. We use production-grade AI to ensure your human value is understood by every system.
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-border/50">
          {[
            { label: "Active Users", value: "50k+" },
            { label: "Resumes Scanned", value: "1.2M" },
            { label: "ATS Score Avg", value: "88%" },
            { label: "Countries", value: "120+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <h2 className="text-4xl font-black text-primary">{stat.value}</h2>
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Values Grid */}
        <section className="grid md:grid-cols-3 gap-12">
          <ValueCard 
            icon={<Target className="w-6 h-6" />}
            title="Precision First"
            desc="Our algorithms are tuned for strict ATS compliance without sacrificing human readability."
          />
          <ValueCard 
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Privacy Guarded"
            desc="Your career data belongs to you. We encrypt every file with industry-standard protocols."
          />
          <ValueCard 
            icon={<Zap className="w-6 h-6" />}
            title="Speed to Hire"
            desc="Reduce your application time by 70% with our automated optimization workflows."
          />
        </section>

        {/* Founder Section */}
        <section className="bg-muted/30 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 border border-border">
          <div className="w-48 h-48 rounded-3xl bg-primary/20 shrink-0 overflow-hidden border-4 border-background shadow-2xl">
            {/* Replace with your image */}
            <div className="w-full h-full flex items-center justify-center font-black text-4xl text-primary/40">H</div>
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-black">Building for Engineers.</h3>
            <p className="text-muted-foreground italic leading-relaxed">
              "As a Full-Stack Software Engineer, I realized the job market is a system of data. To win, you need better data. Blitz is the architect for your professional identity."
            </p>
            <div>
              <p className="font-bold">Habib</p>
              <p className="text-sm text-primary">Founder & Lead Architect</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
        {icon}
      </div>
      <h4 className="text-xl font-bold tracking-tight">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}