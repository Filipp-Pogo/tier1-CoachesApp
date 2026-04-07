import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link, useParams } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clipboard,
  Clock,
  Crosshair,
  ExternalLink,
  Info,
  ListChecks,
  Star,
  Swords,
  Target,
  TrendingDown,
  TrendingUp,
  Video,
} from "lucide-react";
import { useDrills, usePathwayStages, useSessionBlocks } from "@/hooks/useContentData";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentDrills } from "@/hooks/useRecentDrills";
import {
  buildDrillClipboardText,
  buildDrillCoachGuide,
} from "@/lib/drillGuidance";
import { formatSubBand } from "@/lib/customPlans";
import {
  buildDrillLibrarySearch,
  drillCoachingGoalFilters,
  drillComplexityFilters,
  drillIntensityFilters,
  drillTrainingFocusFilters,
  getDrillComplexity,
  getDrillIntensity,
  getDrillPrimaryStage,
  getPrimaryDrillCoachingGoal,
  getPrimaryDrillTrainingFocus,
  readDrillLibraryStateFromSearch,
} from "@/lib/drillFilters";

function getEmbedUrl(url: string): string | null {
  try {
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  } catch {
    // ignore malformed URLs
  }

  return null;
}

function getBackNavigation(search: string, pathwayStages: { id: string; shortName: string }[]) {
  if (!search) {
    return {
      href: "/drills",
      label: "Back to Drill Library",
    };
  }

  const state = readDrillLibraryStateFromSearch(search, "");
  const stage = pathwayStages.find(item => item.id === state.level);
  const query = buildDrillLibrarySearch(state);

  return {
    href: query ? `/drills${query}` : "/drills",
    label: stage
      ? `Back to ${stage.shortName} drills`
      : "Back to Drill Library",
  };
}

