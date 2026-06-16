import { useState } from 'react'

export default function Sidebar({ 
  token, username, avatarUrl, onLogin, onLogout, theme, onToggleTheme, historyCount, onHistoryOpen, 
  currentPage, onPageChange, isMobileMenuOpen, setIsMobileMenuOpen 
}) {

  const handlePageChange = (page) => {
    onPageChange(page)
    setIsMobileMenuOpen(false)
  }

  const NavItem = ({ page, icon, label }) => {
    const isActive = currentPage === page
    return (
      <button
        onClick={() => handlePageChange(page)}
        className={[
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all w-full',
          isActive 
            ? 'bg-violet-50 text-violet-700 dark:bg-gray-800 dark:text-violet-400' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white',
          'md:justify-center lg:justify-start'
        ].join(' ')}
      >
        <span className="text-xl shrink-0">{icon}</span>
        <span className="md:hidden lg:block truncate">{label}</span>
      </button>
    )
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-white/10 dark:bg-gray-950',
          // Widths
          'w-64 md:w-20 lg:w-64',
          // Mobile: Drawer logic
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-2xl shrink-0">🤖</span>
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white truncate md:hidden lg:block">
              PR Reviewer
            </span>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem page="review" icon="🔍" label="Review PR" />
          <NavItem page="dashboard" icon="📈" label="Team Analytics Dashboard" />
          <NavItem page="automations" icon="⚡" label="Automations" />
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-3 dark:border-white/10 space-y-2">
          {/* History Button */}
          <button
            onClick={() => { onHistoryOpen(); setIsMobileMenuOpen(false); }}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-500/50 dark:hover:text-violet-400 md:justify-center lg:justify-start"
          >
            <span className="relative flex shrink-0 text-lg">
              📋
              {historyCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </span>
            <span className="md:hidden lg:block truncate">History</span>
          </button>

          {/* GitHub Login / Profile Button */}
          {token ? (
            <div className="flex flex-col gap-1">
              <div className="flex w-full items-center gap-3 rounded-xl border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 md:justify-center lg:justify-start">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="h-6 w-6 rounded-full" />
                ) : (
                  <span className="shrink-0 text-lg">👤</span>
                )}
                <span className="md:hidden lg:block truncate text-xs">{username}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-white/10 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30 md:justify-center lg:justify-start"
              >
                <span className="shrink-0 text-lg">🚪</span>
                <span className="md:hidden lg:block truncate">Unlink Account</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:border-white/10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 md:justify-center lg:justify-start"
            >
              <span className="shrink-0 text-lg">🐱</span>
              <span className="md:hidden lg:block truncate">Login with GitHub</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-500/50 dark:hover:text-violet-400 md:justify-center lg:justify-start"
          >
            <span className="shrink-0 text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="md:hidden lg:block truncate">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
