import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useApi } from '../lib/api';

interface Charge {
  id: string;
  description: string | null;
  amount: string;
  paid_amount: string;
  due_date: string | null;
  status: string;
}

const PAYABLE = new Set(['pending', 'partial', 'overdue']);

export default function ChargesScreen() {
  const router = useRouter();
  const { data: charges, loading, error } = useApi<Charge[]>('/me/charges');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>חיובים</Text>
      {loading && <Text style={styles.empty}>טוען…</Text>}
      {error && <Text style={styles.empty}>שגיאה בטעינת החיובים</Text>}
      {!loading && (charges ?? []).length === 0 && <Text style={styles.empty}>אין חיובים</Text>}
      {(charges ?? []).map((c) => {
        const paid = !PAYABLE.has(c.status);
        return (
          <View key={c.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.desc}>{c.description ?? 'חיוב'}</Text>
              {c.due_date && <Text style={styles.due}>פירעון: {c.due_date}</Text>}
              {!paid && (
                <TouchableOpacity style={styles.payBtn} onPress={() => router.push(`/pay?charge_id=${c.id}`)}>
                  <Text style={styles.payText}>שלם עכשיו</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>₪{Number(c.amount).toLocaleString('he-IL')}</Text>
              <View style={[styles.badge, paid ? styles.badgePaid : styles.badgePending]}>
                <Text style={[styles.badgeText, paid ? styles.badgeTextPaid : styles.badgeTextPending]}>
                  {paid ? 'שולם' : 'ממתין'}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', writingDirection: 'rtl', marginBottom: 12 },
  row: {
    backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  desc: { fontWeight: '600', writingDirection: 'rtl' },
  due: { color: '#64748b', fontSize: 12, marginTop: 2, writingDirection: 'rtl' },
  amount: { fontWeight: '700', fontSize: 18 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 },
  badgePaid: { backgroundColor: '#dcfce7' },
  badgePending: { backgroundColor: '#fef3c7' },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextPaid: { color: '#166534' },
  badgeTextPending: { color: '#92400e' },
  payBtn: { marginTop: 8, backgroundColor: '#4f46e5', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start' },
  payText: { color: 'white', fontWeight: '600', fontSize: 13, writingDirection: 'rtl' },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 40, writingDirection: 'rtl' },
});
