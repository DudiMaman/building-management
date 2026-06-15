import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useApi } from '../lib/api';

interface Home { building_id: string | null }
interface Post {
  id: string;
  title: string;
  body_md: string | null;
  pinned: boolean;
  pinned_until: string | null;
  published_at: string | null;
}

export default function BulletinScreen() {
  const { data: home } = useApi<Home>('/me/home');
  const buildingId = home?.building_id ?? null;
  const { data: posts, loading } = useApi<Post[]>(buildingId ? `/bulletin?building_id=${buildingId}` : null);

  const isPinned = (p: Post) => p.pinned && (!p.pinned_until || new Date(p.pinned_until) > new Date());

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>לוח מודעות</Text>
      {loading && <Text style={styles.meta}>טוען…</Text>}
      {!loading && (posts ?? []).length === 0 && <Text style={styles.meta}>אין הודעות.</Text>}
      {(posts ?? []).map((p) => (
        <View key={p.id} style={styles.card}>
          {isPinned(p) && (
            <View style={styles.pin}><Text style={styles.pinText}>📌 נעוץ</Text></View>
          )}
          <Text style={styles.postTitle}>{p.title}</Text>
          {p.body_md && <Text style={styles.postBody}>{p.body_md}</Text>}
          {p.published_at && (
            <Text style={styles.meta}>{new Date(p.published_at).toLocaleDateString('he-IL')}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', writingDirection: 'rtl', marginBottom: 12 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  pin: { alignSelf: 'flex-start', backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginBottom: 8 },
  pinText: { fontSize: 11, color: '#92400e', writingDirection: 'rtl' },
  postTitle: { fontWeight: '700', fontSize: 16, writingDirection: 'rtl' },
  postBody: { marginTop: 6, color: '#334155', writingDirection: 'rtl' },
  meta: { marginTop: 8, color: '#94a3b8', fontSize: 12, writingDirection: 'rtl' },
});
