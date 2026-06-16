/**
 * Spinner — centered loading indicator with label.
 *
 * Props:
 *   label {string}
 */
export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16" role="status" aria-label={label}>
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600 dark:border-white/10 dark:border-t-violet-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}
