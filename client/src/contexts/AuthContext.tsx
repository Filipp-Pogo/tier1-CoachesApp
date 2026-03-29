import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { clearLocalCoachAppState, syncLocalStateForUser } from '@/lib/cloudSync';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authEnabled: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error?: string; message?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await syncLocalStateForUser(data.session.user);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        void syncLocalStateForUser(nextSession.user);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      toast.error(customEvent.detail?.message || 'Cloud sync hit an error.');
    };

    window.addEventListener('tier1-cloud-sync-error', handler as EventListener);
    return () => window.removeEventListener('tier1-cloud-sync-error', handler as EventListener);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    authEnabled: isSupabaseConfigured,
    async signInWithPassword(email, password) {
      if (!supabase) return { error: 'Supabase is not configured.' };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    async signUpWithPassword(email, password) {
      if (!supabase) return { error: 'Supabase is not configured.' };
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) return { error: error.message };

      if (!data.session) {
        return { message: 'Check your email to confirm your account, then sign in.' };
      }

      return { message: 'Account created. You are now signed in.' };
    },
    async signInWithGoogle() {
      if (!supabase) return { error: 'Supabase is not configured.' };
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return error ? { error: error.message } : {};
    },
    async signOut() {
      if (!supabase) return;
      await supabase.auth.signOut();
      clearLocalCoachAppState();
      setUser(null);
      setSession(null);
    },
  }), [loading, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
