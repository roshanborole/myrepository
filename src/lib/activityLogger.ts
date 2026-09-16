import { adminEngine } from '@/lib/adminStore';
import { realtimeHub } from '@/lib/realtimeHub';

export type UserActivityAction =
  | 'Account created'
  | 'Login'
  | 'Logout'
  | 'Match viewed'
  | 'Series viewed'
  | 'Player profile viewed'
  | 'Video opened'
  | 'Ticket booking started'
  | 'Number of people selected'
  | 'Stand selected'
  | 'Seat selected'
  | 'Seat released'
  | 'Booking submitted'
  | 'Payment initiated'
  | 'Payment successful'
  | 'Payment failed'
  | 'Ticket generated'
  | 'Profile updated'
  | 'Password changed'
  | 'Notification read'
  | 'Notification clicked'
  | 'Ticket viewed'
  | 'Find My Seat used';

export interface UserActivityEntry {
  id: string;
  userId?: string;
  userName?: string;
  action: UserActivityAction;
  details: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// In-memory persistent buffer for user activities
declare global {
  var __crickentry_user_activities__: UserActivityEntry[] | undefined;
}

const userActivities: UserActivityEntry[] =
  globalThis.__crickentry_user_activities__ || [];

if (process.env.NODE_ENV !== 'production') {
  globalThis.__crickentry_user_activities__ = userActivities;
}

export function logUserActivity(
  action: UserActivityAction,
  details: string,
  options?: {
    userId?: string;
    userName?: string;
    metadata?: Record<string, any>;
  }
): UserActivityEntry {
  const entry: UserActivityEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: options?.userId,
    userName: options?.userName || 'Fan',
    action,
    details,
    metadata: options?.metadata,
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }),
  };

  // Prepend to activities
  userActivities.unshift(entry);
  if (userActivities.length > 200) {
    userActivities.pop();
  }

  // Also log to adminEngine so it displays on Admin Dashboard and Admin Activity Logs
  try {
    adminEngine.logActivity(
      action,
      'User Activity',
      `${options?.userName || 'Fan'}: ${details}`
    );
  } catch {
    // Ignore in edge environments
  }

  // Broadcast in real-time
  try {
    realtimeHub.publish('ACTIVITY_LOGGED', entry);
  } catch {
    // Ignore
  }

  return entry;
}

export function getUserActivities(): UserActivityEntry[] {
  return [...userActivities];
}

/**
 * Client-safe helper to send an activity log to the server
 */
export async function trackClientActivity(
  action: UserActivityAction,
  details: string,
  metadata?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, details, metadata }),
      keepalive: true,
    });
  } catch {
    // Silent fail for telemetry
  }
}
