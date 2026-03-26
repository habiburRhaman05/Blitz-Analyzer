"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext"; // adjust path
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner"; // or any toast library
import httpClient from "@/lib/axios-client";
import { refreshWallet } from "@/services/credit.services";
import { handleClaimFreeCredit } from "@/services/user.services";
import { useMutation } from "@tanstack/react-query";


// Types for the onboarding form data

interface OnboardingData {
  role: string;          
  experience: string;     
  goal: string;              
  biggestChallenge: string; 
  howDidYouHear: string;  
}


// Step components

const Step1 = ({ data, updateData }: { data: OnboardingData; updateData: (d: Partial<OnboardingData>) => void }) => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label htmlFor="role">What's your current role?</Label>
      <Input
        id="role"
        placeholder="e.g., Software Engineer, Product Manager, etc."
        value={data.role}
        onChange={(e) => updateData({ role: e.target.value })}
        className="rounded-lg"
      />
    </div>
    <div className="space-y-2">
      <Label>Years of experience</Label>
      <Select value={data.experience} onValueChange={(val) => updateData({ experience: val })}>
        <SelectTrigger className="rounded-lg">
          <SelectValue placeholder="Select experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-2">0-2 years</SelectItem>
          <SelectItem value="3-5">3-5 years</SelectItem>
          <SelectItem value="6-10">6-10 years</SelectItem>
          <SelectItem value="10+">10+ years</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const Step2 = ({ data, updateData }: { data: OnboardingData; updateData: (d: Partial<OnboardingData>) => void }) => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label>What's your main goal?</Label>
      <RadioGroup
        value={data.goal}
        onValueChange={(val) => updateData({ goal: val })}
        className="space-y-2"
      >
        {["Get a new job", "Switch career", "Improve resume", "Get more interviews", "Other"].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <div className="space-y-2">
      <Label htmlFor="challenge">What's your biggest challenge with resumes?</Label>
      <Textarea
        id="challenge"
        placeholder="e.g., Getting past ATS, formatting, writing content, etc."
        value={data.biggestChallenge}
        onChange={(e) => updateData({ biggestChallenge: e.target.value })}
        className="rounded-lg"
        rows={3}
      />
    </div>
  </div>
);

const Step3 = ({ data, updateData }: { data: OnboardingData; updateData: (d: Partial<OnboardingData>) => void }) => (
  <div className="space-y-4 py-4">
    <div className="space-y-2">
      <Label>How did you hear about us?</Label>
      <Select value={data.howDidYouHear} onValueChange={(val) => updateData({ howDidYouHear: val })}>
        <SelectTrigger className="rounded-lg">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="search">Search engine</SelectItem>
          <SelectItem value="social">Social media</SelectItem>
          <SelectItem value="friend">Friend/colleague</SelectItem>
          <SelectItem value="ad">Advertisement</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="bg-muted/30 p-4 rounded-lg border border-border">
      <p className="text-sm text-muted-foreground">
        By completing this onboarding, you'll receive <span className="font-bold text-primary">10 free credits</span> to use on our platform.
        No credit card required.
      </p>
    </div>
  </div>
);


// Main component: ClaimFreeCredits

interface ClaimFreeCreditsProps {
  userId?: string; // callback to update credits in parent
}

export default function ClaimFreeCredits({ userId }: ClaimFreeCreditsProps) {
  const {user,setUser} = useUser()
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    role: "",
    experience: "",
    goal: "",
    biggestChallenge: "",
    howDidYouHear: "",
  });

  // Update form data
  const updateData = (newData: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const claimHandler = useMutation({
    mutationKey:[""],
    mutationFn:(payload) => handleClaimFreeCredit(payload)
  })

  // Next step
  const nextStep = () => {
    // Basic validation
    if (currentStep === 1 && (!formData.role || !formData.experience)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (currentStep === 2 && (!formData.goal || !formData.biggestChallenge)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (currentStep === 3 && !formData.howDidYouHear) {
      toast.error("Please select an option");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Submit onboarding
  "use client"
  const handleSubmit = async () => {
try {
      setIsSubmitting(true);
    const payload= {}
    const result = await claimHandler.mutateAsync()
    console.log(result);
    
    if(result.data?.success){
      setShowSuccess(true);
      await refreshWallet();
      setUser((prev:any)=>({...prev,isFreeCreditClaim:true}));
    }
} catch (error) {
  
}finally{
       setIsSubmitting(false);
}
 
  };

  // Modal content based on state
  const renderModalContent = () => {
    if (showSuccess) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">10 Credits Added!</h3>
          <p className="text-muted-foreground">
            Your account has been credited with 10 free credits. Start using them now!
          </p>
          <Sparkles className="h-5 w-5 text-primary mt-4 animate-pulse" />
        </div>
      );
    }

    // Steps
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {currentStep === 1 && "Welcome! Tell us about yourself"}
            {currentStep === 2 && "Your goals & challenges"}
            {currentStep === 3 && "Almost there!"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Help us personalize your experience."}
            {currentStep === 2 && "We'll use this to give you better recommendations."}
            {currentStep === 3 && "One last question, then you'll get your free credits."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          {/* Step indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 relative">
                <div
                  className={`w-full h-1 rounded-full ${
                    step <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
                {step < 3 && (
                  <div className="absolute right-0 top-0 -translate-y-1/2">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && <Step1 data={formData} updateData={updateData} />}
              {currentStep === 2 && <Step2 data={formData} updateData={updateData} />}
              {currentStep === 3 && <Step3 data={formData} updateData={updateData} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                Back
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < 3 ? (
              <Button onClick={nextStep} className="rounded-full px-6">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-full px-6 bg-primary text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get My 10 Free Credits
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Info Banner (left text, right button) */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-border rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">Limited time offer:</span> Claim 10 free credits to analyze your resume!
          </p>
        </div>
        <Button
          onClick={() => {
              setIsLoading(true)
              setIsOpen(true)
            setTimeout(() => {
                setIsLoading(false)
            }, 2000);
          }}
          size="sm"
          className="rounded-full shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Claim Free Credits
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg rounded-2xl">
          {
            isLoading ? <h1>Loading...</h1> : renderModalContent()
          }
        </DialogContent>
      </Dialog>
    </>
  );
}