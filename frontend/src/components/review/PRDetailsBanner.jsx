/**
 * PRDetailsBanner — displays PR metadata: author, state, file count, title.
 *
 * Props:
 *   details {Object} — { title, author, state, changed_files }
 */
export default function PRDetailsBanner({ details }) {
  if (!details) return null

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

      {/* Meta grid */}
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

      {/* Title */}
      {details.title && (
        <div className="flex items-start gap-2.5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-500/20 dark:bg-violet-500/8">
          <span className="mt-0.5 shrink-0 text-sm">📝</span>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{details.title}</p>
        </div>
      )}
    </section>
  )
}
