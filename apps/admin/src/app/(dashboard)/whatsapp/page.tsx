import { ComingSoon } from '@/components/coming-soon';

export default function WhatsappInboxPage() {
  return (
    <ComingSoon
      title="תקשורת — WhatsApp Inbox"
      subtitle="מסך שיחות פעילות, שיוך לנציג, שילוב בוט AI"
      endpoints={[
        'POST /v1/webhooks/whatsapp',
        'POST /v1/whatsapp/messages',
        'POST /v1/ai-bot/respond',
      ]}
    />
  );
}
