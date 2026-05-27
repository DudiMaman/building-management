import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  createIframeSession,
  postIframeResult,
  type IframeSession,
  type IframeResult,
} from './lib/api';

type Phase = 'loading' | 'ready' | 'finalizing' | 'success' | 'failed';

/**
 * Resident "Pay charge" screen.
 *
 * Flow:
 *   1. POST /v1/payments/iframe-session — gets the Tranzila iframe URL +
 *      HMAC-signed state for this charge.
 *   2. Render the iframe inside a WebView. Card data stays inside
 *      Tranzila (PCI SAQ-A safe).
 *   3. The iframe (or our mock impersonator) postMessages back the result
 *      via ReactNativeWebView.postMessage.
 *   4. Forward the payload to POST /v1/payments/iframe-result so the
 *      server can finalize the Payment row, save the card token, and
 *      reconcile the Charge.
 *   5. Show a Hebrew success / failure screen.
 */
export default function PayScreen() {
  const router = useRouter();
  const { charge_id, installments } = useLocalSearchParams<{
    charge_id?: string;
    installments?: string;
  }>();
  const [phase, setPhase] = useState<Phase>('loading');
  const [session, setSession] = useState<IframeSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IframeResult | null>(null);
  const finalizedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!charge_id) {
        setError('חסר מזהה חיוב');
        setPhase('failed');
        return;
      }
      try {
        const s = await createIframeSession(
          charge_id,
          installments ? parseInt(installments, 10) : 1,
        );
        if (!cancelled) {
          setSession(s);
          setPhase('ready');
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
          setPhase('failed');
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [charge_id, installments]);

  async function handleMessage(evt: WebViewMessageEvent) {
    if (finalizedRef.current) return;
    let payload: {
      state?: string;
      response_code?: string;
      txn_id?: string;
      token?: string;
      last4?: string;
      brand?: string;
      raw?: Record<string, unknown>;
    };
    try {
      payload = JSON.parse(evt.nativeEvent.data);
    } catch {
      return;
    }
    if (!payload?.state || !payload.response_code) return;
    finalizedRef.current = true;
    setPhase('finalizing');
    try {
      const r = await postIframeResult({
        state: payload.state,
        response_code: payload.response_code,
        txn_id: payload.txn_id ?? null,
        token: payload.token ?? null,
        last4: payload.last4 ?? null,
        brand: payload.brand ?? null,
        raw: payload.raw,
      });
      setResult(r);
      setPhase(r.ok ? 'success' : 'failed');
      if (!r.ok) setError(r.reason ?? 'תשלום נכשל');
    } catch (err) {
      setError((err as Error).message);
      setPhase('failed');
    }
  }

  // Injected JS forwards the iframe's window.postMessage call to RN.
  // Tranzila in production fires a window.postMessage on the parent page;
  // our mock uses ReactNativeWebView.postMessage directly so this catches
  // both shapes.
  const injectedJs = `
    (function() {
      var send = function(data) {
        if (window.ReactNativeWebView && typeof data === 'object') {
          window.ReactNativeWebView.postMessage(JSON.stringify(data));
        }
      };
      window.addEventListener('message', function(ev) {
        send(ev.data);
      });
      window.alert = function(msg) { send({ alert: String(msg) }); };
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>ביטול</Text>
        </TouchableOpacity>
        <Text style={styles.title}>תשלום מאובטח</Text>
        <View style={{ width: 50 }} />
      </View>

      {phase === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.note}>מכין דף תשלום...</Text>
        </View>
      )}

      {phase === 'ready' && session && (
        <WebView
          source={{ uri: session.url }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#4f46e5" />
            </View>
          )}
          onMessage={handleMessage}
          injectedJavaScript={injectedJs}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
        />
      )}

      {phase === 'finalizing' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.note}>מסיים תשלום...</Text>
        </View>
      )}

      {phase === 'success' && (
        <View style={styles.center}>
          <Text style={styles.bigEmoji}>✓</Text>
          <Text style={styles.successTitle}>התשלום הצליח</Text>
          <Text style={styles.note}>קבלה בעברית תישלח אליכם בקרוב</Text>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.ctaText}>חזרה למסך הבית</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'failed' && (
        <View style={styles.center}>
          <Text style={styles.bigEmojiFail}>✗</Text>
          <Text style={styles.failTitle}>התשלום נכשל</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity
            style={styles.cta}
            onPress={() => {
              finalizedRef.current = false;
              setError(null);
              setResult(null);
              setPhase('loading');
              if (charge_id) {
                createIframeSession(charge_id)
                  .then((s) => {
                    setSession(s);
                    setPhase('ready');
                  })
                  .catch((err) => {
                    setError((err as Error).message);
                    setPhase('failed');
                  });
              }
            }}
          >
            <Text style={styles.ctaText}>נסה שוב</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelLink}>חזרה</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 18, fontWeight: '700', writingDirection: 'rtl' },
  cancel: { color: '#4f46e5', fontSize: 16, writingDirection: 'rtl' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  note: { color: '#64748b', fontSize: 14, writingDirection: 'rtl', textAlign: 'center' },
  bigEmoji: { fontSize: 64, color: '#16a34a' },
  bigEmojiFail: { fontSize: 64, color: '#dc2626' },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#16a34a',
    writingDirection: 'rtl',
  },
  failTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dc2626',
    writingDirection: 'rtl',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  cta: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 24,
  },
  ctaText: { color: 'white', fontSize: 16, fontWeight: '700' },
  cancelLink: { color: '#64748b', fontSize: 14, marginTop: 12 },
});
