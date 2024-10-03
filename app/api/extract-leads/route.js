import db from '@/lib/db'; // Ensure this is correctly set up
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Fetch URLs from the uploaded_sheets table
    const [urls] = await db.execute('SELECT sheet_url FROM uploaded_sheets');

    // Check if any URLs exist
    if (urls.length === 0) {
      return NextResponse.json({ message: 'No sheets found' }, { status: 404 });
    }

    // Return the list of URLs as a JSON response
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json({ message: 'Error fetching URLs' }, { status: 500 });
  }
}
