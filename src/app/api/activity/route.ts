import { NextRequest, NextResponse } from 'next/server';
import { logUserActivity, getUserActivities, UserActivityAction } from '@/lib/activityLogger';
import { getSessionUser } from '@/app/actions/auth';

export async function GET() {
  try {
    const activities = getUserActivities();
    return NextResponse.json({ success: true, activities });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve activities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, details, metadata } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'action is required' }, { status: 400 });
    }

    let session = null;
    try {
      session = await getSessionUser();
    } catch {
      // Non-blocking session resolution
    }

    const detailString = details || (metadata ? JSON.stringify(metadata) : String(action));

    const entry = logUserActivity(action as UserActivityAction, detailString, {
      userId: session?.id,
      userName: session?.name || session?.email?.split('@')[0] || 'Fan',
      metadata,
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    console.error('Activity route error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
