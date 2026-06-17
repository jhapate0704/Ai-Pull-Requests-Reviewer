/**
 * File: helpers.js
 *
 * Purpose:
 * Contains general pure helper functions for string formatting, severity normalization,
 * and counting code review issues.
 *
 * Responsibilities:
 * - Calculate total issue counts across review categories in a single file review.
 * - Normalize raw severity string inputs to standard uppercase matching levels (CRITICAL, HIGH, MEDIUM, LOW).
 * - Truncate long text strings with ellipses.
 *
 * Dependencies:
 * - None
 */

/**
 * Counts total issues across all review sections in a single file review.
 *
 * Why:
 * Displays total count badges on the file card header components.
 *
 * @param {object} review - The file review findings object from the API.
 * @param {array}  sections - REVIEW_SECTIONS configuration constant.
 * @returns {number} Aggregate count of identified issues.
 */
export function countTotalIssues(review, sections) {
  return sections.reduce((acc, s) => acc + (review?.[s.key]?.length || 0), 0)
}

/**
 * Normalises a severity string to one of standard keys: CRITICAL | HIGH | MEDIUM | LOW.
 *
 * Why:
 * Ensures legacy or inconsistent casing patterns map correctly to visual style configurations.
 *
 * @param {string} sev - The raw severity indicator string.
 * @returns {string} Normalized uppercase severity indicator.
 */
export function normaliseSeverity(sev) {
  const upper = (sev || '').toUpperCase()
  return ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(upper) ? upper : 'LOW'
}

/**
 * Truncate a long string with ellipsis.
 *
 * Why:
 * Shortens long repository names or PR titles so they fit into compact labels.
 *
 * @param {string} str - Target text to truncate.
 * @param {number} maxLen - Maximum character length limit. Defaults to 60.
 * @returns {string} Truncated string.
 */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}
