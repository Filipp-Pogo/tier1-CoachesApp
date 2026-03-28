/*
  LAYOUT: Tier 1 Performance — Cold Dark Brand
  - Dark persistent top nav with official Tier 1 logo
  - Blue accent (#3b82f6) for active states
  - Inter body, Oswald display
  - Mobile hamburger menu for full nav
  - Sticky bottom nav on mobile with 4 most-used pages
*/
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronRight, LayoutDashboard, Route, BookOpen, Wrench } from 'lucide-react';

const TIER1_LOGO_WHITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ZPsMJTEeF9cNbnWWtGpFHU/tier1_logo_white_e523441d.webp';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/pathway', label: 'Pathway' },
  { href: '/drills', label: 'Drills' },
  { href: '/session-builder', label: 'Session Builder' },
  { href: '/assessments', label: 'Assessments' },
  { href: '/advancement', label: 'Advancement' },
  { href: '/coach-standards', label: 'Coach Standards' },
];

const bottomNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pathway', label: 'Pathway', icon: Route },
  { href: '/drills', label: 'Drills', icon: BookOpen },
  { href: '/session-builder', label: 'Builder', icon: Wrench },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-t1-border bg-t1-bg/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14 lg:h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src={TIER1_LOGO_WHITE} alt="Tier 1 Performance" className="h-7 lg:h-8 w-auto" />
            <div className="flex flex-col">
              <span className="font-display text-sm lg:text-base font-bold tracking-wide text-t1-text leading-none uppercase">
                Tier 1 Academy
              </span>
              <span className="text-[10px] text-t1-muted tracking-widest uppercase hidden sm:block">
                Internal Coaching Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors no-underline ${
                    isActive
                      ? 'bg-t1-blue text-white'
                      : 'text-t1-muted hover:text-t1-text hover:bg-t1-surface'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-t1-surface text-t1-text"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav (full menu) */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-t1-border bg-t1-bg">
            <nav className="container py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium no-underline transition-colors ${
                      isActive
                        ? 'bg-t1-blue text-white'
                        : 'text-t1-muted hover:text-t1-text hover:bg-t1-surface'
                    }`}
                  >
                    {item.label}
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content — extra bottom padding on mobile for bottom nav */}
      <main className="pb-24 lg:pb-16">
        {children}
      </main>

      {/* Footer — hidden on mobile (bottom nav takes its place) */}
      <footer className="hidden lg:block border-t border-t1-border bg-t1-bg">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={TIER1_LOGO_WHITE} alt="Tier 1" className="h-5 w-auto opacity-60" />
            <span className="text-xs text-t1-muted">Tier 1 Performance &middot; Internal Coaching Platform</span>
          </div>
          <div className="text-xs text-t1-muted/50 font-display uppercase tracking-wider">
            The Standard Is The Standard.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-t1-border bg-t1-bg/95 backdrop-blur-md safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg no-underline transition-colors ${
                  isActive
                    ? 'text-t1-blue'
                    : 'text-t1-muted hover:text-t1-text'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-t1-blue' : ''}`} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'text-t1-blue' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          {/* More button to open full menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors ${
              mobileOpen ? 'text-t1-blue' : 'text-t1-muted hover:text-t1-text'
            }`}
          >
            <Menu className="w-5 h-5" strokeWidth={mobileOpen ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium tracking-wide">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
