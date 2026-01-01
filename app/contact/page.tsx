'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API / email integration later
    console.log({ type, message });
  };

  return (
    <main className="page">
      {/* INTRO */}
      <section className="section hero hero--compact">
        <div className="container">
          <h1 className="h1">Start with a conversation</h1>
          <p className="lead">
            Whether you plan to live in Lombok or invest long-term,
            we begin by understanding your situation.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="section">
        <div className="container grid grid-2">
          {/* LEFT */}
          <div>
            <h2 className="h2">How can we help?</h2>
            <p className="text">
              This first contact is informal. There is no commitment and no obligation.
              The goal is simply to understand what you are looking for
              and see whether RumahYa can be relevant for you.
            </p>

            <ul className="bullets">
              <li>Long-term rental in Lombok</li>
              <li>Relocation planning</li>
              <li>Land or villa investment</li>
              <li>Property management discussion</li>
            </ul>

            <p className="muted">
              If relevant, next steps are discussed transparently.
            </p>
          </div>

          {/* RIGHT */}
          <form onSubmit={handleSubmit} className="card">
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">I am contacting you about</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="rentals">Living in Lombok (rentals)</option>
                  <option value="investment">Investing in Lombok</option>
                  <option value="other">Other / not sure yet</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  rows={6}
                  placeholder="Briefly describe your situation, timeline, and expectations."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* REASSURANCE */}
      <section className="section section-soft">
        <div className="container">
          <p className="text">
            RumahYa is based in Lombok and works with local partners.
            We do not act as agents pushing transactions.
            Our role is to provide clarity, context and local coordination.
          </p>
        </div>
      </section>
    </main>
  );
}
