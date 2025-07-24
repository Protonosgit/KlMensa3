'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrapper">
      <h1>Page Not Found</h1>
      <p>Sorry, we couldn’t find what you were looking for.</p>
      <p>
        <Link href="/">Return home</Link>
      </p>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background: #fff;
          color: #444;
          text-align: center;
          font-family: system-ui, sans-serif;
        }
        h1 {
          font-size: 3.5rem;
          margin: 0;
        }
        p {
          font-size: 1.1rem;
          margin: 0.8rem 0;
        }
        a {
          color: #0066cc;
          text-decoration: underline;
        }
        a:hover {
          color: #004999;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #fff;
        }
      `}</style>
    </div>
  )
}
