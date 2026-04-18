import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Clock,
  Lightbulb,
  ListChecks,
  Shuffle,
  Star,
  Target,
  Video,
} from "lucide-react";
import { useDrills, usePathwayStages, useSessionBlocks } from "@/hooks/useContentData";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentDrills } from "@/hooks/useRecentDrills";
import { buildDrillCoachGuide } from "@/lib/drillGuidance";
import {
  buildDrillLibrarySearch,
  getDrillPrimaryStage,
  readDrillLibraryStateFromSearch,
} from "@/lib/drillFilters";
import { getStageBrand } from "@/lib/stageBranding";
import { CourtDiagram } from "@/components/CourtDiagram";

function getEmbedUrl(url: string): string | null {
  try {
    const yt = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    );
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  } catch {
    /* ignore */
  }
  return null;
}

function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-t1-border bg-t1-surface">
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <span className="chip-label font-display text-t1-text">{title}</span>
        <ChevronDown className={`h-4 w-4 text-t1-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-t1-border px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

export default function DrillDetail() {
  const { data: drills } = useDrills();
  const { data: pathwayStages } = usePathwayStages();
  const { data: sessionBlocks } = useSessionBlocks();
  const { id } = useParams<{ id: string }>();
  const drill = drills.find(item => item.id === id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentDrills();

  const backNav = useMemo(() => {
    const search = typeof window === "undefined" ? "" : window.location.search;
    if (!search) return { href: "/drills", label: "Drill Library" };
    const state = readDrillLibraryStateFromSearch(search, "");
    const stage = pathwayStages.find(s => s.id === state.level);
    return { href: `/drills${buildDrillLibrarySearch(state)}`, label: stage ? `${stage.shortName} drills` : "Drill Library" };
  }, [pathwayStages]);

  useEffect(() => {
    if (drill) addRecent(drill.id);
  }, [addRecent, drill]);

  if (!drill) return (
    <div className="container py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-t1-text">Drill Not Found</h1>
      <Link href={backNav.href} className="mt-4 inline-block text-t1-accent">Back to {backNav.label}</Link>
    </div>
  );

  const block = sessionBlocks.find(b => b.id === drill.sessionBlock);
  const primaryStageId = getDrillPrimaryStage(drill, "");
  const brand = getStageBrand(primaryStageId);
  const stage = pathwayStages.find(s => s.id === primaryStageId);
  const favorited = isFavorite(drill.id);
  const embedUrl = drill.videoUrl ? getEmbedUrl(drill.videoUrl) : null;
  const guide = buildDrillCoachGuide(drill);

  return (
    <div className="container max-w-2xl py-4 sm:py-6">
      {/* Back link */}
      <Link
        href={backNav.href}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-t1-muted no-underline hover:text-t1-accent"
      >
        <ArrowLeft className="h-4 w-4" /> {backNav.label}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-bold text-t1-text sm:text-2xl">
            {drill.name}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-t1-text/70">
            {drill.objective}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${brand.badgeClassName}`}
            >
              <span className={`h-2 w-2 rounded-full ${brand.dotClassName}`} />
              {stage?.shortName}
            </span>
            {block && (
              <span className="chip-label rounded-full bg-secondary px-2.5 py-0.5 text-t1-muted">
                {block.shortName}
              </span>
            )}
            <span className="chip-label flex items-center gap-1 text-t1-muted">
              <Clock className="h-3 w-3" /> {drill.recommendedTime}
            </span>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(drill.id)}
          className={`flex-shrink-0 rounded-full border p-2.5 transition-colors ${
            favorited
              ? "border-amber-500/30 bg-amber-500/100/12 text-amber-500"
              : "border-t1-border bg-t1-surface text-t1-muted hover:text-amber-400"
          }`}
          aria-label={favorited ? `Unsave ${drill.name}` : `Save ${drill.name}`}
        >
          <Star className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Video */}
      {drill.videoUrl && (
        <section className="mt-5 overflow-hidden rounded-xl border border-t1-border bg-t1-surface">
          {embedUrl ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={embedUrl}
                title={`${drill.name} demo video`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={drill.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-4 text-sm text-t1-accent hover:underline"
            >
              <Video className="h-4 w-4" /> Open demo video
            </a>
          )}
        </section>
      )}

      {/* Court Diagram */}
      {drill.diagram && (
        <section className="mt-5 rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <CourtDiagram diagram={drill.diagram} className="mx-auto max-w-sm" />
        </section>
      )}

      {/* Why It Matters */}
      {drill.whyItMatters && (
        <section className="mt-3 flex gap-3 rounded-xl border border-t1-accent/20 bg-t1-accent/5 p-4 sm:p-5">
          <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-t1-accent" />
          <div>
            <h2 className="chip-label mb-1 font-display text-t1-accent">Why It Matters</h2>
            <p className="body-copy-sm text-t1-text/80">{drill.whyItMatters}</p>
          </div>
        </section>
      )}

      {/* How to Run It — prefer stepByStep when available */}
      <section className="mt-5 rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
        <h2 className="chip-label mb-4 flex items-center gap-2 font-display text-t1-text">
          <ListChecks className="h-4 w-4 text-t1-accent" /> How to Run It
        </h2>
        <ol className="space-y-3">
          {(drill.stepByStep ?? guide.howToRun).map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <span className="body-copy-sm text-t1-text/80">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* What to Coach */}
      <section className="mt-3 rounded-xl border border-t1-accent/20 bg-t1-accent/5 p-4 sm:p-5">
        <h2 className="chip-label mb-4 flex items-center gap-2 font-display text-t1-accent">
          <Target className="h-4 w-4" /> What to Coach
        </h2>
        <ul className="space-y-2.5">
          {guide.whatToCoach.map(cue => (
            <li key={cue} className="flex items-start gap-2.5">
              <span className="mt-1.5 flex-shrink-0 text-t1-accent">&#10003;</span>
              <span className="body-copy-sm text-t1-text/80">{cue}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Common Setup Errors */}
      {drill.commonSetupErrors && drill.commonSetupErrors.length > 0 && (
        <section className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 sm:p-5">
          <h2 className="chip-label mb-3 flex items-center gap-2 font-display text-amber-400">
            <AlertTriangle className="h-4 w-4" /> Common Setup Mistakes
          </h2>
          <ul className="space-y-2">
            {drill.commonSetupErrors.map(err => (
              <li key={err} className="flex items-start gap-2.5 body-copy-sm text-amber-300/80">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500/100" />
                <span>{err}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Variations */}
      {drill.variations && drill.variations.length > 0 && (
        <section className="mt-3 rounded-xl border border-t1-border bg-t1-surface p-4 sm:p-5">
          <h2 className="chip-label mb-3 flex items-center gap-2 font-display text-t1-text">
            <Shuffle className="h-4 w-4 text-t1-accent" /> Variations
          </h2>
          <ul className="space-y-2">
            {drill.variations.map(v => (
              <li key={v} className="flex items-start gap-2.5 body-copy-sm text-t1-text/80">
                <span className="mt-1.5 flex-shrink-0 text-t1-accent">&#9654;</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Collapsible extras */}
      <div className="mt-5 space-y-2">
        {drill.standards.length > 0 && (
          <Collapsible title="Standards">
            <ul className="space-y-2">
              {drill.standards.map(s => (
                <li key={s} className="flex items-start gap-2.5 body-copy-sm text-t1-text/80">
                  <span className="mt-0.5 flex-shrink-0 text-t1-accent">&#10003;</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {drill.commonBreakdowns.length > 0 && (
          <Collapsible title="Common Breakdowns">
            <ul className="space-y-2">
              {drill.commonBreakdowns.map(b => (
                <li key={b} className="flex items-start gap-2.5 body-copy-sm text-t1-text/80">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-t1-red" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Collapsible>
        )}

        {drill.progression && (
          <Collapsible title="Progression / Regression">
            <div className="space-y-3 body-copy-sm text-t1-text/80">
              <p><span className="font-semibold text-t1-text">Progression:</span> {drill.progression}</p>
              <p><span className="font-semibold text-t1-text">Regression:</span> {drill.regression}</p>
            </div>
          </Collapsible>
        )}

        {drill.competitiveVariation && (
          <Collapsible title="Competitive Variation">
            <p className="body-copy-sm text-t1-text/80">{drill.competitiveVariation}</p>
          </Collapsible>
        )}

        {drill.matchPlayRelevance && (
          <Collapsible title="Match Play Relevance">
            <p className="body-copy-sm text-t1-text/80">{drill.matchPlayRelevance}</p>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
