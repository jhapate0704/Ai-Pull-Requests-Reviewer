import { API_BASE } from '../utils/constants'

/**
 * Fetch PR details (author, state, title, changed_files).
 * @param {string} prUrl
 * @returns {Promise<Object>}
 */
export async function fetchPRDetails(prUrl, signal) {
  const res  = await fetch(`${API_BASE}/pr-details?pr_url=${encodeURIComponent(prUrl)}`, { signal })
  const data = await res.json()
  if (!data.success) throw new Error(data.detail || 'Failed to fetch PR details')
  return data.data
}

/**
 * Run the per-file AI review.
 * @param {string} prUrl
 * @returns {Promise<{ filesReviewed: number, reviews: Array }>}
 */
export async function fetchAIReview(prUrl, signal) {
  const res  = await fetch(`${API_BASE}/ai-review?pr_url=${encodeURIComponent(prUrl)}`, { signal })
  const data = await res.json()
  if (!data.success) throw new Error(data.detail || 'AI review failed')
  return {
    filesReviewed: data.files_reviewed,
    reviews:       data.reviews,
  }
}

/**
 * Post the AI review as a GitHub PR comment.
 * @param {string} prUrl
 * @returns {Promise<string>} comment HTML URL
 */
export async function postReviewToGitHub(prUrl) {
  const token = localStorage.getItem('app_token')
  const res = await fetch(`${API_BASE}/post-review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ pr_url: prUrl })
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.detail || 'Failed to post review')
  return data.comment_url
}

/**
 * Fetch team analytics for a specific repository.
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<Object>}
 */
export async function fetchTeamAnalytics(owner, repo) {
  const res  = await fetch(`${API_BASE}/analytics/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.detail || 'Failed to fetch analytics')
  return data
}
