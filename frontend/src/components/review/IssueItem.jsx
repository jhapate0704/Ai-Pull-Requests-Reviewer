/**
 * File: IssueItem.jsx
 *
 * Purpose:
 * Renders an individual issue box detailing code violations, severity classifications, and fix tips.
 *
 * Responsibilities:
 * - Render fallback styling for legacy plain string issues.
 * - Normalize and check issue severity levels to select appropriate colors/styles.
 * - Display severity badge labels along with descriptions.
 * - Render suggestion/solution details if present in the issue model.
 *
 * Props:
 * - item (string | object): The issue item detail which can be a raw string or an object containing:
 *   - issue (string): Description of the code issue.
 *   - severity (string): Level of severity (e.g. CRITICAL, HIGH, etc.).
 *   - suggestion (string): Code fix recommendation statement.
 */

import { SEVERITY } from '../../utils/constants'
import { normaliseSeverity } from '../../utils/helpers'

export default function IssueItem({ item }) {
  // Handle legacy plain-string items for backward compatibility
  if (typeof item === 'string') {
    return (
      <div className="rounded-md border-l-2 border-l-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 dark:border-l-gray-500 dark:bg-gray-800/40 dark:text-gray-300">
        {item}
      </div>
    )
  }

  // Normalize string case and select the matching configuration options (colors, borders, backgrounds)
  const sev    = normaliseSeverity(item.severity)
  const config = SEVERITY[sev]

  return (
    <div
      className={`rounded-md border-l-2 ${config.border} bg-gray-50 px-3 py-2.5 text-sm animate-[fadeIn_0.2s_ease] dark:bg-gray-800/50`}
    >
      {/* Header row containing severity badge label and description details */}
      <div className="mb-1 flex items-start gap-2">
        <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.badge}`}>
          {sev}
        </span>
        <span className="leading-snug text-gray-800 dark:text-gray-200">{item.issue}</span>
      </div>

      {/* Actionable suggestion/recommendation text */}
      {item.suggestion && (
        <div className="mt-2 flex items-start gap-1.5 border-t border-gray-200 pt-2 text-xs text-gray-600 leading-relaxed dark:border-white/8 dark:text-gray-400">
          <span className="shrink-0">💡</span>
          <span>{item.suggestion}</span>
        </div>
      )}
    </div>
  )
}
