import { ComingSoon } from '@/components/coming-soon';

export default function NotificationsPage() {
  return (
    <ComingSoon
      title="התראות"
      subtitle="ניהול טמפלייטים, ערוצי שליחה, דוחות מסירה ו-DND"
      endpoints={[
        'POST /v1/notifications/send',
        'GET /v1/notifications/templates',
      ]}
    />
  );
}
