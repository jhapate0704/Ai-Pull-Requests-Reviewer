import { useState } from 'react'
import SectionPanel from './SectionPanel'
import { REVIEW_SECTIONS } from '../../utils/constants'
import { countTotalIssues } from '../../utils/helpers'

/**
 * FileCard — expandable card for one file's AI review.
 *
 * Props:
 *   fileReview {Object} — { filename, additions, deletions, review }
 */
export default function FileCard({ fileReview }) {
  const { filename, additions, deletions, review } = fileReview
  const totalIssues = countTotalIssues(review, REVIEW_SECTIONS)
  const [open, setOpen] = useState(totalIssues > 0)
  const hasIssues = totalIssues > 0

  return (
    <article
      className={[
        'overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-200 dark:bg-gray-900/60 dark:shadow-lg',
        hasIssues
          ? 'border-red-200 hover:border-red-300 dark:border-red-500/20 dark:hover:border-red-500/35'
          : 'border-green-200 hover:border-green-300 dark:border-green-500/15 dark:hover:border-green-500/30',
      ].join(' ')}
    >
      {/* ── Header ── */}
      <button
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/4"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`file-body-${filename}`}
      >
        {/* Left: icon + filename + diff stats */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-lg">📄</span>
          <span
            className="max-w-xs truncate font-mono text-sm font-medium text-gray-800 dark:text-gray-200 sm:max-w-sm md:max-w-lg"
            title={filename}
          >
            {filename}
          </span>
          <div className="flex shrink-0 gap-1.5">
            <span className="rounded bg-green-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-green-700 dark:bg-green-500/12 dark:text-green-400">
              +{additions}
            </span>
            <span className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-700 dark:bg-red-500/12 dark:text-red-400">
              -{deletions}
            </span>
          </div>
        </div>

        {/* Right: badge + chevron */}
        <div className="flex shrink-0 items-center gap-3">
          <span
            className={[
              'rounded-full px-2.5 py-1 text-xs font-bold',
              hasIssues
                ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                : 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400',
            ].join(' ')}
          >
            {hasIssues ? `🔴 ${totalIssues} issue${totalIssues > 1 ? 's' : ''}` : '✅ Clean'}
          </span>
          <span
            className={`text-xs text-gray-400 transition-transform duration-200 dark:text-gray-500 ${open ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* ── Body ── */}
      {open && (
        <div
          id={`file-body-${filename}`}
          className="grid grid-cols-1 gap-3 border-t border-gray-200 p-5 dark:border-white/8 sm:grid-cols-2 xl:grid-cols-3"
        >
          {REVIEW_SECTIONS.map((section) => (
            <SectionPanel
              key={section.key}
              emoji={section.emoji}
              title={section.title}
              items={review?.[section.key] || []}
            />
          ))}
        </div>
      )}
    </article>
  )
}
