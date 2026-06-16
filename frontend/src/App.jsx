import { useState, useEffect } from 'react'
import { useTheme }          from './hooks/useTheme'
import { useReviewHistory }  from './hooks/useReviewHistory'
import Sidebar               from './components/layout/Sidebar'
import Footer                from './components/layout/Footer'
import HistoryPanel          from './components/ui/HistoryPanel'
import ReviewPage            from './pages/ReviewPage'
import DashboardPage         from './pages/DashboardPage'
import AutomationsPage       from './pages/AutomationsPage'

/**
 * App — root component.
 * Owns: theme, token, history panel open-state, review history.
 */
export default function App() {
  const { theme, toggleTheme }                          = useTheme()
  const { history, addReview, remove, clearAll }        = useReviewHistory()
  const [token,         setToken]                       = useState(localStorage.getItem('app_token') || '')
  const [username,      setUsername]                    = useState(localStorage.getItem('github_username') || '')
  const [avatarUrl,     setAvatarUrl]                   = useState(localStorage.getItem('github_avatar_url') || '')
  const [isLoggingIn,   setIsLoggingIn]                 = useState(false)
  const [historyOpen,   setHistoryOpen]                 = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen]         = useState(false)
  const [restoreEntry,  setRestoreEntry]                = useState(null)
  const [currentPage,   setCurrentPage]                 = useState('review') // 'review' | 'dashboard' | 'automations'

  // Handle GitHub OAuth Callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      setIsLoggingIn(true)
      // Remove code from URL
      window.history.replaceState({}, document.title, window.location.pathname)
      
      fetch('http://localhost:8000/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
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

  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_CLIENT_ID';
    const redirectUri = window.location.origin;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  }

  const handleLogout = () => {
    localStorage.removeItem('app_token')
    localStorage.removeItem('github_username')
    localStorage.removeItem('github_avatar_url')
    setToken('')
    setUsername('')
    setAvatarUrl('')
  }

  const handleLoadHistory = (entry) => {
    setRestoreEntry(entry)
    setCurrentPage('review')
  }

  if (isLoggingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Logging you in...</div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen flex-col font-sans"
      style={{
        backgroundColor: theme === 'dark' ? '#030712' : '#f8fafc',
        color:           theme === 'dark' ? '#f9fafb' : '#111827',
      }}
    >
      {/* Ambient glow blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-violet-600/10' : 'bg-violet-400/8'}`} />
        <div className={`absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full blur-[120px] ${theme === 'dark' ? 'bg-indigo-600/8' : 'bg-indigo-400/6'}`} />
        <div className={`absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full blur-[100px] ${theme === 'dark' ? 'bg-cyan-600/6' : 'bg-cyan-400/5'}`} />
      </div>

      {/* Mobile Header (Only visible on small screens) */}
      <header className="md:hidden sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur-md dark:border-white/10 dark:bg-gray-950/90">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">PR Reviewer</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
        >
          ☰
        </button>
      </header>

      {/* Sidebar Navigation */}
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

      {/* History drawer */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onLoad={handleLoadHistory}
        onRemove={remove}
        onClear={clearAll}
      />

      {/* Main page */}
      <main className="relative z-10 flex-1 md:ml-20 lg:ml-64 transition-all duration-300">
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
        
        {currentPage === 'dashboard' && (
          <DashboardPage 
            history={history}
            onLoadReview={handleLoadHistory}
          />
        )}
        
        {currentPage === 'automations' && (
          <AutomationsPage 
            token={token}
            onLogin={handleGitHubLogin}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
