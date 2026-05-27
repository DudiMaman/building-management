/**
 * Push notification setup for the resident app.
 *
 * - Asks for permission on first launch.
 * - Fetches an Expo push token (per device, per build).
 * - Registers it with the API so the notifications fanout can find us.
 *
 * Reads EAS project id from app config / EXPO_PUBLIC_EAS_PROJECT_ID. On
 * Android, ensures a default channel exists so notifications actually
 * show up on the lockscreen.
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { api } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const ANDROID_DEFAULT_CHANNEL = 'default';

export interface PushSetupResult {
  ok: boolean;
  token?: string;
  reason?: 'not_a_device' | 'permission_denied' | 'no_project_id' | 'register_failed' | 'error';
  error?: string;
}

/**
 * Idempotent — call from RootLayout on every mount. Registers + posts
 * the token if we don't already have one for this device session.
 */
export async function setupPushNotifications(): Promise<PushSetupResult> {
  if (!Device.isDevice) {
    return { ok: false, reason: 'not_a_device' };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_DEFAULT_CHANNEL, {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
    });
  }

  const settings = await Notifications.getPermissionsAsync();
  let granted =
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted;
  }
  if (!granted) {
    return { ok: false, reason: 'permission_denied' };
  }

  const projectId =
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants.expoConfig as unknown as { extra?: { eas?: { projectId?: string } } })?.extra
      ?.eas?.projectId;

  let tokenResult;
  try {
    tokenResult = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
  } catch (err) {
    return { ok: false, reason: 'no_project_id', error: (err as Error).message };
  }

  try {
    await api('/people/me/push-token', {
      method: 'PUT',
      body: { token: tokenResult.data, platform: Platform.OS as 'ios' | 'android' | 'web' },
    });
    return { ok: true, token: tokenResult.data };
  } catch (err) {
    return { ok: false, reason: 'register_failed', error: (err as Error).message };
  }
}

/** Forget the push token on sign-out. */
export async function teardownPushNotifications(): Promise<void> {
  try {
    await api('/people/me/push-token', { method: 'DELETE' });
  } catch {
    // best-effort
  }
}
