import { useCallback, useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import {
  isPushSupported,
  getPushPermissionState,
  subscribeToPush,
  unsubscribeFromPush,
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '@/lib/pushNotifications';

export function NotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    upcomingSessions: true,
    assessmentReminders: true,
    onboardingNudges: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(isPushSupported());
    getPushPermissionState().then(setPermission);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(Boolean(sub));
      });
    }

    getNotificationPreferences().then(setPrefs);
  }, []);

  const handleToggleSubscription = useCallback(async () => {
    setLoading(true);
    if (subscribed) {
      const ok = await unsubscribeFromPush();
      if (ok) setSubscribed(false);
    } else {
      const ok = await subscribeToPush();
      if (ok) {
        setSubscribed(true);
        setPermission('granted');
      } else {
        const perm = await getPushPermissionState();
        setPermission(perm);
      }
    }
    setLoading(false);
  }, [subscribed]);

  const handlePrefChange = useCallback(
    async (key: keyof NotificationPreferences) => {
      const updated = { ...prefs, [key]: !prefs[key] };
      setPrefs(updated);
      await updateNotificationPreferences(updated);
    },
    [prefs],
  );

  if (!supported) {
    return (
      <div className="rounded-xl border border-t1-border bg-t1-surface/50 p-4">
        <div className="flex items-center gap-2 text-t1-muted">
          <BellOff className="w-4 h-4" />
          <span className="text-sm">Push notifications are not supported in this browser.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-t1-border bg-t1-surface/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-t1-blue" />
          <span className="font-semibold text-sm">Push Notifications</span>
        </div>
        <button
          onClick={handleToggleSubscription}
          disabled={loading || permission === 'denied'}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            subscribed
              ? 'bg-t1-surface border border-t1-border text-t1-muted hover:text-t1-text'
              : 'bg-t1-blue text-white hover:bg-t1-blue/90'
          } disabled:opacity-50`}
        >
          {loading ? 'Working...' : subscribed ? 'Disable' : 'Enable'}
        </button>
      </div>

      {permission === 'denied' && (
        <p className="text-xs text-t1-red">
          Notifications are blocked. Please enable them in your browser settings.
        </p>
      )}

      {subscribed && (
        <div className="space-y-2 pt-2 border-t border-t1-border">
          <p className="text-xs text-t1-muted uppercase tracking-wider">Notify me about</p>
          {([
            ['upcomingSessions', 'Upcoming sessions'],
            ['assessmentReminders', 'Assessment reminders'],
            ['onboardingNudges', 'Onboarding completion'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">{label}</span>
              <button
                onClick={() => handlePrefChange(key)}
                className={`w-9 h-5 rounded-full transition-colors ${
                  prefs[key] ? 'bg-t1-blue' : 'bg-t1-border'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    prefs[key] ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
