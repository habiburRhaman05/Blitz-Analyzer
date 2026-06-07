import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react'; 
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function WaitlistForm() {
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
    <div className="space-y-4 max-w-md">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Mail className="w-4 h-4" /> Get notified about new positions
      </p>

      {status === 'success' ? (
      
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Awesome! You're on the list.</p>
            <p className="text-xs opacity-90">We'll let you know as soon as positions open.</p>
          </div>
        </div>
      ) : (
     
        <form onSubmit={handleSubmit} className="relative group">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            placeholder="name@company.com"
            className="h-14 pl-5 pr-36 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500 transition-all outline-none disabled:opacity-70"
          />
          <Button
            type="submit"
            disabled={status === 'loading' || !email}
            className="absolute right-1.5 top-1.5 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center min-w-[120px] disabled:opacity-80 disabled:pointer-events-none"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining...
              </span>
            ) : (
              'Join Waitlist'
            )}
          </Button>
        </form>
      )}
    </div>
  );
}