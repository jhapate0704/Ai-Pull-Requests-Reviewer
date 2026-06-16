/**
 * Alert — contextual message banner.
 *
 * Props:
 *   type    {'error' | 'success' | 'warning'}
 *   message {string | ReactNode}
 */
const STYLES = {
  error:   'border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
  success: 'border-green-300 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400',
  warning: 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300',
}

const ICONS = { error: '❌', success: '✅', warning: '⚠️' }

export default function Alert({ type = 'error', message }) {
  if (!message) return null
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed ${STYLES[type]}`}
    >
      <span className="mt-0.5 shrink-0 text-base">{ICONS[type]}</span>
      <span>{message}</span>
    </div>
  )
}
