'use client';

import Link from 'next/link';
import { useState } from 'react';

const WA = '6287873487940';

export default function AboutPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, type, message }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setFullName(''); setEmail(''); setType(''); setMessage('');
    } catch { setStatus('error'); }
  };

  return (
    <main className="page">

      <section className="section hero">
        <div className="container">
          <h1 className="h1 hero-headline">
            A local point of contact for long-term living and investment in Lombok
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="lead">
            RumahYa supports expatriates and investors by providing local context,
            verified information, and long-term coordination for property projects in Lombok.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Live in Lombok</h2>
              <p className="text">Long-term rentals for people who want to live in Lombok without committing blindly or sending large upfront payments without local support.</p>
              <ul className="bullets">
                <li>Rental terms from 1 month to 10 years</li>
                <li>Identified owners</li>
                <li>Local intermediary coordination</li>
              </ul>
              <Link href="/rentals" className="btn btn-primary">Browse rentals</Link>
            </div>
          </div>
          <div className="card path-card">
            <div className="card-body">
              <h2 className="h2">Invest in Lombok</h2>
              <p className="text">Land and villa opportunities for long-term investors looking for clarity, structure and local execution.</p>
              <ul className="bullets">
                <li>Land and villa investment opportunities</li>
                <li>Legal verification available</li>
                <li>Optional property management</li>
              </ul>
              <Link href="/investments" className="btn btn-primary">Browse investments</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <h2 className="h2">Why RumahYa</h2>
          <div className="grid grid-2">
            <ul className="bullets">
              <li>Based in Lombok</li>
              <li>On-the-ground presence</li>
              <li>Clear and direct communication</li>
            </ul>
            <ul className="bullets">
              <li>Verified documents</li>
              <li>Long-term relationship focus</li>
              <li>Human-scale approach</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:56, alignItems:'start' }}>

            <div>
              <p style={{ fontSize:12, fontWeight:800, letterSpacing:'0.13em', textTransform:'uppercase', color:'#2563eb', margin:'0 0 12px' }}>Get in touch</p>
              <h2 className="h2" style={{ marginBottom:14 }}>Let's talk about your project</h2>
              <p className="text">No commitment, no pressure. We begin by understanding your situation and objectives.</p>

              <div style={{ display:'flex', flexDirection:'column', gap:10, margin:'24px 0 32px' }}>
                {[['🏠','Long-term rental in Lombok'],['🌍','Relocation planning'],['💰','Land or villa investment'],['🏢','Property management']].map(([icon,label])=>(
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 18px', background:'#f9fafb', borderRadius:10, border:'1px solid #e5e7eb' }}>
                    <span style={{ fontSize:20 }}>{icon}</span>
                    <span style={{ fontSize:15, fontWeight:600, color:'#374151' }}>{label}</span>
                  </div>
                ))}
              </div>

              <div style={{ background:'#f0fdf4', border:'2px solid #bbf7d0', borderRadius:14, padding:'22px 24px' }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#065f46', margin:'0 0 14px' }}>Prefer to chat directly?</p>
                <a href={`https://wa.me/${WA}?text=${encodeURIComponent('Hello RumahYa, I would like more information.')}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'12px 20px', background:'#25d366', color:'#fff', borderRadius:10, textDecoration:'none', fontWeight:700, fontSize:15 }}>
                  💬 WhatsApp us now
                </a>
                <p style={{ margin:'10px 0 0', fontSize:13, color:'#6b7280' }}>+62 878 7348 7940</p>
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:18, padding:36, boxShadow:'0 8px 32px rgba(15,23,42,0.08)', border:'1px solid #e5e7eb' }}>
              {status === 'sent' ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:'44px 20px', textAlign:'center' }}>
                  <div style={{ width:60, height:60, background:'linear-gradient(135deg,#2563eb,#22c55e)', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800 }}>✓</div>
                  <h3 style={{ fontSize:22, fontWeight:800, color:'#111827', margin:0 }}>Message sent!</h3>
                  <p style={{ fontSize:16, color:'#6b7280', margin:0 }}>We have received your message and will get back to you shortly.</p>
                  <button onClick={()=>setStatus('idle')} style={{ padding:'11px 22px', background:'#f3f4f6', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', color:'#374151' }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  <h3 style={{ fontSize:20, fontWeight:800, color:'#111827', margin:'0 0 4px' }}>Send us a message</h3>
                  {status==='error' && <div style={{ padding:'13px 16px', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:8, color:'#b91c1c', fontSize:14 }}>Something went wrong. Try WhatsApp or email info@rumahya.com</div>}
                  {[['Full name *','text',fullName,setFullName,'Your name'],['Email address *','email',email,setEmail,'your@email.com']].map(([label,t,val,setter,ph])=>(
                    <div key={label as string} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      <label style={{ fontSize:14, fontWeight:700, color:'#374151' }}>{label as string}</label>
                      <input type={t as string} value={val as string} onChange={e=>(setter as any)(e.target.value)} placeholder={ph as string} required
                        style={{ padding:'12px 15px', borderRadius:10, border:'2px solid #e5e7eb', fontSize:15, outline:'none', fontFamily:'inherit' }} />
                    </div>
                  ))}
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ fontSize:14, fontWeight:700, color:'#374151' }}>Topic *</label>
                    <select value={type} onChange={e=>setType(e.target.value)} required style={{ padding:'12px 15px', borderRadius:10, border:'2px solid #e5e7eb', fontSize:15, outline:'none', background:'#fff', fontFamily:'inherit' }}>
                      <option value="">Select a topic</option>
                      <option value="rentals">Living in Lombok (rentals)</option>
                      <option value="investment">Investing in Lombok</option>
                      <option value="other">Other / not sure yet</option>
                    </select>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={{ fontSize:14, fontWeight:700, color:'#374151' }}>Message *</label>
                    <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} placeholder="Briefly describe your situation, timeline, and expectations." required
                      style={{ padding:'12px 15px', borderRadius:10, border:'2px solid #e5e7eb', fontSize:15, resize:'vertical', outline:'none', fontFamily:'inherit', lineHeight:1.6 }} />
                  </div>
                  <button type="submit" disabled={status==='sending'}
                    style={{ padding:'14px 22px', background:'linear-gradient(135deg,#2563eb,#22c55e)', color:'#fff', border:'none', borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(37,99,235,0.28)' }}>
                    {status==='sending' ? 'Sending…' : 'Send message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <p className="text" style={{ textAlign:'center', maxWidth:640, margin:'0 auto' }}>
            RumahYa is based in Lombok and works with local partners. We do not act as agents pushing transactions. Our role is to provide clarity, context and local coordination.
          </p>
        </div>
      </section>

    </main>
  );
}