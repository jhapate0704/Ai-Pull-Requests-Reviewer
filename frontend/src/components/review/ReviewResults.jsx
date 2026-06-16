import FileCard      from './FileCard'
import ExportButton  from '../ui/ExportButton'

/**
 * ReviewResults — renders the full list of per-file review cards + export button.
 *
 * Props:
 *   reviews       {Array}
 *   filesReviewed {number}
 *   prDetails     {Object|null}
 *   prUrl         {string}
 *   prScore       {number|null}
 */
export default function ReviewResults({ reviews, filesReviewed, prDetails, prUrl, prScore }) {
  if (!reviews || reviews.length === 0) return null

  const totalIssues = reviews.reduce(
    (acc, fr) =>
      acc + Object.values(fr.review || {}).reduce(
        (a, arr) => a + (Array.isArray(arr) ? arr.length : 0), 0
      ),
    0
  )

  return (
    <section aria-label="AI review results">
      
      {/* PR Quality Score Dashboard */}
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

      {/* Section header */}
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

        {/* Export button */}
        <ExportButton prDetails={prDetails} reviews={reviews} prUrl={prUrl} />
      </div>

      {/* File cards */}
      <div className="flex flex-col gap-4">
        {reviews.map((fileReview, i) => (
          <FileCard key={`${fileReview.filename}-${i}`} fileReview={fileReview} />
        ))}
      </div>
    </section>
  )
}
