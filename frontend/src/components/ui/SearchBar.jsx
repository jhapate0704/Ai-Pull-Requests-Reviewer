/**
 * File: SearchBar.jsx
 *
 * Purpose:
 * Renders the primary search bar where users enter GitHub PR URLs and execute/cancel code reviews or post comments.
 *
 * Responsibilities:
 * - Capture URL text input and update parent state.
 * - Call review triggers when the user hits Enter or clicks 'Review PR'.
 * - Provide a cancellation trigger during long-running review loads.
 * - Manage active/disabled button states if operations are running.
 * - Inform the user via alerts/warnings if tokens are missing.
 *
 * Props:
 * - prUrl (string): The current pull request URL input text.
 * - onUrlChange (function): Handler updating the prUrl variable.
 * - onReview (function): Method initiating the API review fetch.
 * - onPost (function): Method triggering the GitHub comment post.
 * - loading (boolean): Indicator of whether review generation is running.
 * - posting (boolean): Indicator of whether comment posting is running.
 * - hasReviews (boolean): Boolean indicating if review data exists to be posted.
 * - token (string): GitHub OAuth session validation token.
 * - onCancel (function): Callback allowing users to interrupt active review loads.
 */

export default function SearchBar({
  prUrl,
  onUrlChange,
  onReview,
  onPost,
  loading,
  posting,
  hasReviews,
  token,
  onCancel,
}) {
  // Listen for Enter key shortcut inside the URL input box
  const handleKey = (e) => { if (e.key === 'Enter') onReview() }
  
  // Flag indicating if any operations are currently busy
  const busy = loading || posting

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-9 shadow-xl shadow-gray-200/60 dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
      {/* URL input field and core Review action buttons row */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <input
          id="pr-url-input"
          type="url"
          value={prUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="https://github.com/owner/repo/pull/"
          className="h-15 flex-2 rounded-2xl border-2 border-gray-300 bg-gray-50 px-10 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 dark:border-white/10 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Main Review execution trigger */}
          <button
            id="review-btn"
            onClick={onReview}
            disabled={busy}
            className="h-15 w-full sm:w-auto cursor-pointer rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-10 text-xl font-bold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
          >
            {loading ? '⏳ Reviewing…' : '🔍 Review PR'}
          </button>
          
          {/* Intermittent Cancel button */}
          {loading && onCancel && (
            <button
              onClick={onCancel}
              className="h-15 w-full sm:w-auto cursor-pointer rounded-2xl bg-red-100 px-10 text-xl font-bold text-red-600 shadow-md transition-all duration-200 hover:bg-red-200 dark:bg-red-500/15 dark:text-red-400 dark:hover:bg-red-500/30"
            >
              🛑 Cancel
            </button>
          )}
        </div>
      </div>

      {/* GitHub Comment Posting execution row */}
      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          id="post-review-btn"
          onClick={onPost}
          disabled={busy || !hasReviews}
          title={!token ? 'Add a GitHub token to enable posting' : !hasReviews ? 'Run a review first' : ''}
          className="h-15 w-full cursor-pointer rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/35 disabled:cursor-not-allowed disabled:opacity-40 disabled:transform-none sm:w-auto"
        >
          {posting ? '⏳ Posting…' : '📤 Post Review to GitHub'}
        </button>

        {/* Informative warning text showing if authentication credentials are required */}
        {!token && (
          <span className="text-xs text-amber-600 dark:text-amber-400/80">
            ⚠️ Add a GitHub token to enable posting
          </span>
        )}
      </div>
    </div>
  )
}
