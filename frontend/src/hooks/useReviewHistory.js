/**
 * File: useReviewHistory.js
 *
 * Purpose:
 * Custom React hook managing local storage persistence for historical PR reviews.
 * Includes text formatting helpers for displays and relative dates calculation.
 *
 * Responsibilities:
 * - Read/write review logs from localStorage using JSON conversion methods.
 * - Append reviews (deduplicating by PR url, keeping newest entries, capping at 15 items).
 * - Expose functions to delete single logs or clear history entirely.
 * - Calculate human-friendly relative time descriptions (e.g. "5 mins ago", "just now").
 * - Format short display labels from full GitHub PR URLs.
 *
 * Returns:
 * - history (array): Stored review history objects list.
 * - addReview (function): Deduplicates and saves new review.
 * - remove (function): Removes single logs by unique ID indicator.
 * - clearAll (function): Clears all logs in storage keys.
 *
 * Dependencies:
 * - React (useState, useCallback)
 */

import { useState, useCallback } from 'react'

// LocalStorage configuration key constant
const STORAGE_KEY = 'pr-reviewer-history'

// Max boundary count for history logs list
const MAX_ITEMS   = 15

/**
 * Loads and parses historical PR records from LocalStorage.
 *
 * @returns {array} Parsed history array.
 */
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

/**
 * Persists historical PR records array to LocalStorage.
 *
 * @param {array} items - Log entries.
 */
function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useReviewHistory() {
  // Loaded list of review logs state
  const [history, setHistory] = useState(load)

  /**
   * Helper that updates active state and commits modifications to disk.
   */
  const persist = useCallback((items) => {
    setHistory(items)
    save(items)
  }, [])

  /**
   * Saves a new review log entry, removing duplicates for the same PR.
   *
   * @param {object} params
   * @param {string} params.prUrl - Pull Request URL string.
   * @param {object} params.prDetails - Pull Request metadata.
   * @param {array} params.reviews - Code findings list.
   * @param {number} params.filesReviewed - Reviewed files count.
   * @param {number} params.reviewTimeMs - Duration benchmark values.
   * @param {number} params.prScore - Quality rating value.
   */
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

  /**
   * Deletes a targeted entry from logs using unique ID matching.
   *
   * @param {number} id - Target log identifier.
   */
  const remove = useCallback((id) => {
    persist(load().filter(e => e.id !== id))
  }, [persist])

  /**
   * Cleans up all entries in storage keys.
   */
  const clearAll = useCallback(() => persist([]), [persist])

  return { history, addReview, remove, clearAll }
}

// ── Relative time helper ───────────────────────────────────────────────────

/**
 * Returns a human-friendly relative time string.
 *
 * Why:
 * Displays natural date labels (e.g. "3 mins ago", "just now") in the UI drawer.
 *
 * @param {string} isoString - Date representation in ISO timestamp format.
 * @returns {string} Human-friendly relative date representation.
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
 *
 * Why:
 * Shortens long URL text into readable labels like "facebook/react #123".
 *
 * @param {string} url - GitHub Pull Request URL string.
 * @returns {string} Short display label representation.
 */
export function prLabel(url) {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean)
    // parts: ['owner', 'repo', 'pull', 'number']
    if (parts.length >= 4) return `${parts[0]}/${parts[1]} #${parts[3]}`
  } catch { /* fall through */ }
  return url
}
