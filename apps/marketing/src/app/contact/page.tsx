'use client';
import { useState, type FormEvent } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, message }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body.slice(0, 200) || 'שליחה נכשלה');
      }
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold md:text-5xl">דברו איתנו</h1>
                <p className="mt-4 text-slate-600">
                  רוצים הדגמה? יש שאלה? מחפשים שותפות? נחזור אליכם בתוך 24 שעות.
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-slate-500">אימייל</div>
                      <a href="mailto:hello@building-management.co.il" className="font-semibold hover:text-primary">
                        hello@building-management.co.il
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-slate-500">טלפון</div>
                      <a href="tel:+97231234567" className="font-semibold hover:text-primary">
                        03-1234567
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-slate-500">WhatsApp</div>
                      <a href="https://wa.me/972501234567" className="font-semibold hover:text-primary">
                        050-1234567
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-slate-500">משרד</div>
                      <div className="font-semibold">תל אביב-יפו, ישראל</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  {done ? (
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
                        ✓
                      </div>
                      <h3 className="mt-4 text-2xl font-bold">תודה!</h3>
                      <p className="mt-2 text-slate-600">קיבלנו את ההודעה ונחזור אליכם בקרוב.</p>
                    </div>
                  ) : (
                    <form onSubmit={submit} className="space-y-4">
                      <h2 className="text-xl font-bold">השאירו פרטים</h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          required
                          type="text"
                          placeholder="שם מלא"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
                        />
                        <input
                          required
                          type="email"
                          placeholder="אימייל"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
                        />
                        <input
                          type="tel"
                          placeholder="טלפון"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
                        />
                        <input
                          type="text"
                          placeholder="שם החברה"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
                        />
                      </div>
                      <textarea
                        rows={4}
                        placeholder="במה נוכל לעזור?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-right outline-none focus:border-primary"
                      />
                      {error && <p className="text-sm text-red-600">{error}</p>}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-700 disabled:opacity-60"
                      >
                        {loading ? 'שולח...' : 'שליחה'}
                      </button>
                      <p className="text-center text-xs text-slate-500">
                        בשליחה אתם מאשרים את <a href="/legal/privacy" className="text-primary hover:underline">מדיניות הפרטיות</a> שלנו.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
