/*
  LAYOUT: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Bottom nav is primary on mobile, top bar is minimal.
  Desktop: Full top nav with all links.
  Touch targets: min 44px on mobile.
*/
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Menu, X, ChevronRight, LayoutDashboard, Route, BookOpen,
  Wrench, Target, TrendingUp, Shield, ClipboardList, History, ArrowLeftRight
} from 'lucide-react';

const TIER1_LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ZPsMJTEeF9cNbnWWtGpFHU/tier1_logo_white_e523441d.webp';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pathway', label: 'Pathway', icon: Route },
  { href: '/drills', label: 'Drills', icon: BookOpen },
  { href: '/session-builder', label: 'Session Builder', icon: Wrench },
  { href: '/assessments', label: 'Assessments', icon: Target },
  { href: '/advancement', label: 'Advancement', icon: TrendingUp },
  { href: '/session-plans', label: 'Session Plans', icon: ClipboardList },
  { href: '/session-history', label: 'Session History', icon: History },
  { href: '/compare-plans', label: 'Compare Plans', icon: ArrowLeftRight },
  { href: '/coach-standards', label: 'Coach Standards', icon: Shield },
];

const bottomNavItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/drills', label: 'Drills', icon: BookOpen },
  { href: '/session-builder', label: 'Builder', icon: Wrench },
  { href: '/session-plans', label: 'Plans', icon: ClipboardList },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

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
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar — minimal on mobile, full on desktop */}
      <header className="sticky top-0 z-50 border-b border-t1-border bg-t1-bg/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-12 lg:h-14">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <img src={TIER1_LOGO_WHITE} alt="Tier 1 Performance" className="h-6 lg:h-7 w-auto" />
            <div className="flex flex-col">
              <span className="font-display text-xs lg:text-sm font-bold tracking-wide text-t1-text leading-none uppercase">
                Tier 1 Academy
              </span>
              <span className="text-[9px] text-t1-muted tracking-widest uppercase hidden sm:block">
                Internal Coaching Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
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
            ))}
          </nav>

          {/* Mobile: hamburger hidden — bottom nav + More handles it */}
          <div className="lg:hidden" />
        </div>
      </header>

      {/* Mobile Full-Screen Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-t1-bg/98 backdrop-blur-md flex flex-col">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-t1-border flex-shrink-0">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-t1-text">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-t1-muted hover:text-t1-text hover:bg-t1-surface"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items — large touch targets */}
          <nav className="flex-1 overflow-y-auto px-4 py-3">
            {navItems.map((item) => {
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
      <footer className="hidden lg:block border-t border-t1-border bg-t1-bg">
        <div className="container py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={TIER1_LOGO_WHITE} alt="Tier 1" className="h-4 w-auto opacity-50" />
            <span className="text-xs text-t1-muted/60">Tier 1 Performance &middot; Internal Coaching Platform</span>
          </div>
          <div className="text-[10px] text-t1-muted/40 font-display uppercase tracking-widest">
            The Standard Is The Standard.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar — 44px+ touch targets */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-t1-border bg-t1-bg/98 backdrop-blur-md safe-area-bottom">
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
