import { useState, useRef, useEffect } from 'react'
import { downloadMarkdown, downloadPDF } from '../../utils/exportUtils'

/**
 * ExportButton — dropdown to export review as Markdown or PDF.
 *
 * Props:
 *   prDetails {Object|null}
 *   reviews   {Array}
 *   prUrl     {string}
 */
export default function ExportButton({ prDetails, reviews, prUrl }) {
  const [open, setOpen]       = useState(false)
  const [status, setStatus]   = useState('')   // 'md' | 'pdf' | ''
  const dropdownRef           = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleMarkdown = () => {
    setStatus('md')
    setOpen(false)
    downloadMarkdown(prDetails, reviews, prUrl)
    setTimeout(() => setStatus(''), 2000)
  }

  const handlePDF = () => {
    setStatus('pdf')
    setOpen(false)
    downloadPDF(prDetails, reviews, prUrl)
    setTimeout(() => setStatus(''), 2000)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        id="export-btn"
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-violet-400 hover:text-violet-700 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-violet-500/60 dark:hover:text-violet-300"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {status === 'md'  ? '✅ Downloading…' :
         status === 'pdf' ? '✅ Opening PDF…' :
         <>📥 Export <span className="text-gray-400 dark:text-gray-500">▾</span></>
        }
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-gray-900"
        >
          {/* Markdown */}
          <button
            role="menuitem"
            onClick={handleMarkdown}
            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <span className="mt-0.5 text-lg">📝</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">Markdown</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Download as <code className="text-[11px]">.md</code> file</p>
            </div>
          </button>

          <div className="mx-4 border-t border-gray-100 dark:border-white/8" />

          {/* PDF */}
          <button
            role="menuitem"
            onClick={handlePDF}
            className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
          >
            <span className="mt-0.5 text-lg">📄</span>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">PDF Report</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Print or save as PDF</p>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
