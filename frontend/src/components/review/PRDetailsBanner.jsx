/**
 * File: PRDetailsBanner.jsx
 *
 * Purpose:
 * Displays Pull Request metadata such as title, author, open/closed status, and modified file counts.
 *
 * Responsibilities:
 * - Render a metadata panel listing author name, changes metrics, and status badges.
 * - Display the title of the Pull Request inside a prominent visual box.
 * - Safely render null or fallback values if properties are missing or undefined.
 *
 * Props:
 * - details (object): The pull request details payload containing keys:
 *   - title (string): Title of the Pull Request.
 *   - author (string): GitHub author login identifier.
 *   - state (string): Current state of the PR (e.g. 'open' | 'closed').
 *   - changed_files (number): Total count of files changed in the PR.
 */

export default function PRDetailsBanner({ details }) {
  // Return null if details are not loaded/populated
  if (!details) return null

  // Map metadata items into structured list objects for simplified looping
  const metaItems = [
    { label: '👤 Author',        value: details.author        || 'N/A' },
    { label: '📂 Changed Files', value: details.changed_files ?? '—' },
    { label: '🔖 State',         value: (details.state || 'N/A').toUpperCase() },
  ]

  return (
    <section
      aria-label="Pull request details"
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-white/10 dark:bg-gray-900/60 dark:shadow-xl"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        📌 Pull Request Details
      </p>

      {/* Meta Grid Layout displaying key fields (Author, Changed Files count, State) */}
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metaItems.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-white/8 dark:bg-gray-800/50"
          >
            <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {label}
            </p>
            <p className="text-base font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* PR Title Display Box */}
      {details.title && (
        <div className="flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-500/20 dark:bg-violet-500/8">
          <span className="mt-0.5 shrink-0 text-sm">📝</span>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">PR Title: {details.title}</p>
        </div>
      )}
    </section>
  )
}
