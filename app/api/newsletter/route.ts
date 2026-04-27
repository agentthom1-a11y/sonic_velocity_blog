import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // 1. Send Welcome Email
    const { data, error } = await resend.emails.send({
      from: 'Sonic Velocity <insider@sonicvelocitymusic.com>',
      to: [email],
      subject: 'Signal Established: Welcome to the Sonic Velocity Network',
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; background-color: #000; color: #fff; padding: 40px; line-height: 1.6;">
          <h1 style="text-transform: uppercase; letter-spacing: 5px; border-bottom: 2px solid #fff; padding-bottom: 10px;">SIGNAL_ESTABLISHED</h1>
          <p style="font-size: 14px; margin-top: 30px;">
            Operator, your connection to the <strong>Sonic Velocity Network</strong> has been verified.
          </p>
          <p style="font-size: 14px;">
            You are now synced to our weekly transmissions on the frontier of AI audio synthesis, neural remix culture, and regional sound engineering.
          </p>
          <div style="background-color: #111; border: 1px solid #333; padding: 20px; margin-top: 40px;">
            <p style="font-size: 12px; color: #888; margin: 0;">ACCESS_LEVEL: INSIDER</p>
            <p style="font-size: 12px; color: #888; margin: 0;">STATUS: SYNCED</p>
          </div>
          <p style="font-size: 10px; color: #444; margin-top: 50px; text-transform: uppercase;">
            Sonic Velocity Systems © 2024 // Zero Noise // Fully Encrypted
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Subscription error:', err);
    return NextResponse.json(
      { error: 'Failed to process subscription.' },
      { status: 500 }
    );
  }
}
