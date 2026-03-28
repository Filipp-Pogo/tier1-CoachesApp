/*
  COACH STANDARDS: Tier 1 coaching expectations and professional standards
  Fieldhouse design — bold sections, clear expectations
*/
import { Shield, CheckCircle2, XCircle } from 'lucide-react';
import { coachStandards } from '@/lib/data';

const COACH_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/coaching-standards-jUJVbPUsAco3UFSxK4jJe7.webp';

export default function CoachStandards() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-48 sm:h-64 overflow-hidden">
        <img src={COACH_IMG} alt="Tier 1 coaching" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-charcoal/90 via-t1-charcoal/70 to-transparent" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Coach Standards
          </h1>
          <p className="mt-2 text-white/80 text-sm max-w-lg">
            What it means to coach the Tier 1 way. Standard setters, not passive ball feeders.
          </p>
        </div>
      </section>

      <div className="container mt-8 space-y-6">
        {/* Intro Banner */}
        <div className="bg-t1-charcoal rounded-lg p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-t1-green flex-shrink-0" />
            <div>
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white mb-2">
                The Tier 1 Standard
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Tier 1 coaches are standard setters, not passive ball feeders. Coaches should not lower standards by being lazy, distracted, vague, or casual in presentation. Every session is an opportunity to develop players and people. The way you coach is as important as what you coach.
              </p>
            </div>
          </div>
        </div>

        {/* Standards Sections */}
        {coachStandards.map((section, idx) => {
          const isNegative = section.category === 'What Tier 1 Coaches Are Not';
          return (
            <section key={idx} className={`bg-white border rounded-lg p-6 ${isNegative ? 'border-red-200' : 'border-border'}`}>
              <h2 className={`font-display text-lg font-semibold uppercase tracking-wide mb-4 ${isNegative ? 'text-red-700' : 'text-t1-charcoal'}`}>
                {section.category}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {isNegative ? (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-t1-green flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* Culture Reminder */}
        <section className="bg-t1-sand-light/50 border border-t1-sand rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-charcoal mb-3">
            Remember
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Player first over short term results',
              'Care over profits',
              'Long term development over quick wins',
              'Truth, accountability, and clear communication',
              'High standards in effort and professionalism',
              'Building players and people, not just running drills'
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-t1-green text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/80">{v}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
