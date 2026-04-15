import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, type, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Supabase
    await supabase.from('leads').insert({
      full_name: fullName,
      email,
      message: `[${type || 'general'}] ${message}`,
      interest_type: type === 'investment' ? 'investment' : 'rental',
    });

    // Send via Resend if key is set
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn('RESEND_API_KEY not configured — lead saved to DB only');
      return NextResponse.json({ success: true, emailSent: false });
    }

    const from = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeType = escapeHtml(type || 'Not specified');
    const safeMessage = escapeHtml(message);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `RumahYa <${from}>`,
        to: ['info@rumahya.com'],
        reply_to: email,
        subject: `[RumahYa] New message from ${fullName} — ${type || 'General enquiry'}`,
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f5f5f5;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
<tr><td style="background:linear-gradient(135deg,#2563eb,#22c55e);padding:28px 36px;">
  <p style="margin:0;font-size:22px;font-weight:800;color:#fff;">RumahYa</p>
  <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">New contact message received</p>
</td></tr>
<tr><td style="padding:32px 36px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
    <tr style="background:#f9fafb;"><td style="padding:12px 18px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;width:120px;">Name</td><td style="padding:12px 18px;font-size:15px;color:#111827;font-weight:600;">${safeName}</td></tr>
    <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 18px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;">Email</td><td style="padding:12px 18px;"><a href="mailto:${safeEmail}" style="color:#2563eb;font-size:15px;text-decoration:none;font-weight:600;">${safeEmail}</a></td></tr>
    <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 18px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;">Topic</td><td style="padding:12px 18px;font-size:15px;color:#111827;">${safeType}</td></tr>
  </table>
</td></tr>
<tr><td style="padding:24px 36px 0;">
  <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;">Message</p>
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px 22px;font-size:15px;line-height:1.75;color:#374151;white-space:pre-wrap;">${safeMessage}</div>
</td></tr>
<tr><td style="padding:24px 36px;">
  <a href="mailto:${safeEmail}?subject=Re: Your enquiry to RumahYa" style="display:inline-block;padding:13px 24px;background:#2563eb;color:#fff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;">Reply to ${safeName}</a>
</td></tr>
<tr><td style="padding:20px 36px;border-top:1px solid #e5e7eb;background:#f9fafb;">
  <p style="margin:0;font-size:13px;color:#9ca3af;">Sent via the RumahYa website contact form. Reply to respond to ${safeName}.</p>
</td></tr>
</table></td></tr></table></body></html>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return NextResponse.json({ success: true, emailSent: false });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}