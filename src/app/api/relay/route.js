import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

// Relay API for bypassing cors protection
// Update on backend required to remove this
// Maybe someone will feel the need to fix this someday so no request have to intercepted but for now just use this
// This is untested btw and uploads are broken :o
// ;) :o :P :D

// Rate endpoint
export async function GET(req, res) {
  const url = new URL(req.url);
  const rating = url.searchParams.get('rating');
  const mid = url.searchParams.get('m_id');

  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ message: 'Error unauthorized', error: 'Unauthorized' })
  }

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

    // Check if response is ok
    if (!response.ok) {
      return res.status(response.status).end();
    }

    // Parse response and find errors because the api does not do this with codes for some reason ;)
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

// Post dish image endpoint
export async function POST(req, res) {
  const url = new URL(req.url);
  const fname = url.searchParams.get('qqfile');
  const file = req.body;

  // Minor spam protection
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return NextResponse.json({ message: 'Error unauthorized', error: 'Unauthorized' })
  }


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

    // Check if response is ok
    if (!response.ok) {
      return res.status(response.status).end();
    }

    // same as above
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