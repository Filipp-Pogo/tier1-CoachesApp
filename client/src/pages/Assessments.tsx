/*
  ASSESSMENTS: Tier 1 Performance — Cold Dark Brand
  Stage-by-stage competency standards — all 6 stages
*/
import { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';
import { assessments, pathwayStages } from '@/lib/data';

const ASSESSMENT_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663356767696/ELbCQXq8c7BR3Zt5VxeR2S/assessment-bg-eUTW7YwB73FinQ8wZew5gb.webp';

const ALL_STAGE_IDS = ['foundations', 'prep', 'jasa', 'hs', 'asa', 'fta'];

export default function Assessments() {
  const [activeStage, setActiveStage] = useState<string>('all');

  const filteredAssessments = activeStage === 'all'
    ? assessments
    : assessments.filter(a => a.stageId === activeStage || a.stageName.toLowerCase().includes(activeStage));

  // Stages that still have the "developing" banner
  const draftStages = ['hs', 'asa', 'fta'];
  const showDraftBanner = activeStage === 'all' || draftStages.includes(activeStage);

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
        {/* Stage Filter — all 6 stages */}
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
          {ALL_STAGE_IDS.map(stageId => {
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

        {/* Assessment Categories Legend */}
        <div className="text-xs text-t1-muted mb-2 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-t1-blue" />
          Categories: Physical Literacy &middot; Footwork &middot; Baseline &middot; Transition & Net Play &middot; Serve & Return &middot; Character &middot; Competition
        </div>

        {/* Draft notice for HS/ASA/FTA */}
        {showDraftBanner && (
          <div className="bg-t1-surface border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-t1-muted">
                HS, ASA, and FTA assessment standards are draft outlines. These will be refined as detailed source material becomes available.
              </p>
            </div>
          </div>
        )}

        {/* Assessment Cards */}
        {filteredAssessments.map((assessment, idx) => (
          <section key={idx} className="bg-t1-surface border border-t1-border rounded-lg overflow-hidden">
            <div className="bg-t1-blue/5 border-b border-t1-border px-6 py-4">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-t1-text">
                {assessment.stageName} Standards
              </h2>
              <p className="text-xs text-t1-muted mt-1">
                {pathwayStages.find(s => s.id === assessment.stageId)?.name}
                {draftStages.includes(assessment.stageId) && (
                  <span className="ml-2 text-yellow-400">— Draft</span>
                )}
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

        {/* Empty state if no assessments match */}
        {filteredAssessments.length === 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 text-center">
            <Target className="w-8 h-8 text-t1-muted mx-auto mb-3" />
            <p className="text-sm text-t1-muted">No assessments found for this stage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
