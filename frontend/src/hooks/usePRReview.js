/**
 * File: usePRReview.js
 *
 * Purpose:
 * Custom React hook that encapsulates state management and API requests for code reviews.
 * Handles review execution, comments publishing, history restorations, and request aborts.
 *
 * Responsibilities:
 * - Maintain states for active evaluations (loading status, error messages, PR metrics, findings lists).
 * - Execute concurrent network queries (fetching metadata details and reviews in parallel).
 * - Handle cancellation support using AbortController.
 * - Restore historical session details into memory.
 * - Dispatch HTTP POST requests to write review summaries back to GitHub repositories.
 *
 * Returns:
 * - state (object): An object containing:
 *   - prDetails (object | null): Base metadata describing the Pull Request.
 *   - reviews (array): Full list of per-file review results.
 *   - filesReviewed (number): Count of files reviewed.
 *   - loading (boolean): Load flag for review query requests.
 *   - posting (boolean): Load flag for comment post actions.
 *   - error (string): Request error warning message.
 *   - postResult (string | null): The GitHub comment target URL address.
 *   - reviewTimeMs (number): Time spent fetching the review findings in milliseconds.
 *   - prScore (number | null): The overall PR code quality score.
 * - actions (object): Hook methods containing:
 *   - runReview (function): Parallel REST requests runner.
 *   - cancelReview (function): Cancels current review loads via AbortController signals.
 *   - runPost (function): Dispatches comment posts to target GitHub repositories.
 *   - restore (function): Loads historical entries directly into memory.
 *   - reset (function): Resets hook state values.
 *
 * Dependencies:
 * - React (useState, useCallback, useRef)
 * - Services (prService)
 */

import { useState, useCallback, useRef } from 'react'
import { fetchPRDetails, fetchAIReview, postReviewToGitHub } from '../services/prService'

export function usePRReview() {
  // Pull Request basic details metadata state
  const [prDetails,     setPrDetails]     = useState(null)

  // Full list of per-file code evaluations
  const [reviews,       setReviews]       = useState([])

  // Metric count indicating how many files were reviewed
  const [filesReviewed, setFilesReviewed] = useState(0)

  // Set to true while executing parallel REST API requests
  const [loading,       setLoading]       = useState(false)

  // Set to true while publishing comment payloads to GitHub
  const [posting,       setPosting]       = useState(false)

  // Contains API error alerts if fetch queries fail
  const [error,         setError]         = useState('')

  // URL pointing directly to the posted comment on GitHub
  const [postResult,    setPostResult]    = useState(null)

  // Benchmark duration of the review execution timer
  const [reviewTimeMs,  setReviewTimeMs]  = useState(0)

  // Aggregate PR health and quality rating
  const [prScore,       setPrScore]       = useState(null)

  // Keep a reference to the active AbortController to support cancellation actions
  const abortControllerRef = useRef(null)

  /**
   * Resets all review state variables.
   *
   * Why:
   * Cleans the screen contents prior to initiating a new review search.
   */
  const reset = useCallback(() => {
    setPrDetails(null)
    setReviews([])
    setFilesReviewed(0)
    setError('')
    setPostResult(null)
    setReviewTimeMs(0)
    setPrScore(null)
  }, [])

  /**
   * Dispatches parallel REST requests to load PR metadata and review suggestions.
   *
   * Why:
   * Executes the core code evaluation process.
   *
   * What happens:
   * Sets loading flags, instantiates AbortController signals, triggers Promise.all
   * to fetch metadata and AI analyses concurrently, and records the request latency.
   *
   * @param {string} prUrl - Target GitHub Pull Request URL.
   */
  const runReview = useCallback(async (prUrl) => {
    if (!prUrl.trim()) { setError('Please enter a GitHub PR URL first.'); return }
    
    // Abort previous request if any is active to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    
    reset()
    setLoading(true)
    const startTime = Date.now()
    try {
      const [details, aiData] = await Promise.all([
        fetchPRDetails(prUrl, abortController.signal),
        fetchAIReview(prUrl, abortController.signal),
      ])
      setPrDetails(details)
      setReviews(aiData.reviews)
      setFilesReviewed(aiData.filesReviewed)
      setPrScore(aiData.score)
      setReviewTimeMs(Date.now() - startTime)
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Review was cancelled.')
      } else {
        setError(e.message)
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        setLoading(false)
        abortControllerRef.current = null
      }
    }
  }, [reset])

  /**
   * Interrupts the active API requests via AbortController signals.
   *
   * Why:
   * Allows users to cancel long-running requests if needed.
   */
  const cancelReview = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
    }
  }, [])

  /**
   * Restores a previously saved review history log directly into state.
   *
   * Why:
   * Restores past evaluations immediately without executing redundant network calls.
   *
   * @param {object} entry - Log details object to restore.
   */
  const restore = useCallback((entry) => {
    reset()
    setPrDetails(entry.prDetails)
    setReviews(entry.reviews || [])
    setFilesReviewed(entry.filesReviewed || 0)
    setReviewTimeMs(entry.reviewTimeMs || 0)
    setPrScore(entry.prScore || null)
  }, [reset])

  /**
   * Sends comments back to GitHub PR timelines.
   *
   * Why:
   * Enables posting reviews directly to GitHub repository Pull Requests.
   *
   * @param {string} prUrl - Target GitHub Pull Request URL.
   */
  const runPost = useCallback(async (prUrl) => {
    if (!prUrl.trim()) { setError('Please enter a GitHub PR URL first.'); return }
    setPostResult(null)
    setError('')
    setPosting(true)
    try {
      const url = await postReviewToGitHub(prUrl)
      setPostResult(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setPosting(false)
    }
  }, [])

  return {
    state:   { prDetails, reviews, filesReviewed, loading, posting, error, postResult, reviewTimeMs, prScore },
    actions: { runReview, cancelReview, runPost, restore, reset },
  }
}
