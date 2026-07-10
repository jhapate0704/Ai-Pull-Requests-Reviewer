/**
 * File: App.jsx
 *
 * Purpose:
 * Root application component. Serves as the main shell, handling global states
 * like session tokens, navigation tabs, user info, drawer visibility, and themes.
 *
 * Responsibilities:
 * - Handle GitHub OAuth token exchange callback from URL search parameters.
 * - Synchronize theme and session settings to local storage.
 * - Manage sidebar layout navigation and slide-out history panel triggers.
 * - Render views based on selected page keys ('review' | 'dashboard' | 'automations').
 *
 * Dependencies:
 * - React (useState, useEffect)
 * - Hooks (useTheme, useReviewHistory)
 * - Layout components (Sidebar, Footer)
 * - UI components (HistoryPanel)
 * - Page views (ReviewPage, DashboardPage, AutomationsPage)
 */

import { useState, useEffect } from 'react'
import { useTheme }          from './hooks/useTheme'
import { useReviewHistory }  from './hooks/useReviewHistory'
import Sidebar               from './components/layout/Sidebar'
import Footer                from './components/layout/Footer'
import HistoryPanel          from './components/ui/HistoryPanel'
import ReviewPage            from './pages/ReviewPage'
import DashboardPage         from './pages/DashboardPage'
import AutomationsPage       from './pages/AutomationsPage'
import AboutPage             from './pages/AboutPage'

export default function App() {
  // Toggle utilities and styling configurations for light/dark theme layout
  const { theme, toggleTheme }                          = useTheme()

  // Custom hook containing client-side persisted review summaries list
  const { history, addReview, remove, clearAll }        = useReviewHistory()

  // App JWT token generated on authentication (stored in localStorage)
  const [token,         setToken]                       = useState(localStorage.getItem('app_token') || '')

  // GitHub user login handle
  const [username,      setUsername]                    = useState(localStorage.getItem('github_username') || '')

  // GitHub user avatar image URL
  const [avatarUrl,     setAvatarUrl]                   = useState(localStorage.getItem('github_avatar_url') || '')

  // Set to true while exchanging credentials code for JWT via authentication endpoints
  const [isLoggingIn,   setIsLoggingIn]                 = useState(false)

  // Controls drawer open/close visibility for review history lists
  const [historyOpen,   setHistoryOpen]                 = useState(false)

  // Controls sidebar collapsible menus on small screens
  const [isMobileMenuOpen, setIsMobileMenuOpen]         = useState(false)

  // Cache object containing historical review details to load into PR reviewer screen
  const [restoreEntry,  setRestoreEntry]                = useState(null)

  // Determines current active page view ('review' | 'dashboard' | 'automations')
  const [currentPage,   setCurrentPage]                 = useState('review')

  // Handle GitHub OAuth Callback
  // Why:
  // After redirects from GitHub OAuth, the URL search parameters contain a 'code' value.
  // We extract it, clear the address bar, and dispatch it to our backend to exchange it for a session.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      setIsLoggingIn(true)
      
      // Clear URL parameter queries to restore clean URLs in address bar
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Request JWT credentials and profile details using OAuth code
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          // Store session payload locally
          localStorage.setItem('app_token', data.token)
          localStorage.setItem('github_username', data.username)
          if (data.avatar_url) localStorage.setItem('github_avatar_url', data.avatar_url)
          
          setToken(data.token)
          setUsername(data.username)
          if (data.avatar_url) setAvatarUrl(data.avatar_url)
        }
      })
      .catch(err => console.error("Login failed:", err))
      .finally(() => setIsLoggingIn(false))
    }
  }, [])

  /**
   * Redirects user to GitHub OAuth login page.
   *
   * Why:
   * Initiates authentication sequence to link a GitHub account.
   */
  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID';
    const redirectUri = window.location.origin;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  }

  /**
   * Logs the current user out.
   *
   * Why:
   * Resets session state variables and deletes credentials from localStorage.
   */
  const handleLogout = () => {
    localStorage.removeItem('app_token')
    localStorage.removeItem('github_username')
    localStorage.removeItem('github_avatar_url')
    setToken('')
    setUsername('')
    setAvatarUrl('')
  }

  /**
   * Loads a historic review from history drawers.
   *
   * Why:
   * Restores a previously parsed review payload on the reviewer page.
   *
   * @param {object} entry - The historical review record.
   */
  const handleLoadHistory = (entry) => {
    setRestoreEntry(entry)
    setCurrentPage('review')
  }

  // Render a loading state during code exchange requests
  if (isLoggingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Logging you in...</div>
      </div>
    )
  }

  return (
    <div
      className="flex h-[100dvh] flex-col overflow-hidden font-sans"
      style={{
        backgroundColor: theme === 'dark' ? '#030712' : '#f8fafc',
        color:           theme === 'dark' ? '#f9fafb' : '#111827',
      }}
    >
      {/* Ambient decorative glow blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-violet-600/10' : 'bg-violet-400/8'}`} />
        <div className={`absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-indigo-600/8' : 'bg-indigo-400/6'}`} />
        <div className={`absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full blur-[100px] ${theme === 'dark' ? 'bg-cyan-600/6' : 'bg-cyan-400/5'}`} />
      </div>

      {/* Mobile Header (Only visible on small screens) */}
      <header className="md:hidden shrink-0 sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md dark:border-white/10 dark:bg-gray-950/90">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
        >
          ☰
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">PR Reviewer</span>
        </div>
      </header>

      {/* Navigation and Actions Sidebar */}
      <Sidebar
        token={token}
        username={username}
        avatarUrl={avatarUrl}
        onLogin={handleGitHubLogin}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        historyCount={history.length}
        onHistoryOpen={() => setHistoryOpen(true)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* History Drawer slide-out panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onLoad={handleLoadHistory}
        onRemove={remove}
        onClear={clearAll}
      />

      {/* Route Views Switcher */}
      <main className="relative z-10 flex-1 overflow-y-auto md:ml-20 lg:ml-64 transition-all duration-300">
        {/* Pull Request review execution view */}
        {currentPage === 'review' && (
          <ReviewPage
            token={token}
            username={username}
            onLogin={handleGitHubLogin}
            onReviewComplete={addReview}
            restoreEntry={restoreEntry}
            onRestoreDone={() => setRestoreEntry(null)}
          />
        )}
        
        {/* Pull Request health dashboard statistics view */}
        {currentPage === 'dashboard' && (
          <DashboardPage 
            history={history}
            onLoadReview={handleLoadHistory}
          />
        )}
        
        {/* Webhook trigger configurations view */}
        {currentPage === 'automations' && (
          <AutomationsPage 
            token={token}
            onLogin={handleGitHubLogin}
          />
        )}
        
        {/* About/Help Instructions view */}
        {currentPage === 'about' && (
          <AboutPage onGoHome={() => setCurrentPage('review')} />
        )}
      </main>

      {/* System Footer bar */}
      <Footer onPageChange={setCurrentPage} />
    </div>
  )
}
