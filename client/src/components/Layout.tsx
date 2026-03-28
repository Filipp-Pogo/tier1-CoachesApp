/*
  LAYOUT: Fieldhouse Athletic Institutional Design
  - Persistent top nav with Tier 1 branding
  - Mobile hamburger menu
  - Clean, serious, fast navigation
*/
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/pathway', label: 'Pathway' },
  { href: '/drills', label: 'Drills' },
  { href: '/session-builder', label: 'Session Builder' },
  { href: '/assessments', label: 'Assessments' },
  { href: '/advancement', label: 'Advancement' },
  { href: '/coach-standards', label: 'Coach Standards' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-8 h-8 bg-t1-green rounded-sm flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">T1</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold tracking-wide text-t1-charcoal leading-none uppercase">
                Tier 1 Academy
              </span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase hidden sm:block">
                Woodinville Sports Club
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
                      ? 'bg-t1-green text-white'
                      : 'text-t1-charcoal hover:bg-t1-sand-light'
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
            className="lg:hidden p-2 rounded-md hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white">
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
                        ? 'bg-t1-green text-white'
                        : 'text-t1-charcoal hover:bg-t1-sand-light'
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

      {/* Main Content */}
      <main className="pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-t1-charcoal text-white/70">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-t1-green rounded-sm flex items-center justify-center">
              <span className="text-white font-display font-bold text-[10px]">T1</span>
            </div>
            <span className="text-xs">Tier 1 Academy at Woodinville Sports Club</span>
          </div>
          <div className="text-xs text-white/40">
            Caliber Sports Facility &middot; Internal Coaching Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
