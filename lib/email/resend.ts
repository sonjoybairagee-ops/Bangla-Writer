import { Resend } from 'resend';

// Initialize Resend
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@banglawriter.com';
const FROM_NAME = 'Bangla Creator AI';

// Send email helper
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const data = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    });

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}
