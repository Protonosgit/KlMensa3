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
  const fname = url.searchParams.get('qqfile');
  const file = req.body


  try {
    const response = await fetch(`https://www.mensa-kl.de/ajax/fileuploader.php?page=public&qqfile=${fname}`, {
      method: 'POST',
      headers: {
          'Priority': 'u=0',
          'Accept': '*/*',
          'X-File-Name': fname,
          'Content-Type': 'application/octet-stream',
          'Referer': 'https://kl-mensa.vercel.app/',
          'Origin': 'https://kl-mensa.vercel.app',
      },
      body: file
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