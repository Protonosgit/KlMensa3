import { NextResponse } from 'next/server';
import { fetchMenu } from '@/app/utils/schedule-parser';

export async function GET(req, res) {

  try {
    const menu = await fetchMenu();

    if (!menu || !menu?.length) {
      // Handle network error or server not responding
      if (req.nextUrl?.pathname === '/api/menu_v1') {
        return NextResponse.rewrite('/error', {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        });
      }

      return NextResponse.json({ message: 'Error fetching data' });
    }

    return NextResponse.json({ menu });

  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data', error });
  }
}

