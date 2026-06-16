/**
 * Count total issues across all review sections in a file review.
 * @param {Object} review - The review object from the API
 * @param {Array}  sections - REVIEW_SECTIONS constant
 * @returns {number}
 */
export function countTotalIssues(review, sections) {
  return sections.reduce((acc, s) => acc + (review?.[s.key]?.length || 0), 0)
}

/**
 * Normalise severity string to one of CRITICAL | HIGH | MEDIUM | LOW.
 * Defaults to LOW if unrecognised.
 * @param {string} sev
 * @returns {string}
 */
export function normaliseSeverity(sev) {
  const upper = (sev || '').toUpperCase()
  return ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(upper) ? upper : 'LOW'
}

/**
 * Truncate a long string with ellipsis.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}
