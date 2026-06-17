/**
 * File: ReviewResults.jsx
 *
 * Purpose:
 * Renders the aggregated code review findings page, displaying overall quality score dashboards,
 * metrics summary labels, an export button, and cards containing detailed per-file issues.
 *
 * Responsibilities:
 * - Calculate total issue counts across all review findings in all files.
 * - Display a visually prominent PR Quality Score dial (clamped 0-100) with colored safety indicators.
 * - Render analytical summaries detailing files reviewed vs total issues found.
 * - Map list of file reviews to separate FileCard components.
 * - Integrate the ExportButton component to export results (JSON/PDF).
 *
 * Props:
 * - reviews (array): List of file review objects containing filenames and findings arrays.
 * - filesReviewed (number): Count of files reviewed.
 * - prDetails (object | null): Base metadata describing the Pull Request.
 * - prUrl (string): Target GitHub PR URL string.
 * - prScore (number | null): Calculated code quality rating.
 */

import FileCard      from './FileCard'
import ExportButton  from '../ui/ExportButton'

export default function ReviewResults({ reviews, filesReviewed, prDetails, prUrl, prScore }) {
  // If reviews list is unpopulated, bypass rendering
  if (!reviews || reviews.length === 0) return null

  // Accumulate the count of issues across all files and categories
  const totalIssues = reviews.reduce(
    (acc, fr) =>
      acc + Object.values(fr.review || {}).reduce(
        (a, arr) => a + (Array.isArray(arr) ? arr.length : 0), 0
      ),
    0
  )

  return (
    <section aria-label="AI review results">
      
      {/* PR Quality Score Dashboard showing numeric index rating */}
      {prScore !== null && prScore !== undefined && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800/40">
          <div className="flex flex-col items-center justify-center p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              PR Quality Score
            </h3>
            <div className="my-4 flex items-baseline gap-2">
              <span className={`text-6xl font-black ${
                prScore >= 80 ? 'text-green-500' :
                prScore >= 50 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {prScore}
              </span>
              <span className="text-xl font-bold text-gray-400">/ 100</span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {prScore >= 80 ? '🟢 Good PR — minor issues found' :
               prScore >= 50 ? '🟡 Needs Improvement — address high/medium issues' :
               '🔴 Critical Issues — do not merge without fixes'}
            </p>
          </div>
        </div>
      )}

      {/* Section header containing metrics and Export actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">🧠 AI Review</h2>
          <span className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
            {filesReviewed} file{filesReviewed !== 1 ? 's' : ''} analysed
          </span>
          {totalIssues > 0 ? (
            <span className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-400">
              {totalIssues} issue{totalIssues !== 1 ? 's' : ''} found
            </span>
          ) : (
            <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:border-green-500/25 dark:bg-green-500/10 dark:text-green-400">
              All clean ✅
            </span>
          )}
        </div>

        {/* Action button allowing users to export results to PDF, Markdown or clipboard formats */}
        <ExportButton prDetails={prDetails} reviews={reviews} prUrl={prUrl} />
      </div>

      {/* List of individual FileCards detailing code modifications */}
      <div className="flex flex-col gap-4">
        {reviews.map((fileReview, i) => (
          <FileCard key={`${fileReview.filename}-${i}`} fileReview={fileReview} />
        ))}
      </div>
    </section>
  )
}
