/**
 * File: Footer.jsx
 *
 * Purpose:
 * Renders the bottom footer segment of the application layout.
 *
 * Responsibilities:
 * - Display system name, version indicator, copyright statement, and attribution.
 * - Stick to the bottom of the page structure (using class mt-auto).
 *
 * Dependencies:
 * - React
 */

export default function Footer({ onPageChange }) {
  return (
    <footer className="mt-auto border-t border-gray-200 py-6 text-center text-xs text-gray-500 dark:border-white/10 dark:text-gray-500">
      <div className="mb-2">
        <button 
          onClick={() => onPageChange && onPageChange('about')}
          className="font-semibold text-gray-900 cursor-pointer hover:underline dark:text-white"
        >
          About / Help
        </button>
      </div>

      <div> 
        © 2026 Niraj Jhapate
      </div> 

    </footer>
  )
}
