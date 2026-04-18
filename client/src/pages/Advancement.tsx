/*
  ADVANCEMENT: Tier 1 Performance — Playbook Aesthetic
  MOBILE-FIRST: Compact header, tighter spacing, stacked cards on mobile.
*/
import { CheckCircle2, Clock, XCircle, ArrowRight, Shield, MessageSquare } from 'lucide-react';
import { advancementInfo } from '@/lib/data';

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />,
  Pending: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />,
  Deferred: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-t1-red" />,
};

const statusColors: Record<string, string> = {
  Approved: 'border-emerald-500/25 bg-emerald-500/10',
  Pending: 'border-amber-500/25 bg-amber-500/10',
  Deferred: 'border-t1-red/30 bg-t1-red/10',
};

export default function Advancement() {
  return (
    <div>
      {/* Header — compact on mobile */}
      <section className="bg-t1-accent/10 border-b border-t1-border">
        <div className="container py-4 sm:py-8">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-t1-text">
            Advancement
          </h1>
          <p className="mt-1 sm:mt-2 text-t1-muted text-xs sm:text-sm max-w-2xl">
            Player movement is based on observation, assessment, coach review, leadership approval, and cultural alignment. Not parent requests.
          </p>
        </div>
      </section>

      <div className="container mt-4 sm:mt-8 space-y-4 sm:space-y-8">
        {/* Philosophy */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
          <h2 className="font-display text-sm sm:text-lg font-semibold text-t1-text mb-3 sm:mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-t1-accent" /> Philosophy
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {advancementInfo.philosophy.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-t1-accent text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm text-t1-text/80">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Statuses */}
        <section>
          <h2 className="font-display text-sm sm:text-lg font-semibold text-t1-text mb-3 sm:mb-4">
            Statuses
          </h2>
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
            {advancementInfo.statuses.map((status) => (
              <div key={status.name} className={`border rounded-lg p-3 sm:p-5 ${statusColors[status.name]}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  {statusIcons[status.name]}
                  <h3 className="font-display text-sm sm:text-base font-semibold text-t1-text">
                    {status.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-t1-text/80 leading-relaxed">{status.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Readiness Factors */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
          <h2 className="font-display text-sm sm:text-lg font-semibold text-t1-text mb-2 sm:mb-4">
            What Readiness Means
          </h2>
          <p className="text-xs sm:text-sm text-t1-muted mb-3">
            Technical skill alone is not enough. All dimensions matter.
          </p>
          <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
            {advancementInfo.factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-secondary/50 rounded-md p-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-t1-accent flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-t1-text/80">{factor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Approval Chain */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
          <h2 className="font-display text-sm sm:text-lg font-semibold text-t1-text mb-3 sm:mb-4">
            Approval Structure
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {advancementInfo.approvalChain.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-secondary/50 rounded-md p-3 sm:p-4">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-t1-accent text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm font-medium text-t1-text flex-1 min-w-0">{item.stage}</span>
                <ArrowRight className="w-3.5 h-3.5 text-t1-muted flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-t1-accent bg-t1-accent/10 px-2 sm:px-3 py-1 rounded flex-shrink-0">
                  {item.owner}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Communication Standards */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-4 sm:p-6">
          <h2 className="font-display text-sm sm:text-lg font-semibold text-t1-text mb-3 sm:mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-t1-accent" /> Family Communication
          </h2>
          <p className="text-xs sm:text-sm text-t1-muted mb-3">
            Internal alignment first. Families informed only after approval.
          </p>
          <ul className="space-y-2">
            {advancementInfo.communicationStandards.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-t1-accent flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-t1-text/80">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
