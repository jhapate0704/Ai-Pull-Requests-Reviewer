import { useState, useEffect } from 'react'

/**
 * useTheme — single source of truth for dark/light mode.
 * - Reads saved preference from localStorage on first load.
 * - Falls back to OS preference if nothing saved.
 * - Adds/removes the `dark` class on <html> (required for Tailwind v4 @variant dark).
 *
 * @returns {{ theme: string, toggleTheme: Function }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pr-reviewer-theme')
    if (saved) return saved
    // Respect OS preference as default
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('pr-reviewer-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
