import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link, useLocation } from "wouter";
import { OfflineBanner } from "@/components/OfflineBanner";
import {
  ArrowLeftRight,
  BookOpen,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  PlayCircle,
  Route as RouteIcon,
  Shield,
  Target,
  TrendingUp,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TIER1_LOGO_WHITE =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ZPsMJTEeF9cNbnWWtGpFHU/tier1_logo_white_e523441d.webp";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

interface NavZone {
  title: string;
  items: NavItem[];
}

/* ── Primary nav (header bar) — 5 items ── */
const primaryNav: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/athletes", label: "Athletes", icon: Users },
  { href: "/drills", label: "Drills", icon: BookOpen },
  { href: "/session-plans", label: "Plans", icon: ClipboardList },
  { href: "/on-court", label: "On Court", icon: PlayCircle },
];

/* ── Three-zone navigation for the "More" drawer ── */
const navZones: NavZone[] = [
  {
    title: "FTA Command Center",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/athletes", label: "Athlete Directory", icon: Users },
    ],
  },
  {
    title: "Coaches Playbook",
    items: [
      { href: "/drills", label: "Drill Library", icon: BookOpen },
      { href: "/session-plans", label: "Session Plans", icon: ClipboardList },
      { href: "/session-builder", label: "Session Builder", icon: Wrench },
      { href: "/compare-plans", label: "Compare Plans", icon: ArrowLeftRight },
      { href: "/session-history", label: "Session History", icon: History },
      { href: "/pathway", label: "Pathway", icon: RouteIcon },
      { href: "/assessments", label: "Assessments", icon: Target },
      { href: "/advancement", label: "Advancement", icon: TrendingUp },
      { href: "/coach-standards", label: "Coach Standards", icon: Shield },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/onboarding", label: "Onboarding", icon: GraduationCap },
    ],
  },
];

/* ── Mobile bottom nav — 5 items ── */
const bottomNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/athletes", label: "Athletes", icon: Users },
  { href: "/drills", label: "Drills", icon: BookOpen },
  { href: "/session-plans", label: "Plans", icon: ClipboardList },
  { href: "/on-court", label: "Court", icon: PlayCircle },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { authEnabled, user, signOut } = useAuth();
  const isOnCourtRoute = location.startsWith("/on-court");

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background text-t1-text">
      <OfflineBanner />
      <header className="sticky top-0 z-50 border-b border-t1-border bg-t1-bg/92 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between gap-3 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-t1-border bg-t1-surface/84">
              <img
                src={TIER1_LOGO_WHITE}
                alt="Tier 1 Performance"
                className="h-6 w-auto brightness-0"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[0.95rem] leading-none font-semibold uppercase tracking-[0.18em] text-t1-text sm:text-sm">
                Tier 1 Coaches
              </span>
              <span className="hidden text-[11px] leading-none tracking-[0.12em] text-t1-muted sm:block">
                Academy Operating System
              </span>
            </div>
          </Link>

          {/* Desktop nav — 5 primary items, flat links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-lg border border-t1-border bg-t1-surface/90 px-2 py-1.5 shadow-sm">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex min-h-[42px] items-center rounded-lg px-3.5 py-2 action-label no-underline transition-colors ${
                  isActive(item.href)
                    ? "bg-t1-accent text-white shadow-sm"
                    : "text-t1-muted hover:bg-t1-bg hover:text-t1-text"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Desktop "More" button to open drawer */}
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg px-3 py-2 action-label text-t1-muted transition-colors hover:bg-t1-bg hover:text-t1-text"
            >
              <MoreHorizontal className="h-4 w-4" />
              More
            </button>
          </nav>

          {/* Right side: auth + mobile hamburger */}
          <div className="flex items-center gap-2">
            {authEnabled && user && (
              <div className="hidden items-center gap-2 lg:flex">
                <div className="hidden xl:block text-right">
                  <p className="max-w-[220px] truncate text-sm font-semibold text-t1-text">
                    {user.email}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-t1-muted">
                    Cloud sync on
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-t1-border bg-t1-surface/80 px-4 action-label text-t1-muted transition-colors hover:text-t1-text">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-t1-border bg-t1-surface">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display text-lg uppercase tracking-[0.14em] text-t1-text">
                        Sign out of Tier 1 Coaches?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm text-t1-muted">
                        Your synced data stays in place. Unsaved local changes
                        can still be lost if you leave mid-flow.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-t1-border bg-t1-bg text-t1-text hover:bg-t1-surface">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-t1-accent text-white hover:bg-t1-accent/90"
                        onClick={() => void signOut()}
                      >
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {/* Mobile hamburger in header */}
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-t1-border bg-t1-surface/80 text-t1-text lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* "More" drawer — three-zone navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-t1-bg/96 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between border-b border-t1-border px-4">
            <div>
              <p className="font-display text-[0.95rem] leading-none font-semibold uppercase tracking-[0.18em] text-t1-text">
                Navigation
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-t1-muted">
                All zones &amp; pages
              </p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-t1-border bg-t1-surface/80 text-t1-text"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {navZones.map((zone) => (
              <div key={zone.title}>
                <p className="mb-2 px-2 chip-label text-t1-muted">
                  {zone.title}
                </p>
                <div className="space-y-2">
                  {zone.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex min-h-[54px] items-center gap-4 rounded-lg border px-4 py-3 text-[0.97rem] leading-tight font-semibold no-underline transition-colors ${
                          active
                            ? "border-t1-accent/25 bg-t1-accent/10 text-t1-accent"
                            : "border-t1-border bg-t1-surface/80 text-t1-text"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${active ? "text-t1-accent" : "text-t1-muted"}`}
                        />
                        <span>{item.label}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-t1-muted/60" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-t1-border px-4 py-4">
            {authEnabled && user && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="mb-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-t1-border bg-t1-surface px-4 action-label text-t1-text">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-t1-border bg-t1-surface">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-lg uppercase tracking-[0.14em] text-t1-text">
                      Sign out of Tier 1 Coaches?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-t1-muted">
                      Your synced data stays in place. Unsaved local changes can
                      still be lost if you leave mid-flow.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-t1-border bg-t1-bg text-t1-text hover:bg-t1-surface">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-t1-accent text-white hover:bg-t1-accent/90"
                      onClick={() => void signOut()}
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-t1-muted">
              The standard is the standard.
            </p>
          </div>
        </div>
      )}

      <main className={isOnCourtRoute ? "pb-6 lg:pb-12" : "pb-20 lg:pb-12"}>
        {children}
      </main>

      {/* Desktop footer */}
      <footer className="hidden border-t border-t1-border bg-t1-bg/84 lg:block">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-t1-border bg-t1-surface/84">
              <img
                src={TIER1_LOGO_WHITE}
                alt="Tier 1"
                className="h-4 w-auto opacity-70 brightness-0"
              />
            </div>
            <span className="text-sm text-t1-muted">
              Tier 1 Academy Operating System. Build faster, coach cleaner.
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-t1-muted">
            Action first. Details on demand.
          </p>
        </div>
      </footer>

      {/* Mobile bottom nav — 5 items */}
      {!isOnCourtRoute && (
        <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-t1-border bg-t1-bg/94 backdrop-blur-xl lg:hidden">
          <div className="grid h-[4.25rem] grid-cols-5">
            {bottomNavItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1.5 no-underline transition-colors ${
                    active ? "text-t1-accent" : "text-t1-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.9} />
                  <span className="text-[11.5px] leading-none font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
