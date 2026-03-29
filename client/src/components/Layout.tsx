/*
  LAYOUT: Tier 1 Performance — Dual Theme Support
  MOBILE-FIRST: Bottom nav is primary on mobile, top bar is minimal.
  Desktop: Full top nav with grouped menus for Sessions and Player Development.
  Touch targets: min 44px on mobile.
  NAV GROUPING: 11 items collapsed to 7 top-level items.
  THEME TOGGLE: Sun/Moon icon in header + mobile menu footer.
*/
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Menu, X, ChevronRight, ChevronDown, LayoutDashboard, Route, BookOpen,
  Wrench, Target, TrendingUp, Shield, ClipboardList, History, ArrowLeftRight, GraduationCap,
  Sun, Moon, LogOut
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TIER1_LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ZPsMJTEeF9cNbnWWtGpFHU/tier1_logo_white_e523441d.webp';

/* --- Grouped navigation structure --- */
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pathway', label: 'Pathway', icon: Route },
  { href: '/drills', label: 'Drills', icon: BookOpen },
  {
    href: '/session-builder', label: 'Sessions', icon: Wrench,
    children: [
      { href: '/session-builder', label: 'Session Builder', icon: Wrench },
      { href: '/session-plans', label: 'Session Plans', icon: ClipboardList },
      { href: '/session-history', label: 'Session History', icon: History },
      { href: '/compare-plans', label: 'Compare Plans', icon: ArrowLeftRight },
    ],
  },
  {
    href: '/assessments', label: 'Player Dev', icon: Target,
    children: [
      { href: '/assessments', label: 'Assessments', icon: Target },
      { href: '/advancement', label: 'Advancement', icon: TrendingUp },
    ],
  },
  { href: '/coach-standards', label: 'Coach Standards', icon: Shield },
  { href: '/onboarding', label: 'Onboarding', icon: GraduationCap },
];

/* Flat list for mobile menu */
const allNavItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pathway', label: 'Pathway', icon: Route },
  { href: '/drills', label: 'Drills', icon: BookOpen },
  { href: '/session-builder', label: 'Session Builder', icon: Wrench },
  { href: '/session-plans', label: 'Session Plans', icon: ClipboardList },
  { href: '/session-history', label: 'Session History', icon: History },
  { href: '/compare-plans', label: 'Compare Plans', icon: ArrowLeftRight },
  { href: '/assessments', label: 'Assessments', icon: Target },
  { href: '/advancement', label: 'Advancement', icon: TrendingUp },
  { href: '/coach-standards', label: 'Coach Standards', icon: Shield },
  { href: '/onboarding', label: 'Onboarding', icon: GraduationCap },
];

const bottomNavItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/drills', label: 'Drills', icon: BookOpen },
  { href: '/session-builder', label: 'Builder', icon: Wrench },
  { href: '/session-plans', label: 'Plans', icon: ClipboardList },
];

