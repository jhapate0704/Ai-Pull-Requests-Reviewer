/**
 * File: main.jsx
 *
 * Purpose:
 * Entry point for the React application. Mounts the root React App component
 * to the DOM index.html anchor.
 *
 * Responsibilities:
 * - Render the App component inside React.StrictMode for highlighting potential problems.
 * - Inject global styles (index.css).
 *
 * Dependencies:
 * - React
 * - ReactDOM
 * - App component
 * - index.css
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize the root element container and render the root component tree
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
