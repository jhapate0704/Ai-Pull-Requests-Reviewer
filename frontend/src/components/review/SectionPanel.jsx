import IssueItem from './IssueItem'

/**
 * SectionPanel — panel for one review category (Bugs, Security, etc.)
 *
 * Props:
 *   emoji  {string}
 *   title  {string}
 *   items  {Array}
 */
export default function SectionPanel({ emoji, title, items }) {
  const hasIssues = items.length > 0

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/8 dark:bg-gray-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3.5 py-2.5 dark:border-white/8 dark:bg-gray-800/40">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
          {emoji} {title}
        </span>
        <span
          className={[
            'rounded-full px-2 py-0.5 text-[11px] font-bold',
            hasIssues
              ? 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'
              : 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400',
          ].join(' ')}
        >
          {items.length}
        </span>
      </div>

      {/* Body */}
      {!hasIssues ? (
        <div className="flex items-center gap-1.5 px-3.5 py-3 text-sm text-gray-500 dark:text-gray-500">
          <span>✅</span> No issues found
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3">
          {items.map((item, i) => (
            <IssueItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
