'use client'
import Link from 'next/link'
 
export default function NotFound() {

  return (
    <div className="container">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p><Link href="/">Go back to homepage</Link></p>

      <style jsx>{`
        .container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f7f7f7;
          color: #333;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          margin: 0;
          text-align: center;
        }
        h1 {
          font-size: 4rem;
          margin-bottom: 0;
        }
        p {
          font-size: 1.2rem;
          margin-top: 0.5rem;
        }
        a {
          color: #0077cc;
          text-decoration: none;
          border-bottom: 1px solid #0077cc;
          transition: border-bottom-color 0.2s ease-in-out;
        }
        a:hover {
          border-bottom-color: transparent;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  )
}