/*
  SESSION BUILDER: Tier 1 Performance — Cold Dark Brand
  Build a practice, assign drills, export PDF
*/
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Plus, X, Clock, ChevronRight, Dumbbell, GripVertical, Printer, FileDown } from 'lucide-react';
import { pathwayStages, sessionBlocks, drills, sessionTemplates, type PathwayStageId, type SessionBlockId } from '@/lib/data';
import { exportSessionPDF } from '@/lib/session-pdf';

interface SessionBlockEntry {
  blockId: SessionBlockId;
  drillId?: string;
  duration: string;
  notes: string;
}

export default function SessionBuilder() {
  const [selectedLevel, setSelectedLevel] = useState<PathwayStageId>('foundations');
  const [sessionTime, setSessionTime] = useState('60');
  const [blocks, setBlocks] = useState<SessionBlockEntry[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);

  const levelDrills = useMemo(() => {
    return drills.filter(d => d.level.includes(selectedLevel));
  }, [selectedLevel]);

  const addBlock = (blockId: SessionBlockId) => {
    const block = sessionBlocks.find(b => b.id === blockId);
    setBlocks(prev => [...prev, {
      blockId,
      duration: block?.typicalDuration.split('-')[0].trim() + ' min' || '10 min',
      notes: ''
    }]);
    setShowTemplates(false);
  };

  const removeBlock = (index: number) => {
    setBlocks(prev => prev.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updates: Partial<SessionBlockEntry>) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, ...updates } : b));
  };

  const loadTemplate = (templateId: string) => {
    const template = sessionTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedLevel(template.level);
      setSessionTime(template.totalTime.replace(' min', ''));
      setBlocks(template.blocks.map(b => ({
        blockId: b.blockId,
        duration: b.duration,
        notes: b.notes
      })));
      setShowTemplates(false);
    }
  };

  const handleExport = () => {
    exportSessionPDF({
      level: selectedLevel,
      totalTime: sessionTime,
      blocks
    });
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-6">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Session Builder
          </h1>
          <p className="mt-2 text-t1-muted text-sm">
            Build a Tier 1 practice. Select your level, choose blocks, and assign drills.
          </p>
        </div>
      </section>

      <div className="container mt-6 space-y-6">
        {/* Session Config */}
        <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Level</label>
              <div className="flex flex-wrap gap-2">
                {pathwayStages.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedLevel(stage.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedLevel === stage.id
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40'
                    }`}
                  >
                    {stage.shortName}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:w-40">
              <label className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-2 block">Total Time</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-20 px-3 py-1.5 bg-t1-surface border border-t1-border rounded-lg text-sm text-t1-text focus:outline-none focus:ring-2 focus:ring-t1-blue/30"
                  min="30"
                  max="180"
                  step="15"
                />
                <span className="text-sm text-t1-muted">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        {showTemplates && blocks.length === 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-3">
              Start from a Template
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sessionTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template.id)}
                  className="text-left p-4 border border-t1-border rounded-lg hover:border-t1-blue/40 hover:shadow-lg hover:shadow-t1-blue/5 transition-all bg-t1-bg"
                >
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-text">
                    {template.name}
                  </h3>
                  <p className="text-xs text-t1-muted mt-1">{template.totalTime} &middot; {template.blocks.length} blocks</p>
                </button>
              ))}
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => setShowTemplates(false)}
                className="text-xs text-t1-blue font-medium hover:underline"
              >
                Or build from scratch
              </button>
            </div>
          </div>
        )}

        {/* Session Blocks */}
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const blockInfo = sessionBlocks.find(b => b.id === block.blockId);
            const blockDrills = levelDrills.filter(d => d.sessionBlock === block.blockId);
            const selectedDrill = block.drillId ? drills.find(d => d.id === block.drillId) : null;

            return (
              <div key={index} className="bg-t1-surface border border-t1-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 mt-1">
                    <GripVertical className="w-4 h-4 text-t1-muted/40" />
                    <span className="w-6 h-6 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-t1-text">
                        {blockInfo?.name}
                      </h3>
                      <button onClick={() => removeBlock(index)} className="text-t1-muted hover:text-t1-red">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="sm:w-24">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 block">Duration</label>
                        <input
                          type="text"
                          value={block.duration}
                          onChange={(e) => updateBlock(index, { duration: e.target.value })}
                          className="w-full px-2 py-1 bg-t1-bg border border-t1-border rounded text-xs text-t1-text focus:outline-none focus:ring-1 focus:ring-t1-blue/30"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 block">Drill (optional)</label>
                        <select
                          value={block.drillId || ''}
                          onChange={(e) => updateBlock(index, { drillId: e.target.value || undefined })}
                          className="w-full px-2 py-1 bg-t1-bg border border-t1-border rounded text-xs text-t1-text focus:outline-none focus:ring-1 focus:ring-t1-blue/30"
                        >
                          <option value="">Select a drill...</option>
                          {blockDrills.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1 block">Notes</label>
                        <input
                          type="text"
                          value={block.notes}
                          onChange={(e) => updateBlock(index, { notes: e.target.value })}
                          placeholder={blockInfo?.description}
                          className="w-full px-2 py-1 bg-t1-bg border border-t1-border rounded text-xs text-t1-text placeholder:text-t1-muted/50 focus:outline-none focus:ring-1 focus:ring-t1-blue/30"
                        />
                      </div>
                    </div>
                    {selectedDrill && (
                      <Link
                        href={`/drills/${selectedDrill.id}`}
                        className="mt-2 inline-flex items-center gap-1 text-[10px] text-t1-blue font-medium hover:underline no-underline"
                      >
                        View drill details <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Block */}
        <div className="bg-t1-surface border border-dashed border-t1-border-strong rounded-lg p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-t1-muted mb-3">Add a Block</h3>
          <div className="flex flex-wrap gap-2">
            {sessionBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => addBlock(block.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-t1-border rounded-lg text-xs font-medium text-t1-muted hover:border-t1-blue/40 hover:text-t1-blue hover:bg-t1-blue/5 transition-colors"
              >
                <Plus className="w-3 h-3" /> {block.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Session Summary + Export */}
        {blocks.length > 0 && (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-t1-blue" /> Session Summary
              </h2>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-t1-blue text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-t1-blue-light transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Export / Print
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-t1-muted mb-3">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {sessionTime} min total</span>
              <span>{blocks.length} blocks</span>
              <span>{pathwayStages.find(s => s.id === selectedLevel)?.shortName} level</span>
            </div>
            <div className="space-y-1">
              {blocks.map((block, i) => {
                const info = sessionBlocks.find(b => b.id === block.blockId);
                const drill = block.drillId ? drills.find(d => d.id === block.drillId) : null;
                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-5 text-t1-muted font-mono">{i + 1}.</span>
                    <span className="font-medium text-t1-text w-32">{info?.shortName}</span>
                    <span className="text-t1-muted w-16">{block.duration}</span>
                    <span className="text-t1-muted">{drill?.name || block.notes || info?.description}</span>
                  </div>
                );
              })}
            </div>

            {/* Secondary export option */}
            <div className="mt-4 pt-3 border-t border-t1-border flex items-center gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 text-xs text-t1-blue font-medium hover:underline"
              >
                <FileDown className="w-3.5 h-3.5" />
                Save as PDF for on-court reference
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
