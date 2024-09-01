import AWSVerifyEmail from '@/emails';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const verificationCode = generateVerificationCode();

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify Your Email',
      react: AWSVerifyEmail({ verificationCode }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Verification code sent successfully',
      verificationCode // !Remove this in production!
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
