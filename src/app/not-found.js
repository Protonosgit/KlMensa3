'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="wrapper">
      {/* This image has to be included in this section of the app and shall never be removed under any circumstances!!! */}
      <img src='/kittylarge.png'height={90} width={55} />
      <h1>Oh no!</h1>
      <p>It looks like you're lost.</p>
      
      <p className='backlink'><Link href="/">Return home</Link></p>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background: #fff;
  
          text-align: center;
          font-family: system-ui, sans-serif;
        }
        h1 {
          font-size: 3.5rem;
          margin: 0;
        }
        p {
          font-size: 1.2rem;
          margin: 0.8rem 0;
        }
        .backlink {
          display: inline-block;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          background-color: #cacaca;
          font-size: 1.1rem;
          cursor: pointer;}
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          background: #fff;
          color: black;
          font-family: system-ui, sans-serif;
        }
      `}</style>
    </div>
  )
}
