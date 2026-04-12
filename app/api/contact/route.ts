import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, type, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to Supabase leads table
    const { error: dbError } = await supabase.from('leads').insert({
      full_name: fullName,
      email,
      message: `[${type || 'general'}] ${message}`,
      interest_type: type === 'investment' ? 'investment' : 'rental',
    });

    if (dbError) {
      console.error('DB error:', dbError);
    }

    // Try to send email via Resend if API key is available
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const emailBody = {
        from: 'RumahYa Contact <noreply@rumahya.com>',
        to: ['info@rumahya.com'],
        reply_to: email,
        subject: `New contact from ${fullName} — ${type || 'General'}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <div style="background: linear-gradient(135deg, #2563eb, #22c55e); padding: 24px; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">New contact message</h1>
            </div>
            <div style="background: #f9fafb; padding: 28px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb; border-top: none;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 140px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${fullName}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;">Topic</td><td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${type || 'Not specified'}</td></tr>
              </table>
              <div style="margin-top: 24px;">
                <p style="font-weight: 600; color: #374151; margin: 0 0 10px;">Message</p>
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; color: #111827; line-height: 1.7; white-space: pre-wrap;">${message}</div>
              </div>
              <div style="margin-top: 20px; padding: 14px; background: #eff6ff; border-radius: 10px; font-size: 13px; color: #1d4ed8;">
                Reply directly to this email to contact ${fullName}.
              </div>
            </div>
          </div>
        `,
      };

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        // Don't fail — lead is saved in DB
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
