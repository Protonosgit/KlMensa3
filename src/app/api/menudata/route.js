import { NextResponse } from 'next/server';
import {  fetchMenu } from '@/app/utils/api-bridge';

export async function GET(req, res) {

  try {
    const rawParseData = await fetchMenu();
      const menu = rawParseData?.splitMenu;

      if(!menu || !menu?.length) {
        return NextResponse.json({ message: 'Error fetching data' })
      }

    return NextResponse.json({ menu })

  } catch (error) {
    return NextResponse.json({ message: 'Error fetching data', error })
  }
}

