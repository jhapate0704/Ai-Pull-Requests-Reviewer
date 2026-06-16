import { useState, useEffect } from 'react'
import { fetchTeamAnalytics } from '../services/prService'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'

export default function DashboardPage({ onLoadReview }) {
  const [repoInput, setRepoInput] = useState('facebook/react')
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadAnalytics = async () => {
    if (!repoInput.includes('/')) {
      setError('Please enter a valid format: owner/repo')
      return
    }
    const [owner, repo] = repoInput.split('/')
    setLoading(true)
    setError('')
    try {
      const data = await fetchTeamAnalytics(owner.trim(), repo.trim())
      setAnalytics(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Load default on mount
  useEffect(() => {
    // loadAnalytics() // optionally auto-load
  }, [])

  // Basic stats from the backend
  const totalReviews = analytics?.total_reviews || 0
  const avgScore = analytics?.average_score || null
  const history = analytics?.history || []

  // Count issues by severity across team history (if backend provided full reviews_json)
  // For now, the backend /analytics endpoint returns basic history.
  // We will estimate or skip the granular critical counts if not provided by backend,
  // but let's assume we display what we have.
  
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            📈 Team Analytics Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Analytics and trends across the entire organization's PR reviews.
          </p>
        </div>
        
        {/* Repo Search */}
        <div className="flex w-full max-w-xs items-center gap-2">
          <input 
            type="text" 
            placeholder="owner/repo"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadAnalytics()}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
          />
          <button 
            onClick={loadAnalytics}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Load
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}
      {loading && <Spinner label="Loading team analytics..." />}

      {!loading && analytics && (
        <>
          {/* Top Stats Row */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Team Reviews</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalReviews}</p>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average PR Score</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${avgScore === null ? 'text-gray-900 dark:text-white' : avgScore >= 80 ? 'text-green-500' : avgScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {avgScore !== null ? avgScore : '—'}
                </p>
                {avgScore !== null && <span className="text-sm font-medium text-gray-400">/ 100</span>}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/40">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Repository</p>
              <p className="mt-2 text-xl font-bold text-violet-600 dark:text-violet-400 truncate">{analytics.owner}/{analytics.repo}</p>
            </div>
          </div>

          {/* Recent Reviews List */}
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Organization Review History</h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-800/40">
            {history.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                No reviews recorded yet for this repository in the database.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-white/10">
                {history.map(entry => (
                  <li key={entry.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 sm:p-6">
                    <div>
                      <a href={entry.pr_url} target="_blank" rel="noreferrer" className="font-mono text-sm font-bold text-violet-600 hover:underline dark:text-violet-400">
                        {entry.pr_url.split('github.com/')[1] || entry.pr_url}
                      </a>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.created_at).toLocaleString()} • {entry.files_reviewed} files
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {entry.pr_score !== undefined && entry.pr_score !== null ? (
                        <div className="text-right">
                          <p className={`text-xl font-bold ${entry.pr_score >= 80 ? 'text-green-500' : entry.pr_score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {entry.pr_score}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No score</span>
                      )}
                      {/* For team analytics, clicking view could load the PR directly or just act as a link for now */}
                      <a 
                        href={entry.pr_url} target="_blank" rel="noreferrer"
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        GitHub ↗
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
      
      {!loading && !analytics && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-gray-800/40">
          <p className="text-gray-500 dark:text-gray-400">Search for a repository (e.g. facebook/react) to load team analytics from the backend database.</p>
        </div>
      )}
    </div>
  )
}


