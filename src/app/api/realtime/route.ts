import { NextRequest } from 'next/server';
import { realtimeHub, RealtimeMessage } from '@/lib/realtimeHub';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection packet
      const initPayload = JSON.stringify({
        type: 'CONNECTED',
        payload: { status: 'LIVE', system: 'CRICKENTRY_REALTIME_STREAM' },
        timestamp: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(`data: ${initPayload}\n\n`));

      // Subscribe to real-time hub events
      const unsubscribe = realtimeHub.subscribe((message: RealtimeMessage) => {
        try {
          const serialized = `data: ${JSON.stringify(message)}\n\n`;
          controller.enqueue(encoder.encode(serialized));
        } catch {
          // Stream might be closed
        }
      });

      // Keep-alive heartbeat every 20 seconds
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeatInterval);
        }
      }, 20000);

      // Clean up when client disconnects
      req.signal.addEventListener('abort', () => {
        unsubscribe();
        clearInterval(heartbeatInterval);
        try {
          controller.close();
        } catch {
          // Ignored
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
