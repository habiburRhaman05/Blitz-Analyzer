"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

export default function AccountPage() {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const initials = user?.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl  mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal information</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="h-5 w-5 text-foreground" />
          </div>
        </div>
        <div>
          <p className="font-display text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {/* <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">{user?.plan} Plan</span> */}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 bg-card border-border" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 bg-card border-border" />
          </div>
         
         
        </div>
        
       
        <Button onClick={handleSave} disabled={saving} className="">
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
      </motion.div>
    </div>
  );
}
