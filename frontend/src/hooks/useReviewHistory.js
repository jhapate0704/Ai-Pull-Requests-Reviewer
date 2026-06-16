import { useState, useCallback } from 'react'

const STORAGE_KEY = 'pr-reviewer-history'
const MAX_ITEMS   = 15

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

/**
 * useReviewHistory — persists reviewed PRs to localStorage.
 *
 * Returns:
 *   history    {Array}    list of past review entries (newest first)
 *   addReview  {Function} save a completed review
 *   remove     {Function} remove one entry by id
 *   clearAll   {Function} wipe all history
 */
export function useReviewHistory() {
  const [history, setHistory] = useState(load)

  const persist = useCallback((items) => {
    setHistory(items)
    save(items)
  }, [])

  /** Save a new review. Deduplicates by prUrl (keeps newest). */
  const addReview = useCallback(({ prUrl, prDetails, reviews, filesReviewed, reviewTimeMs, prScore }) => {
    const entry = {
      id:           Date.now(),
      prUrl,
      prDetails,
      reviews,
      filesReviewed,
      reviewTimeMs,
      prScore,
      timestamp:    new Date().toISOString(),
    }
    // Remove old entry for same PR if it exists
    const filtered = load().filter(e => e.prUrl !== prUrl)
    persist([entry, ...filtered].slice(0, MAX_ITEMS))
  }, [persist])

  const remove = useCallback((id) => {
    persist(load().filter(e => e.id !== id))
  }, [persist])

  const clearAll = useCallback(() => persist([]), [persist])

  return { history, addReview, remove, clearAll }
}

// ── Relative time helper ───────────────────────────────────────────────────

/**
 * Returns a human-friendly relative time string.
 * e.g. "2 mins ago", "just now", "3 hrs ago"
 */
export function timeAgo(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? 's' : ''} ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`
}

/**
 * Extract a short display label from a GitHub PR URL.
 * e.g. "https://github.com/facebook/react/pull/123" → "facebook/react #123"
 */
export function prLabel(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    // parts: ['owner', 'repo', 'pull', 'number']
    if (parts.length >= 4) return `${parts[0]}/${parts[1]} #${parts[3]}`
  } catch { /* fall through */ }
  return url
}
