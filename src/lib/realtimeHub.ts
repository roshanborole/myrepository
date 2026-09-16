// Centralized Real-Time Event Hub for CrickEntry Stadium
// Provides in-process event subscription and broadcasting across Server Components,
// Server Actions, APIs, and the Server-Sent Events (SSE) stream.

import { EventEmitter } from 'events';

export type RealtimeEventType = 
  | 'BOOKING_CREATED'
  | 'SEAT_HOLD_CHANGED'
  | 'MATCH_UPDATE'
  | 'TICKET_UPDATE'
  | 'CONTENT_UPDATE'
  | 'NOTIFICATION'
  | 'ACTIVITY_LOGGED'
  | 'USER_UPDATE';

export interface RealtimeMessage<T = any> {
  type: RealtimeEventType;
  payload: T;
  timestamp: string;
}

class RealtimeHub {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    // Allow large number of concurrent listeners (SSE clients)
    this.emitter.setMaxListeners(200);
  }

  public publish<T = any>(type: RealtimeEventType, payload: T): void {
    const message: RealtimeMessage<T> = {
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.emitter.emit('event', message);
    this.emitter.emit(type, message);
  }

  public subscribe(listener: (message: RealtimeMessage) => void): () => void {
    this.emitter.on('event', listener);
    return () => {
      this.emitter.off('event', listener);
    };
  }

  public subscribeToType<T = any>(
    type: RealtimeEventType,
    listener: (message: RealtimeMessage<T>) => void
  ): () => void {
    this.emitter.on(type, listener);
    return () => {
      this.emitter.off(type, listener);
    };
  }
}

// Global Singleton to ensure instance persistence across Next.js API/action invocations
declare global {
  var __crickentry_realtime_hub__: RealtimeHub | undefined;
}

export const realtimeHub: RealtimeHub =
  globalThis.__crickentry_realtime_hub__ || new RealtimeHub();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__crickentry_realtime_hub__ = realtimeHub;
}
