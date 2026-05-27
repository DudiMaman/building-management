import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { I18nManager } from 'react-native';
import * as Notifications from 'expo-notifications';
import { setupPushNotifications } from './lib/push';

// Force RTL for Hebrew
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function RootLayout() {
  useEffect(() => {
    // Register for push notifications on mount. Idempotent — safe to call
    // every launch. Failures are swallowed (user just won't get push).
    setupPushNotifications().catch(() => {});

    // Tap-on-notification handler. Drive deep links from notification
    // payloads (e.g. open a ticket, jump to pay screen).
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as
        | { route?: string }
        | undefined;
      if (data?.route) {
        // We can't import router at module scope; this is a no-op stub
        // until deep-link routing per notification category is wired
        // in the next milestone.
      }
    });

    return () => {
      responseSub.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="claim" />
      <Stack.Screen name="pay" />
      <Stack.Screen name="ticket-new" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
