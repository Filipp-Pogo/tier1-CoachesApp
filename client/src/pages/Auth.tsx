import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Loader2,
  ShieldCheck,
  Star,
} from "lucide-react";

const TIER1_LOGO_WHITE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ZPsMJTEeF9cNbnWWtGpFHU/tier1_logo_white_e523441d.webp";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const {
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    authEnabled,
  } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const result: { error?: string; message?: string } | { error?: string } =
      mode === "signin"
        ? await signInWithPassword(email.trim(), password)
        : await signUpWithPassword(email.trim(), password);

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if ("message" in result && result.message) {
      toast.success(result.message);
    }

    navigate("/");
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
    <div className="min-h-screen bg-background px-4 py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="panel-surface p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={TIER1_LOGO_WHITE} alt="Tier 1" className="h-8 w-auto" />
              <div>
                <p className="font-display text-sm font-bold text-t1-text">
                  Tier 1 Coaches App
                </p>
                <p className="text-xs text-t1-muted">
                  Sign in to carry your drills, plans, and onboarding progress
                  across devices.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-t1-accent/20 bg-t1-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-t1-accent">
              Beta Coach Access
            </span>
          </div>

          <div className="coach-tip mt-5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-accent">
              First Login
            </p>
            <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  label: "Finish onboarding",
                  detail: "Get the culture and session standard first.",
                },
                {
                  icon: Star,
                  label: "Save go-to drills",
                  detail: "Build a shortlist you can reach in one tap.",
                },
                {
                  icon: ClipboardList,
                  label: "Customize one plan",
                  detail:
                    "Start from stock plans before building from scratch.",
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="rounded-xl border border-t1-border bg-t1-bg/55 p-3"
                >
                  <item.icon className="h-4 w-4 text-t1-accent" />
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-t1-text">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-t1-muted">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {!authEnabled && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code>{" "}
              and <code>VITE_SUPABASE_ANON_KEY</code> to enable login + cloud
              sync.
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-t1-border bg-t1-bg/70 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-t1-accent text-white shadow-sm"
                  : "text-t1-muted hover:text-t1-text"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-t1-accent text-white shadow-sm"
                  : "text-t1-muted hover:text-t1-text"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl border border-t1-border bg-t1-bg/55 px-3 py-2.5 text-xs text-t1-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-accent" />
            <span>
              {mode === "signin"
                ? "Returning coaches can jump back into saved plans, drill collections, and session notes immediately."
                : "New coaches only need an email and password. Once you sign in, the app will guide you into onboarding and your first plan flow."}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="coach@tier1.com"
                required
                className="min-h-11 rounded-xl bg-t1-bg/65"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                {mode === "signup" && (
                  <span className="text-[11px] text-t1-muted">
                    Use at least 8 characters.
                  </span>
                )}
              </div>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="min-h-11 rounded-xl bg-t1-bg/65"
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl text-sm font-semibold"
              disabled={submitting || !authEnabled}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-t1-muted">
            <div className="h-px flex-1 bg-t1-border" />
            <span>or</span>
            <div className="h-px flex-1 bg-t1-border" />
          </div>

          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-t1-border bg-t1-bg/40"
            onClick={handleGoogle}
            disabled={submitting || !authEnabled}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Google
          </Button>
        </div>

        <aside className="panel-muted flex flex-col justify-between gap-5 p-5 sm:p-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-t1-accent">
              Coach Setup
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-t1-text">
              Sign in once. Coach faster all week.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-t1-muted">
              The beta is built to reduce dead time before and during class.
              Save a few trusted drills, customize one strong stock plan, and
              keep notes in one place instead of rebuilding every session.
            </p>
          </div>

          <div className="rounded-2xl border border-t1-border bg-t1-surface/75 p-4">
            <div className="mb-2 flex items-center gap-2 text-t1-text">
              <ShieldCheck className="h-4 w-4 text-t1-accent" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                What syncs
              </span>
            </div>
            <ul className="space-y-2 text-sm text-t1-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-accent" />
                Favorites, recent drills, and the drill library workbench you
                build.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-accent" />
                Session history, notes, and saved custom plans.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-t1-accent" />
                Onboarding progress and quiz results for returning coaches.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-t1-accent/15 bg-t1-accent/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-t1-accent">
              Recommended First Week
            </p>
            <ol className="mt-3 space-y-2.5 text-sm text-t1-muted">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent/15 text-[11px] font-semibold text-t1-accent">
                  1
                </span>
                Complete onboarding and pass the quiz when you have context.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent/15 text-[11px] font-semibold text-t1-accent">
                  2
                </span>
                Save 8 to 10 reliable drills by class level so you stop
                searching mid-practice.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent/15 text-[11px] font-semibold text-t1-accent">
                  3
                </span>
                Customize a stock plan before you build a session from scratch.
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
