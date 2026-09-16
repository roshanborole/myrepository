import { NextResponse } from 'next/server';
import { adminEngine } from '@/lib/adminStore';

export async function GET() {
  try {
    const liveMatch = adminEngine.getLiveMatchState();
    return NextResponse.json({ success: true, liveMatch });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch live match state' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === 'RECORD_BALL') {
      const updated = adminEngine.recordBall(payload);
      return NextResponse.json({ success: true, liveMatch: updated });
    }

    if (action === 'UNDO_BALL') {
      const updated = adminEngine.undoLastBall();
      return NextResponse.json({ success: true, liveMatch: updated });
    }

    if (action === 'UPDATE_STRIKER') {
      adminEngine.updateStriker(payload.name);
      return NextResponse.json({ success: true, liveMatch: adminEngine.getLiveMatchState() });
    }

    if (action === 'UPDATE_NON_STRIKER') {
      adminEngine.updateNonStriker(payload.name);
      return NextResponse.json({ success: true, liveMatch: adminEngine.getLiveMatchState() });
    }

    if (action === 'UPDATE_BOWLER') {
      adminEngine.updateBowler(payload.name);
      return NextResponse.json({ success: true, liveMatch: adminEngine.getLiveMatchState() });
    }

    if (action === 'UPDATE_STATUS') {
      adminEngine.setMatchStatus(payload.matchId, payload.status);
      return NextResponse.json({ success: true, liveMatch: adminEngine.getLiveMatchState() });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error in live scoring API' }, { status: 500 });
  }
}
