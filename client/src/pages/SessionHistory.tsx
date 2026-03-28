/*
  SESSION HISTORY: Tier 1 Performance — Cold Dark Brand
  MOBILE-FIRST: Log of completed/saved sessions with date, level, duration, and notes.
  Coaches can track what they ran and when.
*/
import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import {
  History, Calendar, Clock, Trash2, ChevronDown, ChevronUp,
  ClipboardList, AlertCircle, Filter, X, AlertTriangle
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useSessionHistory, type SessionHistoryEntry } from '@/hooks/useSessionHistory';
import type { PathwayStageId } from '@/lib/data';

const levelColors: Record<string, string> = {
  foundations: 'bg-red-500/15 text-red-400 border-red-500/20',
  prep: 'bg-green-500/15 text-green-400 border-green-500/20',
  jasa: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  hs: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  asa: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  fta: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const levelBorderColors: Record<string, string> = {
  foundations: 'border-l-red-500',
  prep: 'border-l-green-500',
  jasa: 'border-l-yellow-500',
  hs: 'border-l-purple-500',
  asa: 'border-l-blue-500',
  fta: 'border-l-orange-500',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

interface HistoryCardProps {
  entry: SessionHistoryEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

function HistoryCard({ entry, isExpanded, onToggle, onDelete }: HistoryCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const borderColor = levelBorderColors[entry.level] || 'border-l-gray-500';
  const badgeColor = levelColors[entry.level] || 'bg-gray-500/15 text-gray-400 border-gray-500/20';

  return (
    <div className={`bg-t1-surface border border-t1-border rounded-lg overflow-hidden border-l-4 ${borderColor}`}>
      <div className="flex items-start">
        <button
          onClick={onToggle}
          className="flex-1 text-left p-3 sm:p-4 flex items-start gap-3 active:bg-t1-bg/50 transition-colors min-w-0"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                {entry.level.toUpperCase()}
              </span>
              {entry.subBand && (
                <span className="text-[10px] text-t1-muted">{entry.subBand}</span>
              )}
              <span className="text-[10px] text-t1-muted flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {entry.duration} min
              </span>
              <span className="text-[10px] text-t1-muted flex items-center gap-1">
                <ClipboardList className="w-3 h-3" />
                {entry.blockCount} blocks
              </span>
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-t1-text uppercase tracking-wide leading-tight">
              {entry.planName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-t1-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(entry.date)}
              </span>
              <span className="text-[10px] text-t1-muted/60">
                {timeAgo(entry.date)}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 mt-1">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-t1-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-t1-muted" />
            )}
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-t1-border px-3 sm:px-4 pb-3 sm:pb-4 pt-3 space-y-3">
          {/* Time details */}
          <div className="flex items-center gap-4 text-xs text-t1-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(entry.date)} at {formatTime(entry.date)}
            </span>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className="bg-t1-bg/50 border border-t1-border rounded-lg p-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-t1-muted mb-1">Session Notes</h4>
              <p className="text-xs text-t1-text whitespace-pre-wrap">{entry.notes}</p>
            </div>
          )}

          {/* Plan link */}
          {entry.planId && (
            <Link
              href="/session-plans"
              className="inline-flex items-center gap-1.5 text-xs text-t1-blue hover:underline no-underline"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              View original plan
            </Link>
          )}

          {/* Delete */}
          <div className="flex items-center justify-end pt-1 border-t border-t1-border/50">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">Delete this entry?</span>
                <button
                  onClick={() => { onDelete(); setConfirmDelete(false); }}
                  className="px-2.5 py-1 text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/25 transition-colors"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 text-xs font-medium text-t1-muted border border-t1-border rounded-md hover:bg-t1-bg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 text-xs text-t1-muted/60 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SessionHistory() {
  const { entries, removeEntry, clearHistory } = useSessionHistory();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  // Get unique levels from history
  const availableLevels = useMemo(() => {
    const levels = new Set(entries.map(e => e.level));
    return Array.from(levels).sort();
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!levelFilter) return entries;
    return entries.filter(e => e.level === levelFilter);
  }, [entries, levelFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalSessions = entries.length;
    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
    const thisWeek = entries.filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }).length;
    return { totalSessions, totalMinutes, thisWeek };
  }, [entries]);

  return (
    <div>
      {/* Header */}
      <section className="bg-t1-navy border-b border-t1-border">
        <div className="container py-4 sm:py-6">
          <h1 className="font-display text-xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Session History
          </h1>
          <p className="mt-1 text-t1-muted text-xs sm:text-sm">
            Track completed sessions. Review what you ran and when.
          </p>
        </div>
      </section>

      <div className="container mt-3 sm:mt-4 space-y-3 sm:space-y-4">
        {/* Stats Row */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-t1-surface border border-t1-border rounded-lg p-3 text-center">
              <p className="font-display text-lg sm:text-2xl font-bold text-t1-text">{stats.totalSessions}</p>
              <p className="text-[10px] sm:text-xs text-t1-muted uppercase tracking-wider">Total Sessions</p>
            </div>
            <div className="bg-t1-surface border border-t1-border rounded-lg p-3 text-center">
              <p className="font-display text-lg sm:text-2xl font-bold text-t1-text">
                {stats.totalMinutes >= 60 ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m` : `${stats.totalMinutes}m`}
              </p>
              <p className="text-[10px] sm:text-xs text-t1-muted uppercase tracking-wider">Total Time</p>
            </div>
            <div className="bg-t1-surface border border-t1-border rounded-lg p-3 text-center">
              <p className="font-display text-lg sm:text-2xl font-bold text-t1-blue">{stats.thisWeek}</p>
              <p className="text-[10px] sm:text-xs text-t1-muted uppercase tracking-wider">This Week</p>
            </div>
          </div>
        )}

        {/* Filter + Clear Row */}
        {entries.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-t1-muted" />
              <button
                onClick={() => setLevelFilter(null)}
                className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  !levelFilter
                    ? 'bg-t1-blue text-white border-t1-blue'
                    : 'bg-t1-bg border-t1-border text-t1-muted'
                }`}
              >
                All ({entries.length})
              </button>
              {availableLevels.map(level => {
                const count = entries.filter(e => e.level === level).length;
                return (
                  <button
                    key={level}
                    onClick={() => setLevelFilter(level)}
                    className={`px-2 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                      levelFilter === level
                        ? 'bg-t1-blue text-white border-t1-blue'
                        : 'bg-t1-bg border-t1-border text-t1-muted'
                    }`}
                  >
                    {level.toUpperCase()} ({count})
                  </button>
                );
              })}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-1 text-[11px] text-t1-muted/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-t1-surface border-t1-border">
                <AlertDialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <AlertDialogTitle className="font-display text-lg uppercase tracking-wide text-t1-text">
                      Clear All History
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-sm text-t1-muted">
                    This will permanently delete all {entries.length} session{entries.length !== 1 ? 's' : ''} from your history.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-t1-bg border-t1-border text-t1-text hover:bg-t1-surface">
                    Keep History
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearHistory()}
                    className="bg-red-600 text-white hover:bg-red-700 border-0"
                  >
                    Clear All Sessions
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="bg-t1-surface border border-t1-border rounded-lg p-8 sm:p-12 text-center">
            <History className="w-10 h-10 text-t1-muted/30 mx-auto mb-3" />
            <h2 className="font-display text-base font-semibold text-t1-text uppercase tracking-wide mb-1">
              No sessions logged yet
            </h2>
            <p className="text-xs text-t1-muted max-w-sm mx-auto">
              When you save a session from the Session Builder, it will appear here. 
              Use this log to track what you ran and review your coaching patterns.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4">
              <Link
                href="/session-builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-t1-blue text-white text-xs font-semibold rounded-lg no-underline hover:bg-t1-blue/90 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Open Session Builder
              </Link>
              <Link
                href="/session-plans"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-t1-surface border border-t1-border text-t1-text text-xs font-semibold rounded-lg no-underline hover:bg-t1-bg transition-colors"
              >
                Browse Session Plans
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEntries.map(entry => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                isExpanded={expandedEntry === entry.id}
                onToggle={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                onDelete={() => removeEntry(entry.id)}
              />
            ))}
          </div>
        )}

        {/* Bottom Spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
