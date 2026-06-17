/**
 * File: prService.js
 *
 * Purpose:
 * Service module handling API request communication with the backend endpoints
 * (fetching PR details, triggering reviews, posting comments, loading analytics).
 *
 * Responsibilities:
 * - Build and dispatch HTTP request URLs using base constants.
 * - Inject JWT authorization tokens if user session is active.
 * - Throw descriptive API errors if responses fail verification checks.
 *
 * Dependencies:
 * - API_BASE constant (utils/constants)
 */

import { API_BASE } from '../utils/constants'

/**
 * Fetch Pull Request details (author, state, title, changed_files).
 *
 * Why:
 * Displays basic descriptive information about the target PR in banners.
 *
 * @param {string} prUrl - Full GitHub PR link.
 * @param {AbortSignal} signal - Network abort listener signal.
 * @returns {Promise<object>} Pull Request metadata payload.
 */
export async function fetchPRDetails(prUrl, signal) {
  const res  = await fetch(`${API_BASE}/pr-details?pr_url=${encodeURIComponent(prUrl)}`, { signal })
  const data = await res.json()
  if (!data.success) throw new Error(data.detail || 'Failed to fetch PR details')
  return data.data
}

/**
 * Executes the per-file code analysis review.
 *
 * Why:
 * Fetches review finding details and quality scores from the AI evaluation engine.
 *
 * @param {string} prUrl - Full GitHub PR link.
 * @param {AbortSignal} signal - Network abort listener signal.
 * @returns {Promise<object>} Reviewed files counts and issue cards array.
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
 * Posts AI reviews back to target Pull Requests as a comment on GitHub.
 *
 * Why:
 * Publishes reports to GitHub PR timelines to make suggestions visible to developers.
 *
 * @param {string} prUrl - Full GitHub PR link.
 * @returns {Promise<string>} The direct HTML comment URL.
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
 * Fetch team review analytics for a repository.
 *
 * Why:
 * Renders statistical summary panels and audit history charts on dashboard views.
 *
 * @param {string} owner - Target repository owner handle.
 * @param {string} repo - Target repository name.
 * @returns {Promise<object>} Repository statistics payload.
 */
export async function fetchTeamAnalytics(owner, repo) {
  const res  = await fetch(`${API_BASE}/analytics/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.detail || 'Failed to fetch analytics')
  return data
}
