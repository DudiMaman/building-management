import { ComingSoon } from '@/components/coming-soon';

export default function PollsPage() {
  return (
    <ComingSoon
      title="סקרים והצבעות"
      subtitle="יצירת סקרים, בקרת הצבעה, תוצאות בזמן אמת, חתימות דיגיטליות"
      endpoints={[
        'GET/POST /v1/polls',
        'POST /v1/polls/:id/vote',
        'POST /v1/polls/:id/close',
      ]}
    />
  );
}
