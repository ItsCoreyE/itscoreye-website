import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isAdminRequestAuthorized } from '@/lib/server/adminAuth';
import { getSalesData, saveSalesData, HOME_DATA_TAG } from '@/lib/server/store';
import { normalizeSalesData } from '@/lib/salesData';

// GET - Fetch current sales data
export async function GET() {
  try {
    const data = await getSalesData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// POST - Save sales data (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequestAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = normalizeSalesData(body);

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Invalid sales data payload' },
        { status: 400 }
      );
    }

    await saveSalesData(data);
    revalidateTag(HOME_DATA_TAG);
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Data saved automatically to global storage!'
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}
