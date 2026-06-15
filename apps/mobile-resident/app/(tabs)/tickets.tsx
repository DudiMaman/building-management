import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../lib/api';

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: string;
  opened_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  new: 'חדש',
  triaged: 'בטיפול',
  assigned: 'שובץ',
  in_progress: 'בעבודה',
  pending_parts: 'ממתין לחלקים',
  resolved: 'טופל',
  closed: 'סגור',
};

export default function TicketsScreen() {
  const router = useRouter();
  const { data: tickets, loading, error } = useApi<Ticket[]>('/me/tickets');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.header}>
        <Text style={styles.title}>פניות שירות</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/ticket-new')}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>פנייה חדשה</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={styles.empty}>טוען…</Text>}
      {error && <Text style={styles.empty}>שגיאה בטעינת הפניות</Text>}
      {!loading && (tickets ?? []).length === 0 && <Text style={styles.empty}>אין פניות פתוחות</Text>}

      {(tickets ?? []).map((t) => (
        <View key={t.id} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ticketTitle}>{t.title}</Text>
            <Text style={styles.meta}>{new Date(t.opened_at).toLocaleDateString('he-IL')}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{STATUS_LABEL[t.status] ?? t.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', writingDirection: 'rtl' },
  button: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4f46e5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: '600', writingDirection: 'rtl' },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 40, writingDirection: 'rtl' },
  row: {
    backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  ticketTitle: { fontWeight: '600', writingDirection: 'rtl' },
  meta: { color: '#64748b', fontSize: 12, marginTop: 2, writingDirection: 'rtl' },
  badge: { backgroundColor: '#eef2ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: '#4338ca', fontSize: 12, fontWeight: '600', writingDirection: 'rtl' },
});
