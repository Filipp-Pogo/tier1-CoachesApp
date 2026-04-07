import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { Link, useLocation } from "wouter";
import { OfflineBanner } from "@/components/OfflineBanner";
import {
  ArrowLeftRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PlayCircle,
  Route as RouteIcon,
  Shield,
  Target,
  TrendingUp,
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
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/drills", label: "Drills", icon: BookOpen },
  { href: "/on-court", label: "On Court", icon: PlayCircle },
  {
    href: "/session-plans",
    label: "Playbooks",
    icon: ClipboardList,
    children: [
      {
        href: "/session-plans",
        label: "Session Playbooks",
        icon: ClipboardList,
      },
      { href: "/session-builder", label: "Session Builder", icon: Wrench },
      { href: "/session-history", label: "Session History", icon: History },
      { href: "/compare-plans", label: "Compare Plans", icon: ArrowLeftRight },
    ],
  },
  {
    href: "/pathway",
    label: "Player Dev",
    icon: TrendingUp,
    children: [
      { href: "/pathway", label: "Pathway", icon: RouteIcon },
      { href: "/assessments", label: "Assessments", icon: Target },
      { href: "/advancement", label: "Advancement", icon: TrendingUp },
    ],
  },
  {
    href: "/coach-standards",
    label: "Coach",
    icon: Shield,
    children: [
      { href: "/coach-standards", label: "Coach Standards", icon: Shield },
      { href: "/onboarding", label: "Onboarding", icon: GraduationCap },
    ],
  },
];

const mobileSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Primary",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/drills", label: "Drills", icon: BookOpen },
      { href: "/on-court", label: "On Court", icon: PlayCircle },
      {
        href: "/session-plans",
        label: "Session Playbooks",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/session-builder", label: "Session Builder", icon: Wrench },
      { href: "/session-history", label: "Session History", icon: History },
      { href: "/compare-plans", label: "Compare Plans", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Player Development",
    items: [
      { href: "/pathway", label: "Pathway", icon: RouteIcon },
      { href: "/assessments", label: "Assessments", icon: Target },
      { href: "/advancement", label: "Advancement", icon: TrendingUp },
    ],
  },
  {
    label: "Coach",
    items: [
      { href: "/coach-standards", label: "Coach Standards", icon: Shield },
      { href: "/onboarding", label: "Onboarding", icon: GraduationCap },
    ],
  },
];

const bottomNavItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/drills", label: "Drills", icon: BookOpen },
  { href: "/on-court", label: "Court", icon: PlayCircle },
  { href: "/session-plans", label: "Plans", icon: ClipboardList },
];

function NavDropdown({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active =
    item.children?.some(child => isActive(child.href)) || isActive(item.href);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        onClick={() => setOpen(previous => !previous)}
        className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-lg px-3.5 py-2 action-label transition-colors ${
          active
            ? "bg-t1-accent text-white shadow-sm"
            : "text-t1-muted hover:bg-t1-bg hover:text-t1-text"
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-60 rounded-lg border border-t1-border bg-t1-surface p-2 shadow-md">
          {item.children?.map(child => {
            const Icon = child.icon;
            const activeChild = isActive(child.href);

            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={`flex min-h-[46px] items-center gap-3 rounded-lg px-3.5 py-3 action-label no-underline transition-colors ${
                  activeChild
                    ? "bg-t1-accent/10 text-t1-accent"
                    : "text-t1-text hover:bg-t1-bg"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 ${activeChild ? "text-t1-accent" : "text-t1-muted"}`}
                />
                <span>{child.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-t1-muted/60" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
                Coaching Playbook
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-lg border border-t1-border bg-t1-surface/90 px-2 py-1.5 shadow-sm">
            {navItems.map(item =>
              item.children ? (
                <NavDropdown key={item.label} item={item} isActive={isActive} />
              ) : (
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
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/on-court"
              className="hidden min-h-[42px] items-center gap-2 rounded-full bg-t1-accent px-4 action-label text-white no-underline xl:inline-flex"
            >
              <PlayCircle className="h-4 w-4" />
              On Court
            </Link>

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
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-t1-bg/96 backdrop-blur-xl lg:hidden">
          <div className="flex h-14 items-center justify-between border-b border-t1-border px-4">
            <div>
              <p className="font-display text-[0.95rem] leading-none font-semibold uppercase tracking-[0.18em] text-t1-text">
                Quick navigation
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-t1-muted">
                Action-first routes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-t1-border bg-t1-surface/80 text-t1-text"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {mobileSections.map(section => (
              <section key={section.label} className="mb-5">
                <p className="mb-2 px-2 chip-label text-t1-muted">
                  {section.label}
                </p>
                <div className="space-y-2">
                  {section.items.map(item => {
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
              </section>
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
              Tier 1 Coaches App. Build faster, coach cleaner.
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-t1-muted">
            Action first. Details on demand.
          </p>
        </div>
      </footer>

      {!isOnCourtRoute && (
        <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-t1-border bg-t1-bg/94 backdrop-blur-xl lg:hidden">
          <div className="grid h-[4.25rem] grid-cols-5">
            {bottomNavItems.map(item => {
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

            <button
              onClick={() => setMobileOpen(true)}
              className={`flex flex-col items-center justify-center gap-1.5 ${
                mobileOpen ? "text-t1-accent" : "text-t1-muted"
              }`}
            >
              <Menu className="h-5 w-5" />
              <span className="text-[11.5px] leading-none font-semibold">
                More
              </span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
