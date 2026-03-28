/*
  ASSESSMENTS: Tier 1 Performance — Cold Dark Brand
  Stage-by-stage competency standards
*/
import { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { assessments, pathwayStages } from '@/lib/data';

const ASSESSMENT_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/assessment-bg-eUTW7YwB73FinQ8wZew5gb.webp';

export default function Assessments() {
  const [activeStage, setActiveStage] = useState<string>('all');

  const filteredAssessments = activeStage === 'all'
    ? assessments
    : assessments.filter(a => a.stageId === activeStage || a.stageName.toLowerCase().includes(activeStage));

  const stagesWithAssessments = ['all', 'foundations', 'prep', 'jasa'];
  const stagesWithoutAssessments = ['hs', 'asa', 'fta'];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-40 sm:h-52 overflow-hidden">
        <img src={ASSESSMENT_IMG} alt="Assessment standards" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-t1-bg/95 via-t1-bg/80 to-t1-bg/60" />
        <div className="relative container h-full flex flex-col justify-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Assessments
          </h1>
          <p className="mt-2 text-t1-muted text-sm">
            Tier 1 competency standards by stage. Reference these during player evaluation.
          </p>
        </div>
      </section>

      <div className="container mt-6 space-y-6">
        {/* Stage Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveStage('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeStage === 'all'
                ? 'bg-t1-blue text-white border-t1-blue'
                : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
            }`}
          >
            All Stages
          </button>
          {stagesWithAssessments.filter(s => s !== 'all').map(stageId => {
            const stage = pathwayStages.find(s => s.id === stageId);
            return (
              <button
                key={stageId}
                onClick={() => setActiveStage(stageId)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeStage === stageId
                    ? 'bg-t1-blue text-white border-t1-blue'
                    : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
                }`}
              >
                {stage?.shortName}
              </button>
            );
          })}
        </div>

        {/* Assessment Categories */}
        <div className="text-xs text-t1-muted mb-2 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-t1-blue" />
          Categories: Physical Literacy &middot; Footwork &middot; Baseline &middot; Transition & Net Play &middot; Serve & Return &middot; Character &middot; Competition
        </div>

        {/* Assessment Cards */}
        {filteredAssessments.map((assessment, idx) => (
          <section key={idx} className="bg-t1-surface border border-t1-border rounded-lg overflow-hidden">
            <div className="bg-t1-blue/5 border-b border-t1-border px-6 py-4">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text">
                {assessment.stageName} Standards
              </h2>
              <p className="text-xs text-t1-muted mt-1">
                {pathwayStages.find(s => s.id === assessment.stageId)?.name}
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {assessment.categories.map((cat) => (
                  <div key={cat.name} className="bg-secondary/50 rounded-lg p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-t1-text mb-3 flex items-center gap-1.5 border-b border-t1-border pb-2">
                      <Target className="w-3 h-3 text-t1-blue" />
                      {cat.name}
                    </h3>
                    <ul className="space-y-2">
                      {cat.standards.map((standard, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-t1-blue flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-t1-text/80">{standard}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Placeholder for stages without assessments */}
        {(activeStage === 'all' || stagesWithoutAssessments.includes(activeStage)) && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-text mb-1">
                  Additional Assessments Coming
                </h3>
                <p className="text-sm text-t1-muted">
                  Detailed assessment standards for HS, ASA, and FTA stages are being developed. These sections will be populated as source material becomes available. The assessment framework (Physical Literacy, Footwork, Baseline, Transition, Serve & Return, Character, Competition) will remain consistent across all stages.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
