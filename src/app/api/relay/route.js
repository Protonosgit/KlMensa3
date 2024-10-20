import { NextResponse } from 'next/server';

export async function GET(req, res) {
  const url = new URL(req.url);
  const rating = url.searchParams.get('rating');
  const mid = url.searchParams.get('m_id');

  try {
    const response = await fetch(`https://www.mensa-kl.de/ajax/rate.php?m_id=${mid}&rating=${rating}`, {
      method: 'GET',
      headers: {
          'Priority': 'u=0',
          'Accept': '*/*',
          'Referer': 'https://kl-mensa.vercel.app/',
          'Origin': 'https://kl-mensa.vercel.app',
      },
    });

    if (!response.ok) {
      return res.status(response.status).end();
    }

    let data;
    if (response.headers.get('content-type')?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json({ data })

  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data', error })
  }
}

export async function POST(req, res) {
  const url = new URL(req.url);
  const rating = url.searchParams.get('rating');
  const mid = url.searchParams.get('m_id');

  try {
    const response = await fetch(`https://www.mensa-kl.de/ajax/rate.php?m_id=${mid}&rating=${rating}`, {
      method: 'GET',
      headers: {
          'Priority': 'u=0',
          'Accept': '*/*',
          'Referer': 'https://kl-mensa.vercel.app/',
          'Origin': 'https://kl-mensa.vercel.app',
      },
    });

    if (!response.ok) {
      return res.status(response.status).end();
    }

    let data;
    if (response.headers.get('content-type')?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json({ data })

  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data', error })
  }
    
}