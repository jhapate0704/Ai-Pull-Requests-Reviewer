/**
 * File: Sidebar.jsx
 *
 * Purpose:
 * Renders the global responsive navigation sidebar. Handles page routing selections,
 * GitHub profile/OAuth login statuses, theme configuration triggers, and mobile drawer toggles.
 *
 * Responsibilities:
 * - Render navigation tabs (Review PR, Analytics, Automations) with active highlights.
 * - Toggle slide-out history drawers and show history item count badges.
 * - Show linked GitHub login usernames and avatars or action prompts.
 * - Toggle display configurations (Light/Dark themes).
 * - Render responsive layouts (width changes across small, medium, and large viewports).
 *
 * Props:
 * - token (string): Session validation token.
 * - username (string): Current logged-in GitHub username.
 * - avatarUrl (string): GitHub profile image URL link.
 * - onLogin (function): Callback redirecting to GitHub OAuth login page.
 * - onLogout (function): Callback cleaning up session credentials.
 * - theme (string): Active visual theme ('light' | 'dark').
 * - onToggleTheme (function): Callback toggling visual themes.
 * - historyCount (number): Count of historical entries saved.
 * - onHistoryOpen (function): Callback triggering history slide-out drawers.
 * - currentPage (string): Key indicator of the active view.
 * - onPageChange (function): Callback mapping routes to new page values.
 * - isMobileMenuOpen (boolean): Indicator of mobile nav visibility.
 * - setIsMobileMenuOpen (function): Setter changing mobile menu visibility.
 */

import { useState } from 'react'

export default function Sidebar({ 
  token, username, avatarUrl, onLogin, onLogout, theme, onToggleTheme, historyCount, onHistoryOpen, 
  currentPage, onPageChange, isMobileMenuOpen, setIsMobileMenuOpen, isCollapsed, setIsCollapsed 
}) {

  /**
   * Updates routing tabs and collapses mobile menus.
   *
   * @param {string} page - The target page key.
   */
  const handlePageChange = (page) => {
    onPageChange(page)
    setIsMobileMenuOpen(false)
  }

  /**
   * Internal subcomponent representing a navigation item.
   *
   * @param {object} props
   * @param {string} props.page - Target page destination.
   * @param {string} props.icon - Emoji icon.
   * @param {string} props.label - Descriptive label.
   */
  const NavItem = ({ page, icon, label }) => {
    const isActive = currentPage === page
    return (
      <button
        onClick={() => handlePageChange(page)}
        className={[
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all w-full min-h-[48px]',
          isActive 
            ? 'bg-violet-50 text-violet-700 dark:bg-gray-800 dark:text-violet-400' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white',
          isCollapsed ? 'justify-center' : 'justify-start'
        ].join(' ')}
      >
        <span className="text-xl shrink-0">{icon}</span>
        <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>{label}</span>
      </button>
    )
  }

  return (
    <>
      {/* Mobile Backdrop - Overlay layout rendered behind mobile side drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-white/10 dark:bg-gray-950',
          // Widths: dynamic based on state
          isCollapsed ? 'w-20' : 'w-64',
          // Mobile: Drawer slide logic
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0">🤖</span>
            <span className={`text-base font-bold tracking-tight text-gray-900 dark:text-white truncate ${isCollapsed ? 'hidden' : 'block'}`}>
              PR Reviewer
            </span>
          </div>
          {/* Desktop Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-10 w-6 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            {isCollapsed ? '▶' : '◀'}
          </button>
          {/* Mobile Close Button */}
          <button 
            className="md:hidden flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem page="review" icon="🔍" label="Review PR" />
          <NavItem page="dashboard" icon="📈" label="Team Analytics Dashboard" />
          <NavItem page="automations" icon="⚡" label="Automations" />
        </div>

        {/* Bottom Actions section */}
        <div className="border-t border-gray-200 p-3 dark:border-white/10 space-y-2">
          {/* History drawer toggle button */}
          <button
            onClick={() => { onHistoryOpen(); setIsMobileMenuOpen(false); }}
            className={`flex w-full min-h-[48px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-500/50 dark:hover:text-violet-400 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <span className="relative flex shrink-0 text-lg">
              📋
              {historyCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">
                  {historyCount > 9 ? '9+' : historyCount}
                </span>
              )}
            </span>
            <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>History</span>
          </button>

          {/* GitHub Session Actions */}
          {token ? (
            <div className="flex flex-col gap-1">
              <div className={`flex w-full items-center gap-3 rounded-xl border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="h-6 w-6 shrink-0 rounded-full" />
                ) : (
                  <span className="shrink-0 text-lg">👤</span>
                )}
                <span className={`truncate text-xs ${isCollapsed ? 'hidden' : 'block'}`}>{username}</span>
              </div>
              <button
                onClick={onLogout}
                className={`flex w-full min-h-[48px] items-center gap-3 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-white/10 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                <span className="shrink-0 text-lg">🚪</span>
                <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>Unlink Account</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
              className={`flex w-full min-h-[48px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:border-white/10 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <span className="shrink-0 text-lg">🐱</span>
              <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>Login with GitHub</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`flex w-full min-h-[48px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-violet-300 hover:text-violet-600 dark:border-white/10 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-500/50 dark:hover:text-violet-400 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          >
            <span className="shrink-0 text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className={`truncate ${isCollapsed ? 'hidden' : 'block'}`}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
