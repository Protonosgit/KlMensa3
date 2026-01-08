'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
  }, [error])

  // This could call an api to a telegram bot for error notifications
  return (
    <div className="container">
      <h1>Server Error</h1>
      <p>If you see this I f***ed up again</p>
      <button onClick={() => reset()}>🦞 Retry 🦞</button>
      <a  href='https://github.com/Protonosgit/KlMensa3/issues/new?template=bug_report.md'><button >🦐 Report Issue 🦐</button></a>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
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
        margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #0059beff;
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
