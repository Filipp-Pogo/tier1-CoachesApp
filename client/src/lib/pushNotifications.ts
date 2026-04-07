/**
 * Push Notifications — Client-side subscription management.
 * Handles browser permission, service worker registration, and
 * storing the push subscription in Supabase.
 */

import { supabase, isSupabaseConfigured } from './supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && Boolean(VAPID_PUBLIC_KEY);
}

export async function getPushPermissionState(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported() || !isSupabaseConfigured || !supabase) return false;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisuallyOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    } as PushSubscriptionOptionsInit);

    const json = subscription.toJSON();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint: json.endpoint!,
        p256dh: json.keys!.p256dh,
        auth_key: json.keys!.auth,
      },
      { onConflict: 'user_id,endpoint' },
    );

    return !error;
  } catch {
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true;

    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', endpoint);
      }
    }

    return true;
  } catch {
    return false;
  }
}

export interface NotificationPreferences {
  upcomingSessions: boolean;
  assessmentReminders: boolean;
  onboardingNudges: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  upcomingSessions: true,
  assessmentReminders: true,
  onboardingNudges: true,
};

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  if (!isSupabaseConfigured || !supabase) return DEFAULT_PREFS;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_PREFS;

    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) return DEFAULT_PREFS;

    return {
      upcomingSessions: data.upcoming_sessions,
      assessmentReminders: data.assessment_reminders,
      onboardingNudges: data.onboarding_nudges,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreferences>,
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('notification_preferences').upsert(
      {
        user_id: user.id,
        upcoming_sessions: prefs.upcomingSessions,
        assessment_reminders: prefs.assessmentReminders,
        onboarding_nudges: prefs.onboardingNudges,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    return !error;
  } catch {
    return false;
  }
}
