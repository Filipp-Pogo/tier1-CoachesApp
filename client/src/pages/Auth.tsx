import { FormEvent, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

const TIER1_LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ZPsMJTEeF9cNbnWWtGpFHU/tier1_logo_white_e523441d.webp';

type Mode = 'signin' | 'signup';

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { signInWithPassword, signUpWithPassword, signInWithGoogle, authEnabled } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const result:
      | { error?: string; message?: string }
      | { error?: string } =
      mode === 'signin'
        ? await signInWithPassword(email.trim(), password)
        : await signUpWithPassword(email.trim(), password);

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if ('message' in result && result.message) {
      toast.success(result.message);
    }

    navigate('/');
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    const result = await signInWithGoogle();
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-t1-border bg-t1-surface p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 mb-6">
          <img src={TIER1_LOGO_WHITE} alt="Tier 1" className="h-8 w-auto" />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-t1-text">Tier 1 Coaches App</p>
            <p className="text-xs text-t1-muted">Sign in to sync your coaching data across devices.</p>
          </div>
        </div>

        {!authEnabled && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
            Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable login + cloud sync.
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-t1-bg p-1">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === 'signin' ? 'bg-t1-blue text-white' : 'text-t1-muted hover:text-t1-text'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === 'signup' ? 'bg-t1-blue text-white' : 'text-t1-muted hover:text-t1-text'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="coach@tier1.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
          </div>

          <Button type="submit" className="w-full" disabled={submitting || !authEnabled}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-t1-muted">
          <div className="h-px flex-1 bg-t1-border" />
          <span>or</span>
          <div className="h-px flex-1 bg-t1-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={submitting || !authEnabled}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Continue with Google
        </Button>

        <div className="mt-6 rounded-lg border border-t1-border bg-t1-bg p-4 text-sm text-t1-muted">
          <div className="mb-2 flex items-center gap-2 text-t1-text">
            <ShieldCheck className="h-4 w-4 text-t1-blue" />
            What gets synced
          </div>
          <ul className="space-y-1 list-disc pl-5">
            <li>Favorites and recent drills</li>
            <li>Session history and notes</li>
            <li>Saved session plan preferences</li>
            <li>Onboarding progress and quiz history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
