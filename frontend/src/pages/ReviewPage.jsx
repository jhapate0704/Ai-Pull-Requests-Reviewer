/**
 * File: ReviewPage.jsx
 *
 * Purpose:
 * Renders the main user interaction panel for entering, reviewing, and posting GitHub Pull Request reviews.
 *
 * Responsibilities:
 * - Render search bar input forms using the SearchBar component.
 * - Call custom usePRReview hooks to query APIs and save response data.
 * - Handle logic to restore previously loaded historical sessions (restoreEntry hook dependency).
 * - Publish review comments back to target GitHub PR timelines.
 * - Display metadata banners (PRDetailsBanner) and result lists (ReviewResults).
 *
 * Props:
 * - token (string): Session validation token.
 * - username (string): Current GitHub account login name.
 * - onLogin (function): Callback redirecting to GitHub OAuth login page.
 * - onReviewComplete (function): Callback saving completed results into historical logs.
 * - restoreEntry (object | null): Active review log entry to restore onto screen.
 * - onRestoreDone (function): Callback confirming that restore actions completed.
 */

import { useState, useEffect } from 'react'
import { usePRReview }   from '../hooks/usePRReview'
import SearchBar         from '../components/ui/SearchBar'
import Alert             from '../components/ui/Alert'
import Spinner           from '../components/ui/Spinner'
import PRDetailsBanner   from '../components/review/PRDetailsBanner'
import ReviewResults     from '../components/review/ReviewResults'

export default function ReviewPage({
  token, username, onLogin,
  onReviewComplete, restoreEntry, onRestoreDone,
}) {
  // Pull Request input URL state
  const [prUrl, setPrUrl] = useState('')

  // Pull states and trigger action handlers from the custom usePRReview hook
  const { state, actions } = usePRReview()
  const { prDetails, reviews, filesReviewed, loading, posting, error, postResult, reviewTimeMs, prScore } = state

  // ── Restore a history entry ──────────────────────────────────────────────
  // Why:
  // Allows restoring older, client-side cached logs when selecting items from drawers.
  useEffect(() => {
    if (!restoreEntry) return
    setPrUrl(restoreEntry.prUrl)
    actions.restore(restoreEntry)   // tell the hook to set the state directly
    onRestoreDone()
  }, [restoreEntry])  // eslint-disable-line

  // ── Save to history after a successful review ────────────────────────────
  // Why:
  // Triggers hooks to append new entries to browser storage after successful evaluations.
  useEffect(() => {
    if (reviews.length > 0 && prDetails && !loading && onReviewComplete) {
      onReviewComplete({ prUrl, prDetails, reviews, filesReviewed, reviewTimeMs, prScore })
    }
  }, [reviews, prDetails, loading])  // eslint-disable-line

  /**
   * Dispatches review comment payload to GitHub OAuth endpoints.
   */
  const handlePost = () => {
    if (!token) { onLogin(); return }
    actions.runPost(prUrl)
  }

  return (
    <>
      {/* ── Hero Segment ── */}
      <section className="px-4 pb-10 pt-16 text-center sm:px-6">
        {/* Model specifications badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300">
          ⚡ Powered by LLaMA 3.3 70B via Groq
        </div>

        {/* Core Heading titles */}
        <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-[3.25rem]">
          Instant AI Code Review
          <br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
            for GitHub Pull Requests
          </span>
        </h1>

        {/* Sub-text descriptions */}
        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
          Paste any GitHub PR URL and get per-file AI analysis with severity
          scoring — bugs, security, edge cases, optimizations &amp; code quality.
        </p>

        {/* Input and trigger buttons bar */}
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

      {/* ── Alerts + Results sections ── */}
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
        {/* Error notification display */}
        {error      && <Alert type="error"   message={error} />}
        
        {/* Success posting notification display */}
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

        {/* Loader layouts */}
        {(loading || posting) && (
          <Spinner label={loading ? 'Fetching PR and running AI review per file…' : 'Posting review to GitHub…'} />
        )}

        {/* Renders basic metadata details banner */}
        {prDetails && !loading && <PRDetailsBanner details={prDetails} />}

        {/* Completed execution timers */}
            {reviewTimeMs > 0 && (
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                <span className="font-bold text-[19px]">⏱️ Review completed in {(reviewTimeMs / 1000).toFixed(1)}s </span>
              </p>
            )}

        {/* Renders full set of card evaluations list */}
        {reviews.length > 0 && !loading && (
          <>
            <ReviewResults
              reviews={reviews}
              filesReviewed={filesReviewed}
              prDetails={prDetails}
              prUrl={prUrl}
              prScore={prScore}
            />
          
          </>
        )}
      </div>

    </>
  )
}
