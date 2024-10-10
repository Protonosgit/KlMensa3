import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div style={{textAlign: 'center'}}>
      <h1>404 Not Found</h1>
      <Link style={{color: 'blue'}} href="/">Return Home</Link>
    </div>
  )
}