/* --- Desktop Dropdown Component --- */
function NavDropdown({ item, isActive }: { item: NavItem; isActive: (href: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const anyChildActive = item.children?.some(c => isActive(c.href)) ?? false;
  const active = anyChildActive || isActive(item.href);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          active
            ? 'bg-t1-blue text-white'
            : 'text-t1-muted hover:text-t1-text hover:bg-t1-surface'
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-t1-surface border border-t1-border rounded-lg shadow-xl shadow-black/20 py-1 z-50">
          {item.children!.map(child => {
            const Icon = child.icon;
            const childActive = isActive(child.href);
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm no-underline transition-colors ${
                  childActive
                    ? 'bg-t1-blue/10 text-t1-blue'
                    : 'text-t1-text hover:bg-t1-bg'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${childActive ? 'text-t1-blue' : 'text-t1-muted'}`} />
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* --- Theme Toggle Button --- */
function ThemeToggle({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const dim = size === 'md' ? 'w-10 h-10' : 'w-8 h-8';
  const iconDim = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <button
      onClick={toggleTheme}
      className={`${dim} flex items-center justify-center rounded-lg transition-colors text-t1-muted hover:text-t1-text hover:bg-t1-surface`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode (outdoor)' : 'Dark mode (indoor)'}
    >
      {isDark ? (
        <Sun className={iconDim} />
      ) : (
        <Moon className={iconDim} />
      )}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { isDark } = useTheme();
  const { authEnabled, user, signOut } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      {/* Top Navigation Bar — minimal on mobile, full on desktop */}
      <header className="sticky top-0 z-50 border-b border-t1-border bg-t1-bg/95 backdrop-blur-sm transition-colors duration-200">
        <div className="container flex items-center justify-between h-12 lg:h-14">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <img
              src={TIER1_LOGO_WHITE}
              alt="Tier 1 Performance"
              className={`h-6 lg:h-7 w-auto transition-all duration-200 ${isDark ? '' : 'brightness-0'}`}
            />
            <div className="flex flex-col">
              <span className="font-display text-xs lg:text-sm font-bold tracking-wide text-t1-text leading-none uppercase">
                Tier 1 Academy
              </span>
              <span className="text-[9px] text-t1-muted tracking-widest uppercase hidden sm:block">
                Internal Coaching Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav — grouped */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} isActive={isActive} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors no-underline ${
                    isActive(item.href)
                      ? 'bg-t1-blue text-white'
                      : 'text-t1-muted hover:text-t1-text hover:bg-t1-surface'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            {/* Theme Toggle — desktop */}
            <div className="ml-2 border-l border-t1-border pl-2">
              <ThemeToggle size="sm" />
            </div>
            {authEnabled && user && (
              <div className="ml-2 flex items-center gap-2 border-l border-t1-border pl-3">
                <div className="hidden xl:block text-right">
                  <p className="text-xs font-medium text-t1-text leading-tight">{user.email}</p>
                  <p className="text-[10px] uppercase tracking-widest text-t1-muted">Cloud sync on</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-t1-muted hover:text-t1-text hover:bg-t1-surface transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-t1-surface border-t1-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display text-lg uppercase tracking-wide text-t1-text">Sign out of Tier 1 Coaches App?</AlertDialogTitle>
                      <AlertDialogDescription className="text-sm text-t1-muted">
                        Your synced data is safe in the cloud. Any unsaved local changes could be lost if you sign out right now.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-t1-bg border-t1-border text-t1-text hover:bg-t1-surface">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-t1-blue text-white hover:bg-t1-blue/90" onClick={() => void signOut()}>Sign Out</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </nav>

          {/* Mobile: theme toggle visible */}
          <div className="lg:hidden flex items-center gap-1">
            <ThemeToggle size="sm" />
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay — grouped sections */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-t1-bg/98 backdrop-blur-md flex flex-col transition-colors duration-200">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-t1-border flex-shrink-0">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-t1-text">Menu</span>
            <div className="flex items-center gap-1">
              <ThemeToggle size="md" />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-t1-muted hover:text-t1-text hover:bg-t1-surface"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu Items — grouped with section headers */}
          <nav className="flex-1 overflow-y-auto px-4 py-3">
            {/* Main pages */}
            {[allNavItems[0], allNavItems[1], allNavItems[2]].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium no-underline transition-colors mb-1 ${
                    active
                      ? 'bg-t1-blue/10 text-t1-blue border border-t1-blue/20'
                      : 'text-t1-text hover:bg-t1-surface border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-t1-blue' : 'text-t1-muted'}`} />
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-t1-muted/40 ml-auto" />
                </Link>
              );
            })}

            {/* Sessions group */}
            <div className="mt-3 mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-t1-muted/60 px-4 mb-1">Sessions</p>
            </div>
            {[allNavItems[3], allNavItems[4], allNavItems[5], allNavItems[6]].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium no-underline transition-colors mb-1 ${
                    active
                      ? 'bg-t1-blue/10 text-t1-blue border border-t1-blue/20'
                      : 'text-t1-text hover:bg-t1-surface border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-t1-blue' : 'text-t1-muted'}`} />
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-t1-muted/40 ml-auto" />
                </Link>
              );
            })}

            {/* Player Development group */}
            <div className="mt-3 mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-t1-muted/60 px-4 mb-1">Player Development</p>
            </div>
            {[allNavItems[7], allNavItems[8]].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium no-underline transition-colors mb-1 ${
                    active
                      ? 'bg-t1-blue/10 text-t1-blue border border-t1-blue/20'
                      : 'text-t1-text hover:bg-t1-surface border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-t1-blue' : 'text-t1-muted'}`} />
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-t1-muted/40 ml-auto" />
                </Link>
              );
            })}

            {/* Coach section */}
            <div className="mt-3 mb-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-t1-muted/60 px-4 mb-1">Coach</p>
            </div>
            {[allNavItems[9], allNavItems[10]].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium no-underline transition-colors mb-1 ${
                    active
                      ? 'bg-t1-blue/10 text-t1-blue border border-t1-blue/20'
                      : 'text-t1-text hover:bg-t1-surface border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-t1-blue' : 'text-t1-muted'}`} />
                  {item.label}
                  <ChevronRight className="w-4 h-4 text-t1-muted/40 ml-auto" />
                </Link>
              );
            })}
          </nav>

          {/* Menu Footer */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-t1-border">
            {authEnabled && user && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="mb-3 w-full flex items-center justify-center gap-2 rounded-xl border border-t1-border bg-t1-surface px-4 py-3 text-sm font-medium text-t1-text">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-t1-surface border-t1-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-lg uppercase tracking-wide text-t1-text">Sign out of Tier 1 Coaches App?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-t1-muted">
                      Your synced data is safe in the cloud. Any unsaved local changes could be lost if you sign out right now.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-t1-bg border-t1-border text-t1-text hover:bg-t1-surface">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-t1-blue text-white hover:bg-t1-blue/90" onClick={() => void signOut()}>Sign Out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <p className="text-[10px] text-t1-muted/50 font-display uppercase tracking-widest text-center">
              The Standard Is The Standard.
            </p>
          </div>
        </div>
      )}

      {/* Main Content — extra bottom padding on mobile for bottom nav */}
      <main className="pb-20 lg:pb-12">
        {children}
      </main>

      {/* Footer — hidden on mobile (bottom nav takes its place) */}
      <footer className="hidden lg:block border-t border-t1-border bg-t1-bg transition-colors duration-200">
        <div className="container py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={TIER1_LOGO_WHITE}
              alt="Tier 1"
              className={`h-4 w-auto opacity-50 transition-all duration-200 ${isDark ? '' : 'brightness-0'}`}
            />
            <span className="text-xs text-t1-muted/60">Tier 1 Performance &middot; Internal Coaching Platform</span>
          </div>
          <div className="text-[10px] text-t1-muted/40 font-display uppercase tracking-widest">
            The Standard Is The Standard.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar — 44px+ touch targets */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-t1-border bg-t1-bg/98 backdrop-blur-md safe-area-bottom transition-colors duration-200">
        <div className="grid grid-cols-5 h-16">
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 no-underline transition-colors min-h-[44px] ${
                  active ? 'text-t1-blue' : 'text-t1-muted active:text-t1-text'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium ${active ? 'text-t1-blue' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* More button — opens full screen menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors ${
              mobileOpen ? 'text-t1-blue' : 'text-t1-muted active:text-t1-text'
            }`}
          >
            <Menu className="w-5 h-5" strokeWidth={1.8} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
