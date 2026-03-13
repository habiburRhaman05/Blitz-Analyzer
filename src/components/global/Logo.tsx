"use client"
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export default function Logo({ size = "md", clickable = true }: LogoProps) {
  const navigate = useRouter();
  const sizes = {
    sm: { box: "h-8 w-8", icon: "h-3.5 w-3.5", text: "text-lg" },
    md: { box: "h-9 w-9", icon: "h-4 w-4", text: "text-xl" },
    lg: { box: "h-12 w-12", icon: "h-6 w-6", text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <div
      className={`flex items-center gap-2.5 ${clickable ? "cursor-pointer" : ""}`}
      onClick={clickable ? () => navigate.push("/") : undefined}
    >
      <div className={`flex ${s.box} items-center justify-center rounded-lg bg-gradient-primary shadow-glow`}>
        <Zap className={`${s.icon} text-primary-foreground`} />
      </div>
      <span className={`font-display ${s.text} font-bold text-gradient-primary hidden sm:block`}>Blitz AI</span>
    </div>
  );
}
