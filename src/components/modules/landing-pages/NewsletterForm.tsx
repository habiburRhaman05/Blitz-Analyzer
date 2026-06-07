import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');


    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 2000);
  };

  return (
    <div className="relative z-10 space-y-4">
      <h4 className="text-xl font-bold tracking-tight">Stay ahead of the curve.</h4>
      <p className="text-muted-foreground text-sm max-w-sm">
        Get monthly engineering career tips and AI automation workflows delivered to your inbox.
      </p>

      {status === 'success' ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 max-w-md animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Thanks for subscribing! Check your inbox soon.</span>
        </div>
      ) : (
    
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
          <Input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            placeholder="Enter your work email" 
            className="bg-background border-border focus:ring-1 focus:ring-primary rounded-xl h-11 disabled:opacity-70"
          />
          <Button 
            type="submit"
            disabled={status === 'loading' || !email}
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl px-6 h-11 transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[90px] disabled:opacity-80"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Join'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}