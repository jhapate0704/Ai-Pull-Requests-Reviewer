/**
 * File: constants.js
 *
 * Purpose:
 * Stores immutable configurations and values shared across the frontend components.
 *
 * Responsibilities:
 * - Define severity level styling properties (background colors, badges, borders, emojis).
 * - Configure displayed review categories mapping to matching API payload keys.
 * - Store the base backend routing endpoint prefix.
 *
 * Dependencies:
 * - None
 */

// Severity level config — defines the color theme class mappings for different severity options
export const SEVERITY = {
  CRITICAL: {
    label: 'CRITICAL',
    emoji: '🔴',
    className: 'bg-red-500/10 border-red-500 text-red-400',
    badge: 'bg-red-500 text-white',
    border: 'border-l-red-500',
  },
  HIGH: {
    label: 'HIGH',
    emoji: '🟠',
    className: 'bg-orange-500/10 border-orange-500 text-orange-400',
    badge: 'bg-orange-500 text-white',
    border: 'border-l-orange-500',
  },
  MEDIUM: {
    label: 'MEDIUM',
    emoji: '🟡',
    className: 'bg-yellow-400/10 border-yellow-400 text-yellow-300',
    badge: 'bg-yellow-400 text-gray-900',
    border: 'border-l-yellow-400',
  },
  LOW: {
    label: 'LOW',
    emoji: '🟢',
    className: 'bg-green-500/10 border-green-500 text-green-400',
    badge: 'bg-green-500 text-white',
    border: 'border-l-green-500',
  },
}

// Review sections shown per file — maps category indicators to matching JSON keys from Groq APIs
export const REVIEW_SECTIONS = [
  { emoji: '🐞', title: 'Bugs',             key: 'bugs' },
  { emoji: '🔒', title: 'Security Issues',  key: 'security_issues' },
  { emoji: '⚠️', title: 'Edge Cases',       key: 'edge_cases' },
  { emoji: '⚡', title: 'Optimizations',    key: 'optimizations' },
  { emoji: '🧹', title: 'Code Quality',     key: 'code_quality_improvements' },
]

// Backend base URL — proxied through Vite configurations
export const API_BASE = '/api'
