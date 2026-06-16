import { useState, useCallback, useRef } from 'react'
import { fetchPRDetails, fetchAIReview, postReviewToGitHub } from '../services/prService'

/**
 * usePRReview — manages all review state + API calls.
 *
 * Returns:
 *   state  : { prDetails, reviews, filesReviewed, loading, posting, error, postResult }
 *   actions: { runReview, runPost, restore, reset }
 */
export function usePRReview() {
  const [prDetails,     setPrDetails]     = useState(null)
  const [reviews,       setReviews]       = useState([])
  const [filesReviewed, setFilesReviewed] = useState(0)
  const [loading,       setLoading]       = useState(false)
  const [posting,       setPosting]       = useState(false)
  const [error,         setError]         = useState('')
  const [postResult,    setPostResult]    = useState(null)
  const [reviewTimeMs,  setReviewTimeMs]  = useState(0)
  const [prScore,       setPrScore]       = useState(null)

  const abortControllerRef = useRef(null)

  const reset = useCallback(() => {
    setPrDetails(null)
    setReviews([])
    setFilesReviewed(0)
    setError('')
    setPostResult(null)
    setReviewTimeMs(0)
    setPrScore(null)
  }, [])

  /** Fetch fresh data from the backend */
  const runReview = useCallback(async (prUrl) => {
    if (!prUrl.trim()) { setError('Please enter a GitHub PR URL first.'); return }
    
    // Abort previous request if any
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

  const cancelReview = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
    }
  }, [])

  /** Restore a saved history entry directly into state (no network call) */
  const restore = useCallback((entry) => {
    reset()
    setPrDetails(entry.prDetails)
    setReviews(entry.reviews || [])
    setFilesReviewed(entry.filesReviewed || 0)
    setReviewTimeMs(entry.reviewTimeMs || 0)
    setPrScore(entry.prScore || null)
  }, [reset])

  /** Post the review as a GitHub comment */
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
