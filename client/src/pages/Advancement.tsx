/*
  ADVANCEMENT: Tier 1 Performance — Cold Dark Brand
  Progression decisions, approval flow, statuses
*/
import { CheckCircle2, Clock, XCircle, ArrowRight, Shield, MessageSquare } from 'lucide-react';
import { advancementInfo } from '@/lib/data';

const statusIcons: Record<string, React.ReactNode> = {
  Approved: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  Pending: <Clock className="w-5 h-5 text-yellow-400" />,
  Deferred: <XCircle className="w-5 h-5 text-t1-red" />,
};

const statusColors: Record<string, string> = {
  Approved: 'border-green-500/30 bg-green-500/10',
  Pending: 'border-yellow-500/30 bg-yellow-500/10',
  Deferred: 'border-t1-red/30 bg-t1-red/10',
};

export default function Advancement() {
  return (
    <div>
      {/* Header */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Advancement
          </h1>
          <p className="mt-2 text-t1-muted text-sm max-w-2xl">
            Player movement at Tier 1 is not random and it is not parent driven. Advancement is based on continuous observation, formal assessment, weekly coach review, leadership approval, holistic readiness, and cultural alignment.
          </p>
        </div>
      </section>

      <div className="container mt-8 space-y-8">
        {/* Philosophy */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-t1-blue" /> Advancement Philosophy
          </h2>
          <ul className="space-y-3">
            {advancementInfo.philosophy.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-t1-text/80">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Statuses */}
        <section>
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text mb-4">
            Advancement Statuses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {advancementInfo.statuses.map((status) => (
              <div key={status.name} className={`border rounded-lg p-5 ${statusColors[status.name]}`}>
                <div className="flex items-center gap-2 mb-3">
                  {statusIcons[status.name]}
                  <h3 className="font-display text-base font-semibold uppercase tracking-wide text-t1-text">
                    {status.name}
                  </h3>
                </div>
                <p className="text-sm text-t1-text/80 leading-relaxed">{status.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Readiness Factors */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text mb-4">
            What Readiness Means
          </h2>
          <p className="text-sm text-t1-muted mb-4">
            A player must show readiness across all of these dimensions. Technical skill alone is not enough.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {advancementInfo.factors.map((factor, i) => (
              <div key={i} className="flex items-start gap-3 bg-secondary/50 rounded-md p-3">
                <CheckCircle2 className="w-4 h-4 text-t1-blue flex-shrink-0 mt-0.5" />
                <span className="text-sm text-t1-text/80">{factor}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Approval Chain */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text mb-4">
            Approval Structure
          </h2>
          <div className="space-y-3">
            {advancementInfo.approvalChain.map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-secondary/50 rounded-md p-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-t1-text">{item.stage}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-t1-muted flex-shrink-0" />
                <span className="text-sm font-semibold text-t1-blue bg-t1-blue/10 px-3 py-1 rounded">
                  {item.owner}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Communication Standards */}
        <section className="bg-t1-surface border border-t1-border rounded-lg p-6">
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-t1-blue" /> Family Communication Standard
          </h2>
          <p className="text-sm text-t1-muted mb-4">
            Coaches communicate internally first before talking to families about advancement. Families should only be informed after approval.
          </p>
          <ul className="space-y-2.5">
            {advancementInfo.communicationStandards.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-t1-blue flex-shrink-0 mt-0.5" />
                <span className="text-sm text-t1-text/80">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
