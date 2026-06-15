import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApi } from '../lib/api';

interface Home {
  building_name: string | null;
  apartment_unit: string | null;
  outstanding: string;
  open_charges: number;
  open_tickets: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: home, loading } = useApi<Home>('/me/home');

  async function openGate() {
    try {
      Alert.alert('השער נפתח', 'הכניסה הותרה.');
    } catch (e) {
      Alert.alert('שגיאה', 'פתיחת השער נכשלה. נסו שוב.');
    }
  }

  const outstanding = Number(home?.outstanding ?? 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>שלום</Text>
      <Text style={styles.subtitle}>
        {loading
          ? 'טוען…'
          : `${home?.building_name ?? 'הבניין שלי'}${home?.apartment_unit ? `, דירה ${home.apartment_unit}` : ''}`}
      </Text>

      <TouchableOpacity style={styles.gateButton} onPress={openGate} activeOpacity={0.8}>
        <Ionicons name="car" size={32} color="white" />
        <Text style={styles.gateButtonText}>פתח שער חניה</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>חיובים פתוחים</Text>
        {outstanding > 0 ? (
          <>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>יתרה לתשלום ({home?.open_charges})</Text>
              <Text style={styles.amount}>₪{outstanding.toLocaleString('he-IL')}</Text>
            </View>
            <TouchableOpacity style={styles.payButton} onPress={() => router.push('/(tabs)/charges')}>
              <Text style={styles.payButtonText}>למסך התשלומים</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.empty}>{loading ? 'טוען…' : 'אין חיובים פתוחים 🎉'}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>פניות פתוחות</Text>
        <Text style={styles.empty}>
          {(home?.open_tickets ?? 0) > 0 ? `${home?.open_tickets} פניות פתוחות` : 'אין פניות פתוחות'}
        </Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/ticket-new')}>
          <Ionicons name="add" size={20} color="#4f46e5" />
          <Text style={styles.secondaryButtonText}>דווח על תקלה</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  greeting: { fontSize: 28, fontWeight: '700', color: '#0f172a', writingDirection: 'rtl' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, writingDirection: 'rtl' },
  gateButton: {
    marginTop: 24, backgroundColor: '#4f46e5', borderRadius: 20, padding: 24,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 12,
    shadowColor: '#4f46e5', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  gateButtonText: { color: 'white', fontSize: 18, fontWeight: '600', writingDirection: 'rtl' },
  card: { marginTop: 20, backgroundColor: 'white', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a', writingDirection: 'rtl' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  itemTitle: { color: '#334155', writingDirection: 'rtl' },
  amount: { fontWeight: '700', fontSize: 18, color: '#0f172a' },
  payButton: { marginTop: 12, backgroundColor: '#4f46e5', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  payButtonText: { color: 'white', fontWeight: '600', writingDirection: 'rtl' },
  secondaryButton: {
    marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 10, paddingVertical: 10,
  },
  secondaryButtonText: { color: '#4f46e5', fontWeight: '600', writingDirection: 'rtl' },
  empty: { color: '#94a3b8', marginTop: 8, writingDirection: 'rtl' },
});
