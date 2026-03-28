/*
  COACH STANDARDS: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Compact hero, tighter spacing, readable on phone.
*/
import { Shield, CheckCircle2, XCircle } from 'lucide-react';
import { coachStandards } from '@/lib/data';

const COACH_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/coaching-standards-jUJVbPUsAco3UFSxK4jJe7.webp';

export default function CoachStandards() {
  return (
    <div>
      {/* Hero — compact on mobile */}
      <section className="relative h-28 sm:h-64 overflow-hidden">
        <img src={COACH_IMG} alt="Tier 1 coaching" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-bg/95 via-t1-bg/80 to-t1-bg/40" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Coach Standards
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm max-w-lg">
            Standard setters, not passive ball feeders.
          </p>
        </div>
      </section>

      <div className="container mt-4 sm:mt-8 space-y-3 sm:space-y-6">
        {/* Intro Banner */}
        <div className="bg-t1-navy rounded-lg p-4 sm:p-8 border border-t1-border">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-t1-blue flex-shrink-0" />
            <div>
              <h2 className="font-display text-sm sm:text-lg font-semibold uppercase tracking-wide text-white mb-1 sm:mb-2">
                The Tier 1 Standard
              </h2>
              <p className="text-xs sm:text-sm text-t1-text/80 leading-relaxed">
                Every session is an opportunity to develop players and people. The way you coach is as important as what you coach.
              </p>
            </div>
          </div>
        </div>

        {/* Standards Sections */}
        {coachStandards.map((section, idx) => {
          const isNegative = section.category === 'What Tier 1 Coaches Are Not';
          return (
            <section key={idx} className={`bg-t1-surface border rounded-lg p-4 sm:p-6 ${isNegative ? 'border-t1-red/30' : 'border-t1-border'}`}>
              <h2 className={`font-display text-sm sm:text-lg font-semibold uppercase tracking-wide mb-3 sm:mb-4 ${isNegative ? 'text-t1-red' : 'text-t1-text'}`}>
                {section.category}
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {isNegative ? (
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-t1-red/60 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-t1-blue flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs sm:text-sm text-t1-text/80">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* Culture Reminder */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
          <h2 className="font-display text-sm sm:text-lg font-semibold uppercase tracking-wide text-t1-text mb-3">
            Remember
          </h2>
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            {[
              'Player first over short term results',
              'Care over profits',
              'Long term development over quick wins',
              'Truth, accountability, and clear communication',
              'High standards in effort and professionalism',
              'Building players and people, not just running drills'
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm text-t1-text/80">{v}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