function DetailPanel({
  children,
  title,
  icon,
  tone = "default",
}: {
  children: ReactNode;
  title: string;
  icon?: ReactNode;
  tone?: "default" | "coach" | "alert";
}) {
  const toneClassName =
    tone === "coach"
      ? "border-t1-accent/20 bg-t1-accent/5"
      : tone === "alert"
        ? "border-t1-red/15 bg-t1-red/5"
        : "border-t1-border bg-t1-surface";
  const titleClassName =
    tone === "coach"
      ? "text-t1-accent"
      : tone === "alert"
        ? "text-t1-red"
        : "text-t1-text";

  return (
    <section
      className={`rounded-xl border p-4 sm:p-5 lg:p-6 ${toneClassName}`}
    >
      <h2
        className={`chip-label mb-4 flex items-center gap-2 font-display ${titleClassName}`}
      >
        {icon}
        {title}
      </h2>
      {children}
    </section>
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
  const [copied, setCopied] = useState(false);
  const backNavigation = useMemo(
    () =>
      getBackNavigation(
        typeof window === "undefined" ? "" : window.location.search,
        pathwayStages
      ),
    [pathwayStages]
  );

  useEffect(() => {
    if (drill) addRecent(drill.id);
  }, [addRecent, drill]);

  const handleCopy = useCallback(() => {
    if (!drill) return;

    navigator.clipboard
      .writeText(buildDrillClipboardText(drill))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  }, [drill]);

  if (!drill) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-t1-text">
          Drill Not Found
        </h1>
        <Link
          href={backNavigation.href}
          className="mt-4 inline-block text-t1-accent"
        >
          {backNavigation.label}
        </Link>
      </div>
    );
  }

  const block = sessionBlocks.find(item => item.id === drill.sessionBlock);
  const primaryStageId = getDrillPrimaryStage(drill, "");
  const primaryStage = pathwayStages.find(item => item.id === primaryStageId);
  const leadFocus = drillTrainingFocusFilters.find(
    item => item.id === getPrimaryDrillTrainingFocus(drill)
  );
  const leadGoal = drillCoachingGoalFilters.find(
    item => item.id === getPrimaryDrillCoachingGoal(drill)
  );
  const intensity = drillIntensityFilters.find(
    item => item.id === getDrillIntensity(drill)
  );
  const complexity = drillComplexityFilters.find(
    item => item.id === getDrillComplexity(drill)
  );
  const favorited = isFavorite(drill.id);
  const embedUrl = drill.videoUrl ? getEmbedUrl(drill.videoUrl) : null;
  const guide = buildDrillCoachGuide(drill);

  return (
    <div>
      <div className="sticky top-12 z-30 border-b border-t1-border bg-t1-bg/95 backdrop-blur-sm lg:hidden">
        <div className="container flex items-center justify-between py-2">
          <Link
            href={backNavigation.href}
            className="flex min-h-[40px] items-center gap-1.5 text-[0.92rem] font-medium text-t1-muted no-underline active:text-t1-accent"
          >
            <ArrowLeft className="h-4 w-4" /> {backNavigation.label}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 py-2 action-label transition-all ${
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-t1-border bg-t1-surface text-t1-muted active:bg-t1-accent/10"
              }`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Clipboard className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => toggleFavorite(drill.id)}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 py-2 action-label transition-all ${
                favorited
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-t1-border bg-t1-surface text-t1-muted active:bg-amber-50"
              }`}
            >
              <Star
                className={`h-3.5 w-3.5 ${favorited ? "fill-amber-500" : ""}`}
              />
              {favorited ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4 sm:py-6">
        <Link
          href={backNavigation.href}
          className="mb-6 hidden items-center gap-1.5 text-sm text-t1-muted no-underline hover:text-t1-accent lg:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" /> {backNavigation.label}
        </Link>

        <section className="mb-3 rounded-xl border border-t1-border bg-t1-surface p-4 sm:mb-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {drill.level.map(level => (
                  <span
                    key={level}
                    className="chip-label rounded bg-t1-accent/10 px-2.5 py-1 text-t1-accent"
                  >
                    {pathwayStages.find(stage => stage.id === level)?.shortName}
                  </span>
                ))}
                <span className="chip-label rounded bg-secondary px-2.5 py-1 text-t1-muted">
                  {block?.shortName ?? block?.name}
                </span>
                {leadFocus && (
                  <span className="chip-label rounded bg-secondary px-2.5 py-1 text-t1-muted">
                    {leadFocus.name}
                  </span>
                )}
                <span className="chip-label flex items-center gap-1 text-t1-muted">
                  <Clock className="h-3 w-3" /> {drill.recommendedTime}
                </span>
                {drill.subBand && (
                  <span className="chip-label rounded bg-amber-500/10 px-2.5 py-1 text-amber-700">
                    {formatSubBand(drill.subBand)}
                  </span>
                )}
              </div>

              <h1 className="section-title mt-4 text-t1-text">{drill.name}</h1>
              <p className="body-copy mt-3 max-w-3xl text-t1-text/80">
                {guide.whatThisIs}
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-t1-border bg-t1-bg px-4 py-3">
                  <p className="meta-label">Class fit</p>
                  <p className="mt-2 text-sm font-semibold text-t1-text">
                    {drill.level
                      .map(
                        level =>
                          pathwayStages.find(stage => stage.id === level)
                            ?.shortName
                      )
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                </div>

                <div className="rounded-xl border border-t1-border bg-t1-bg px-4 py-3">
                  <p className="meta-label">Session block</p>
                  <p className="mt-2 text-sm font-semibold text-t1-text">
                    {block?.name ?? "General court work"}
                  </p>
                </div>

                <div className="rounded-xl border border-t1-border bg-t1-bg px-4 py-3">
                  <p className="meta-label">Training focus</p>
                  <p className="mt-2 text-sm font-semibold text-t1-text">
                    {leadFocus?.name ?? primaryStage?.shortName ?? "All-court"}
                  </p>
                </div>

                <div className="rounded-xl border border-t1-border bg-t1-bg px-4 py-3">
                  <p className="meta-label">Rep profile</p>
                  <p className="mt-2 text-sm font-semibold text-t1-text">
                    {[leadGoal?.name, intensity?.name, complexity?.name]
                      .filter(Boolean)
                      .join(" • ") || "Coach read"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-t1-border bg-t1-bg px-4 py-3">
                  <p className="meta-label">How to start</p>
                  <p className="support-copy-strong body-copy-sm mt-2 text-t1-text">
                    {guide.howToRun[0] ?? drill.setup}
                  </p>
                </div>
                <div className="rounded-xl border border-t1-accent/20 bg-t1-accent/5 px-4 py-3">
                  <p className="meta-label text-t1-accent">Coach first</p>
                  <p className="support-copy-strong body-copy-sm mt-2 text-t1-text">
                    {guide.whatToCoach[0] ?? drill.coachingCues[0]}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden flex-shrink-0 items-center gap-2 lg:flex">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 action-label transition-all ${
                  copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-t1-border bg-t1-surface text-t1-muted hover:border-t1-accent/40 hover:text-t1-accent"
                }`}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Clipboard className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => toggleFavorite(drill.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 action-label transition-all ${
                  favorited
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-t1-border bg-t1-surface text-t1-muted hover:border-amber-300 hover:text-amber-700"
                }`}
              >
                <Star
                  className={`h-3.5 w-3.5 ${favorited ? "fill-amber-500" : ""}`}
                />
                {favorited ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </section>

        {drill.videoUrl && (
          <section className="mb-3 overflow-hidden rounded-xl border border-t1-border bg-t1-surface sm:mb-4">
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
              <div className="p-4">
                <a
                  href={drill.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-t1-accent hover:underline"
                >
                  <Video className="h-4 w-4" />
                  Open demo video
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            <DetailPanel
              title="What This Drill Is"
              icon={<Info className="h-4 w-4 text-t1-accent" />}
            >
              <p className="body-copy-sm text-t1-text/80">{guide.whatThisIs}</p>
            </DetailPanel>

            <DetailPanel
              title="How To Run It"
              icon={<ListChecks className="h-4 w-4 text-t1-accent" />}
            >
              <ol className="space-y-3">
                {guide.howToRun.map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="body-copy-sm text-t1-text/80">{step}</span>
                  </li>
                ))}
              </ol>
            </DetailPanel>

            <DetailPanel
              title="What To Coach"
              icon={<Target className="h-4 w-4 text-t1-accent" />}
              tone="coach"
            >
              <ul className="space-y-2.5">
                {guide.whatToCoach.map((cue, index) => (
                  <li key={cue} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-t1-accent text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="body-copy-sm text-t1-text/80">{cue}</span>
                  </li>
                ))}
              </ul>
            </DetailPanel>

            <DetailPanel
              title="What To Watch For"
              icon={<AlertTriangle className="h-4 w-4 text-t1-red" />}
              tone="alert"
            >
              <ul className="space-y-2.5">
                {guide.watchFor.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-t1-red" />
                    <span className="body-copy-sm text-t1-text/80">{item}</span>
                  </li>
                ))}
              </ul>
            </DetailPanel>

            <DetailPanel
              title="When To Use It"
              icon={<Clock className="h-4 w-4 text-t1-accent" />}
            >
              <ul className="space-y-2.5">
                {guide.bestFit.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-t1-accent" />
                    <span className="body-copy-sm text-t1-text/80">{item}</span>
                  </li>
                ))}
              </ul>
            </DetailPanel>
          </div>

          <aside className="space-y-3 sm:space-y-4">
            <DetailPanel
              title="Standards"
              icon={<Crosshair className="h-4 w-4 text-t1-accent" />}
            >
              <ul className="space-y-2">
                {drill.standards.map(item => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 body-copy-sm text-t1-text/80"
                  >
                    <span className="mt-0.5 flex-shrink-0 text-t1-accent">
                      &#10003;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </DetailPanel>

            <DetailPanel
              title="Progression"
              icon={<TrendingUp className="h-4 w-4 text-t1-accent" />}
            >
              <p className="body-copy-sm text-t1-text/80">
                {drill.progression}
              </p>
            </DetailPanel>

            <DetailPanel
              title="Regression"
              icon={<TrendingDown className="h-4 w-4 text-t1-accent/80" />}
            >
              <p className="body-copy-sm text-t1-text/80">{drill.regression}</p>
            </DetailPanel>

            <DetailPanel
              title="Competitive Variation"
              icon={<Swords className="h-4 w-4 text-t1-accent" />}
            >
              <p className="body-copy-sm text-t1-text/80">
                {drill.competitiveVariation}
              </p>
            </DetailPanel>

            <DetailPanel
              title="Match Play Transfer"
              icon={<Target className="h-4 w-4 text-t1-accent" />}
            >
              <p className="body-copy-sm text-t1-text/80">
                {drill.matchPlayRelevance}
              </p>
            </DetailPanel>

            {!drill.videoUrl && (
              <section className="rounded-xl border border-dashed border-t1-border bg-t1-surface p-4">
                <div className="flex items-center gap-2.5 text-t1-muted">
                  <Video className="h-4 w-4 flex-shrink-0" />
                  <p className="body-copy-sm text-t1-muted/70">
                    Video URL can be added to this drill entry.
                  </p>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
