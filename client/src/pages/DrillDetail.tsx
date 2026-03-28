/*
  DRILL DETAIL: Tier 1 Performance — Cold Dark Brand
  Full drill card with coaching fields, video embed, favorite toggle,
  Quick Copy coaching cues button, and recently viewed tracking
*/
import { useParams, Link } from 'wouter';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Clock, Target, AlertTriangle, TrendingUp, TrendingDown, Swords, Crosshair, Star, Video, ExternalLink, Clipboard, Check } from 'lucide-react';
import { drills, pathwayStages, sessionBlocks, skillCategories } from '@/lib/data';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentDrills } from '@/hooks/useRecentDrills';

/** Parse a YouTube or Vimeo URL into an embeddable src, or return null */
function getEmbedUrl(url: string): string | null {
  try {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vmMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
  } catch { /* ignore */ }
  return null;
}

export default function DrillDetail() {
  const { id } = useParams<{ id: string }>();
  const drill = drills.find(d => d.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentDrills();
  const [copied, setCopied] = useState(false);

  // Track this drill as recently viewed
  useEffect(() => {
    if (drill) addRecent(drill.id);
  }, [drill?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = useCallback(() => {
    if (!drill) return;
    const text = [
      `${drill.name} — Coaching Cues`,
      '',
      ...drill.coachingCues.map((c, i) => `${i + 1}. ${c}`),
      '',
      `Setup: ${drill.setup}`,
      '',
      `Standards:`,
      ...drill.standards.map(s => `✓ ${s}`),
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [drill]);

  if (!drill) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-bold uppercase text-t1-text">Drill Not Found</h1>
        <Link href="/drills" className="text-t1-blue mt-4 inline-block">Back to Drill Library</Link>
      </div>
    );
  }

  const block = sessionBlocks.find(b => b.id === drill.sessionBlock);
  const category = skillCategories.find(c => c.id === drill.skillCategory);
  const favorited = isFavorite(drill.id);
  const embedUrl = drill.videoUrl ? getEmbedUrl(drill.videoUrl) : null;

  return (
    <div className="container py-6">
      <Link href="/drills" className="inline-flex items-center gap-1.5 text-sm text-t1-muted hover:text-t1-blue no-underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Drill Library
      </Link>

      {/* Header */}
      <div className="bg-t1-surface border border-t1-border rounded-lg p-5 sm:p-6 mb-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-xl sm:text-3xl font-bold uppercase tracking-wide text-t1-text">
            {drill.name}
          </h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick Copy */}
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                copied
                  ? 'bg-green-500/15 border-green-500/30 text-green-400'
                  : 'bg-t1-surface border-t1-border text-t1-muted hover:border-t1-blue/40 hover:text-t1-blue'
              }`}
              title="Copy coaching cues, setup, and standards to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            {/* Favorite */}
            <button
              onClick={() => toggleFavorite(drill.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                favorited
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                  : 'bg-t1-surface border-t1-border text-t1-muted hover:border-yellow-500/40 hover:text-yellow-400'
              }`}
              title={favorited ? 'Remove from My Drills' : 'Add to My Drills'}
            >
              <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-yellow-400' : ''}`} />
              <span className="hidden sm:inline">{favorited ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {drill.level.map(l => (
            <span key={l} className="text-xs bg-t1-blue/10 text-t1-blue px-2.5 py-1 rounded font-medium uppercase tracking-wider">
              {pathwayStages.find(s => s.id === l)?.shortName}
            </span>
          ))}
          <span className="text-xs bg-secondary text-t1-muted px-2.5 py-1 rounded font-medium uppercase tracking-wider">
            {block?.name}
          </span>
          <span className="text-xs bg-secondary text-t1-muted px-2.5 py-1 rounded font-medium uppercase tracking-wider">
            {category?.name}
          </span>
          <span className="text-xs bg-secondary text-t1-muted px-2.5 py-1 rounded font-medium uppercase tracking-wider capitalize">
            {drill.type}
          </span>
          <span className="text-xs bg-secondary text-t1-muted px-2.5 py-1 rounded font-medium uppercase tracking-wider capitalize">
            {drill.feedingStyle.replace('-', ' ')}
          </span>
          <span className="flex items-center gap-1 text-xs text-t1-muted">
            <Clock className="w-3 h-3" /> {drill.recommendedTime}
          </span>
        </div>
      </div>

      {/* Video Section */}
      {drill.videoUrl && (
        <div className="bg-t1-surface border border-t1-border rounded-lg overflow-hidden mb-4">
          {embedUrl ? (
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={embedUrl}
                title={`${drill.name} — Demo Video`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-t1-blue" />
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text">
                  Demo Video
                </h2>
              </div>
              <a
                href={drill.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-t1-blue hover:underline"
              >
                Open video <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Video placeholder */}
      {!drill.videoUrl && (
        <div className="bg-t1-surface border border-dashed border-t1-border rounded-lg p-5 mb-4">
          <div className="flex items-center gap-3 text-t1-muted">
            <Video className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-t1-text/60">No demo video attached</p>
              <p className="text-xs text-t1-muted/70 mt-0.5">Video URLs can be added to drill entries in the data model.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Coaching Cues — FIRST on the page for on-court coaches */}
          <div className="bg-t1-blue/5 border border-t1-blue/20 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-blue">
                Coaching Cues
              </h2>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  copied
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                    : 'bg-t1-surface border border-t1-border text-t1-muted hover:text-t1-blue hover:border-t1-blue/40'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy All'}
              </button>
            </div>
            <ul className="space-y-2">
              {drill.coachingCues.map((cue, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-t1-blue text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-t1-text/80">{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Objective */}
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-t1-blue" /> Objective
            </h2>
            <p className="text-sm text-t1-text/80 leading-relaxed">{drill.objective}</p>
          </div>

          {/* Setup */}
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-2">
              Setup
            </h2>
            <p className="text-sm text-t1-text/80 leading-relaxed">{drill.setup}</p>
          </div>

          {/* Standards */}
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-3 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-t1-blue" /> Standards / Success Measures
            </h2>
            <ul className="space-y-2">
              {drill.standards.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-t1-text/80">
                  <span className="text-t1-blue mt-1">&#10003;</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Breakdowns */}
          <div className="bg-t1-red/5 border border-t1-red/15 rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-red mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Common Breakdowns
            </h2>
            <ul className="space-y-2">
              {drill.commonBreakdowns.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-t1-text/80">
                  <span className="text-t1-red mt-1">&times;</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Progression */}
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-t1-blue" /> Progression
            </h2>
            <p className="text-sm text-t1-text/80 leading-relaxed">{drill.progression}</p>
          </div>

          {/* Regression */}
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-2 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-t1-blue-light" /> Regression
            </h2>
            <p className="text-sm text-t1-text/80 leading-relaxed">{drill.regression}</p>
          </div>

          {/* Competitive Variation */}
          <div className="bg-t1-surface border border-t1-border rounded-lg p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-t1-text mb-2 flex items-center gap-2">
              <Swords className="w-4 h-4 text-t1-blue" /> Competitive Variation
            </h2>
            <p className="text-sm text-t1-text/80 leading-relaxed">{drill.competitiveVariation}</p>
          </div>

          {/* Match Play Relevance */}
          <div className="bg-t1-navy rounded-lg p-5 border border-t1-border">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white mb-2">
              Why It Matters in Match Play
            </h2>
            <p className="text-sm text-t1-text/80 leading-relaxed">{drill.matchPlayRelevance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
