import { useState, useEffect } from 'react'
import { usePRReview }   from '../hooks/usePRReview'
import SearchBar         from '../components/ui/SearchBar'
import Alert             from '../components/ui/Alert'
import Spinner           from '../components/ui/Spinner'
import PRDetailsBanner   from '../components/review/PRDetailsBanner'
import ReviewResults     from '../components/review/ReviewResults'

/**
 * ReviewPage — the main page.
 *
 * Props:
 *   token            {string}
 *   setToken         {Function}
 *   showModal        {boolean}
 *   setShowModal     {Function}
 *   onReviewComplete {Function}  called with { prUrl, prDetails, reviews, filesReviewed } after each review
 *   restoreEntry     {Object|null} history entry to restore (set by App)
 *   onRestoreDone    {Function}  called after restore is applied
 */
export default function ReviewPage({
  token, username, onLogin,
  onReviewComplete, restoreEntry, onRestoreDone,
}) {
  const [prUrl, setPrUrl] = useState('')

  const { state, actions } = usePRReview()
  const { prDetails, reviews, filesReviewed, loading, posting, error, postResult, reviewTimeMs, prScore } = state

  // ── Restore a history entry ──────────────────────────────────────────────
  useEffect(() => {
    if (!restoreEntry) return
    setPrUrl(restoreEntry.prUrl)
    actions.restore(restoreEntry)   // tell the hook to set the state directly
    onRestoreDone()
  }, [restoreEntry])  // eslint-disable-line

  // ── Save to history after a successful review ────────────────────────────
  useEffect(() => {
    if (reviews.length > 0 && prDetails && !loading && onReviewComplete) {
      onReviewComplete({ prUrl, prDetails, reviews, filesReviewed, reviewTimeMs, prScore })
    }
  }, [reviews, prDetails, loading])  // eslint-disable-line

  const handlePost = () => {
    if (!token) { onLogin(); return }
    actions.runPost(prUrl) // prService handles fetching token from localStorage
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="px-4 pb-10 pt-16 text-center sm:px-6">
        {/* Pill badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
          ⚡ Powered by LLaMA 3.3 70B via Groq
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-[3.25rem]">
          Instant AI Code Review
          <br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
            for GitHub Pull Requests
          </span>
        </h1>

        {/* Sub-text */}
        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
          Paste any GitHub PR URL and get per-file AI analysis with severity
          scoring — bugs, security, edge cases, optimizations &amp; code quality.
        </p>

        <SearchBar
          prUrl={prUrl}
          onUrlChange={setPrUrl}
          onReview={() => actions.runReview(prUrl)}
          onPost={handlePost}
          loading={loading}
          posting={posting}
          hasReviews={reviews.length > 0}
          token={token}
          onCancel={actions.cancelReview}
        />
      </section>

      {/* ── Alerts + Results ── */}
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
        {error      && <Alert type="error"   message={error} />}
        {postResult && (
          <Alert
            type="success"
            message={
              <>
                Review posted to GitHub!{' '}
                <a href={postResult} target="_blank" rel="noopener noreferrer"
                   className="font-bold underline underline-offset-2">
                  View comment →
                </a>
              </>
            }
          />
        )}

        {(loading || posting) && (
          <Spinner label={loading ? 'Fetching PR and running AI review per file…' : 'Posting review to GitHub…'} />
        )}

        {prDetails && !loading && <PRDetailsBanner details={prDetails} />}

        {reviews.length > 0 && !loading && (
          <>
            <ReviewResults
              reviews={reviews}
              filesReviewed={filesReviewed}
              prDetails={prDetails}
              prUrl={prUrl}
              prScore={prScore}
            />
            {reviewTimeMs > 0 && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                ⏱️ Review completed in {(reviewTimeMs / 1000).toFixed(1)}s
              </p>
            )}
          </>
        )}
      </div>

    </>
  )
}
