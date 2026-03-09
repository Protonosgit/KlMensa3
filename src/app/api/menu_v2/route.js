import { NextResponse } from 'next/server';
import {ParseMenu} from '@/app/utils/meal-parser';

export async function GET(req, res) {

  try {
    const menu = await ParseMenu();

    if (!menu || !menu?.length) {
      throw new Error('Parser returned invalid data');
    }

    return NextResponse.json({ menu });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching data' });
  }
}

