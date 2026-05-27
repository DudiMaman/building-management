import { ComingSoon } from '@/components/coming-soon';

export default function AiBotPage() {
  return (
    <ComingSoon
      title="בוט AI"
      subtitle="עריכת system prompt, הפעלת כלים, RAG knowledge base, sandbox chat"
      endpoints={[
        'POST /v1/ai-bot/respond',
        '(בעבודה) GET/PUT /v1/ai-bot/config',
        '(בעבודה) POST /v1/ai-bot/kb/upload',
      ]}
    />
  );
}
