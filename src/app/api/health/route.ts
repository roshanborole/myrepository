import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint for AWS Load Balancer (ALB/NLB) Target Groups.
 * Returns HTTP 200 with basic status and system uptime.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'roshspark',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
