/**
 * File: HistoryPanel.jsx
 *
 * Purpose:
 * Renders a sliding side drawer containing lists of previously run AI PR reviews.
 *
 * Responsibilities:
 * - Listen for key presses (Escape key) to automatically close drawer overlay.
 * - Display metadata summaries, timestamp indicators, and issue totals for each log entry.
 * - Call load triggers to restore history sessions.
 * - Allow users to remove single entries or clear history storage completely.
 *
 * Props:
 * - open (boolean): Visibility state of the drawer.
 * - onClose (function): Hook to close drawer.
 * - history (array): Set of historical PR review logs.
 * - onLoad (function): Hook to restore historical reviews page context.
 * - onRemove (function): Callback deleting a targeted log entry.
 * - onClear (function): Callback clearing all logs.
 */

import { useEffect } from 'react'
import { timeAgo, prLabel } from '../../hooks/useReviewHistory'

export default function HistoryPanel({ open, onClose, history, onLoad, onRemove, onClear }) {

  // Close on Escape key press
  // Why:
  // Adds standard keyboard accessibility support so that pressing 'Escape' collapses active modals.
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop blur overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Review history"
        aria-modal="true"
        className={[
          'fixed left-0 top-0 z-50 flex h-full w-[85vw] max-w-sm flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out',
          'dark:border-white/10 dark:bg-gray-900',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header containing count and action clear buttons */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">📋 Review History</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {history.length} saved · last 15 PRs
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 min-h-[48px] text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                Clear all
              </button>
            )}
            <button
              id="close-history-btn"
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close history panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable List Container */}
        <div className="flex-1 overflow-y-auto p-3">
          {history.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <span className="text-4xl">🗂️</span>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No reviews yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Reviewed PRs will appear here automatically
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {history.map((entry) => {
                // Calculate cumulative issue count across all files in the entry
                const totalIssues = Object.values(entry.reviews || []).reduce(
                  (acc, fr) =>
                    acc + Object.values(fr.review || {}).reduce(
                      (a, arr) => a + (Array.isArray(arr) ? arr.length : 0), 0
                    ),
                  0
                )
                const label = prLabel(entry.prUrl)

                return (
                  <li key={entry.id}>
                    <div className="group relative rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-white/8 dark:bg-gray-800/40 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/8">
                      {/* Interactive block loading state to main page */}
                      <button
                        className="block w-full cursor-pointer text-left"
                        onClick={() => { onLoad(entry); onClose() }}
                      >
                        <p className="mb-0.5 font-mono text-sm font-semibold text-gray-800 dark:text-gray-100 truncate" title={label}>
                          {label}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">
                            🕐 {timeAgo(entry.timestamp)}
                          </span>
                          <span className={[
                            'rounded-full px-2 py-0.5 text-[10px] font-bold',
                            totalIssues > 0
                              ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                              : 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400'
                          ].join(' ')}>
                            {totalIssues > 0 ? `${totalIssues} issues` : '✅ Clean'}
                          </span>
                        </div>
                        {entry.prDetails?.title && (
                          <p className="mt-1.5 truncate text-[11px] text-gray-500 dark:text-gray-500">
                            {entry.prDetails.title}
                          </p>
                        )}
                      </button>

                      {/* Hover action delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(entry.id) }}
                        className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-white/10"
                        title="Remove"
                        aria-label="Remove from history"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer tip */}
        <div className="border-t border-gray-200 px-5 py-3 dark:border-white/10">
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            💾 History is saved in your browser's local storage
          </p>
        </div>
      </aside>
    </>
  )
}
