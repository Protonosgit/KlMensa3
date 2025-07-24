'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
  }, [error])

  // This could call an api to a telegram bot for error notifications
  return (
    <div className="container">
      <h1>Server Error</h1>
      <p>A critical error has occurred which the service could not recover from.</p>
      <p>Contact your administrator or reset the page.</p>
      <button onClick={() => reset()}>Retry</button>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          font-family: system-ui, sans-serif;
        }
        h1 {
          font-size: 2rem;
          margin: 0;
        }
        p {
          margin: 1rem 0;
        }
        button {
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0059c1;
        }
      `}</style>
    </div>
  )
}
