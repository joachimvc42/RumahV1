'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: Form submission logic has been stubbed.
    // In production, implement an API route to handle form submissions
    // (e.g., send email via SendGrid, store in database, etc.)
    console.log('Form submitted:', formData);
    setSent(true);
  };

  return (
    <div className="container">
      <div className="section-header">
        <h1 className="section-title">Contact</h1>
        <p className="section-subtitle">
          Tell us what you&apos;re looking for and we&apos;ll get back to you with options or next steps.
        </p>
      </div>

      {sent && (
        <div className="section-block" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h2>Thank you!</h2>
          <p>
            We&apos;ve received your message. We&apos;ll get back to you as soon as possible.
          </p>
        </div>
      )}

      <div className="section-block">
        <h2>Send us a message</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label htmlFor="c-name" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Name</label><br />
              <input
                id="c-name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}
              />
            </div>
            <div>
              <label htmlFor="c-email" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email</label><br />
              <input
                id="c-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label htmlFor="c-message" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Message</label><br />
            <textarea
              id="c-message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}
            ></textarea>
          </div>
          <button className="button" type="submit" style={{ marginTop: '12px' }}>Send message</button>
        </form>
      </div>

      <div className="section-block">
        <h2>Other ways to reach us</h2>
        <p><strong>WhatsApp:</strong> +62 812 3456 7890</p>
        <p><strong>Email:</strong> info@rumahya.com</p>
        <p><strong>Location:</strong> Kuta, Lombok – Indonesia</p>
      </div>
    </div>
  );
}

