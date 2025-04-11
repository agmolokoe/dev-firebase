
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Make sure DOM is ready before mounting
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root')
  if (!container) {
    throw new Error('Failed to find the root element')
  }

  const root = createRoot(container)

  // Use error boundary for more resilient rendering
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
