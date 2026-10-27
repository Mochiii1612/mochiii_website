import { useState, type FormEvent } from 'react';
import { WAITLIST_ENDPOINT } from '../site.config';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!WAITLIST_ENDPOINT) {
      setStatus('error');
      setMessage("The waitlist isn't connected yet.");
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('done');
      setMessage("You're on the list.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <section className="waitlist container" aria-labelledby="waitlist-title">
      <h3 id="waitlist-title">Be the first to know when we release new products</h3>
      <p>Join the waitlist for early access.</p>
      <form className="waitlist-form" onSubmit={onSubmit}>
        <input
          type="email"
          required
          placeholder="Email address"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <div className="waitlist-msg" role="status">
          {message}
        </div>
      )}
    </section>
  );
}
