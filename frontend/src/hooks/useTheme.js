/**
 * File: useTheme.js
 *
 * Purpose:
 * Custom React hook managing application theme configuration preferences (light or dark mode).
 * Toggles dark class designations on the HTML root element.
 *
 * Responsibilities:
 * - Load initial theme from localStorage or fall back to system prefers-color-scheme queries.
 * - Toggle styles class tags dynamically in a useEffect hook.
 * - Expose theme toggle methods to trigger theme changes from components.
 *
 * Returns:
 * - theme (string): Active visual theme ('light' | 'dark').
 * - toggleTheme (function): Toggles the current theme between 'light' and 'dark'.
 *
 * Dependencies:
 * - React (useState, useEffect)
 */

import { useState, useEffect } from 'react'

export function useTheme() {
  // Load target theme selection from storage database or consult media match OS options
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pr-reviewer-theme')
    if (saved) return saved
    // Respect OS preference as default
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Synchronize CSS class configurations on HTML root elements when theme selection is toggled
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pr-reviewer-theme', theme)
  }, [theme])

  /**
   * Action handler toggling light/dark themes.
   */
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
