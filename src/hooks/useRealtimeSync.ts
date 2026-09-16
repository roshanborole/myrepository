'use client';

import { useEffect, useRef } from 'react';
import { RealtimeEventType, RealtimeMessage } from '@/lib/realtimeHub';

type EventHandler = (message: RealtimeMessage) => void;

export function useRealtimeSync(
  eventTypes: RealtimeEventType[] | 'ALL',
  onMessage: EventHandler
) {
  const handlerRef = useRef<EventHandler>(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource('/api/realtime');

        eventSource.onmessage = (event) => {
          try {
            const data: RealtimeMessage = JSON.parse(event.data);
            if (!data || !data.type) return;

            if (
              eventTypes === 'ALL' ||
              (Array.isArray(eventTypes) && eventTypes.includes(data.type))
            ) {
              handlerRef.current(data);
            }
          } catch {
            // Not a JSON message or heartbeat
          }
        };

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          // Reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };
      } catch (err) {
        console.warn('Real-time connection error:', err);
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [JSON.stringify(eventTypes)]);
}
