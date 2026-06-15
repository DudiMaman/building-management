import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, useApi } from './lib/api';

interface Task {
  id: string;
  title: string;
  building_id: string;
  priority: 'low' | 'med' | 'high' | 'urgent';
  status: string;
  scheduled_at: string | null;
  description_md: string | null;
}

export default function TodayScreen() {
  const { data: tasks, loading, error, reload } = useApi<Task[]>('/workers/me/today');

  async function markDone(id: string) {
    try {
      await api(`/tasks/${id}/status`, { method: 'PATCH', body: { status: 'done' } });
      reload();
    } catch (e) {
      Alert.alert('שגיאה', 'עדכון המשימה נכשל. נסו שוב.');
    }
  }

  async function start(id: string) {
    try {
      await api(`/tasks/${id}/status`, { method: 'PATCH', body: { status: 'in_progress' } });
      reload();
    } catch (e) {
      Alert.alert('שגיאה', 'עדכון נכשל.');
    }
  }

  const list = tasks ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingTop: 60 }}>
      <Text style={styles.title}>היום</Text>
      <Text style={styles.subtitle}>
        {loading ? 'טוען…' : error ? 'שגיאה בטעינה' : `${list.length} משימות מתוכננות`}
      </Text>

      {!loading && list.length === 0 && <Text style={styles.empty}>אין משימות פתוחות 🎉</Text>}

      {list.map((t) => {
        const pr = t.priority === 'urgent' ? 'high' : t.priority;
        return (
          <View key={t.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.time}>
                {t.scheduled_at ? new Date(t.scheduled_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '—'}
              </Text>
              <View style={[styles.badge, pr === 'high' ? styles.badgeHigh : pr === 'med' ? styles.badgeMed : styles.badgeLow]}>
                <Text style={styles.badgeText}>
                  {t.priority === 'urgent' ? 'דחוף מאוד' : t.priority === 'high' ? 'דחוף' : t.priority === 'med' ? 'בינוני' : 'נמוך'}
                </Text>
              </View>
            </View>
            <Text style={styles.taskTitle}>{t.title}</Text>
            {t.status === 'in_progress' && <Text style={styles.inprog}>בעבודה</Text>}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.action} onPress={() => Linking.openURL('https://waze.com/ul?q=' + encodeURIComponent(t.title))}>
                <Ionicons name="navigate" size={18} color="#4f46e5" />
                <Text style={styles.actionText}>נווט</Text>
              </TouchableOpacity>
              {t.status !== 'in_progress' && (
                <TouchableOpacity style={styles.action} onPress={() => start(t.id)}>
                  <Ionicons name="play" size={18} color="#4f46e5" />
                  <Text style={styles.actionText}>התחל</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.action, styles.actionPrimary]} onPress={() => markDone(t.id)}>
                <Ionicons name="checkmark" size={18} color="white" />
                <Text style={[styles.actionText, { color: 'white' }]}>סיים</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', writingDirection: 'rtl' },
  subtitle: { color: '#64748b', marginTop: 4, marginBottom: 16, writingDirection: 'rtl' },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 40, writingDirection: 'rtl' },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontSize: 14, color: '#4f46e5', fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeHigh: { backgroundColor: '#fee2e2' },
  badgeMed: { backgroundColor: '#fef3c7' },
  badgeLow: { backgroundColor: '#e0e7ff' },
  badgeText: { fontSize: 11, fontWeight: '600', writingDirection: 'rtl' },
  taskTitle: { fontSize: 16, fontWeight: '600', marginTop: 10, writingDirection: 'rtl' },
  inprog: { color: '#b45309', fontSize: 12, marginTop: 2, writingDirection: 'rtl' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  actionPrimary: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  actionText: { color: '#4f46e5', fontWeight: '600', fontSize: 13, writingDirection: 'rtl' },
});
