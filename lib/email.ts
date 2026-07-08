import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key_for_build');

// ─── OTP Generator ────────────────────────────────────────────────────────────
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

// ─── Send Verification Email ──────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, otp: string, name?: string) {
  const displayName = name || 'ক্রিয়েটর';

  const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bangla Writer — ভেরিফিকেশন কোড</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f0ff; }
    .wrapper { max-width: 520px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 40px rgba(124,58,237,0.12); }
    .header { background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); padding: 36px 32px; text-align: center; }
    .logo { font-size: 28px; font-weight: 900; color: white; letter-spacing: -0.5px; margin-bottom: 6px; }
    .logo span { opacity: 0.8; font-size: 14px; font-weight: 400; display: block; margin-top: 4px; }
    .body { padding: 36px 32px; }
    .greeting { font-size: 17px; color: #1f2937; font-weight: 600; margin-bottom: 10px; }
    .subtitle { font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 28px; }
    .otp-container { background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%); border: 2px dashed #d8b4fe; border-radius: 20px; padding: 32px 24px; text-align: center; margin-bottom: 28px; }
    .otp-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 16px; }
    .otp-digits { display: inline-flex; gap: 10px; margin-bottom: 16px; }
    .otp-digit { width: 48px; height: 56px; background: white; border: 2px solid #e9d5ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #7c3aed; font-family: 'Courier New', monospace; box-shadow: 0 2px 8px rgba(124,58,237,0.1); }
    .otp-expiry { font-size: 12px; color: #9ca3af; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .otp-expiry::before { content: "⏱️"; }
    .warning-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; }
    .warning-box p { font-size: 12px; color: #92400e; line-height: 1.5; }
    .warning-box strong { color: #78350f; }
    .footer-text { font-size: 13px; color: #9ca3af; line-height: 1.6; }
    .footer { background: #fafafa; border-top: 1px solid #f3f4f6; padding: 20px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; }
    .footer .brand { color: #7c3aed; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">
        ✨ Bangla Writer
        <span>বাংলাদেশি ক্রিয়েটরদের AI প্ল্যাটফর্ম</span>
      </div>
    </div>

    <div class="body">
      <p class="greeting">হ্যালো ${displayName}! 👋</p>
      <p class="subtitle">
        আপনার Bangla Writer অ্যাকাউন্ট প্রায় তৈরি! নিচের <strong>৬-সংখ্যার কোড</strong> দিয়ে আপনার ইমেইল ভেরিফাই করুন।
      </p>

      <div class="otp-container">
        <div class="otp-label">আপনার ভেরিফিকেশন কোড</div>
        <div class="otp-digits">
          ${otp.split('').map(d => `<div class="otp-digit">${d}</div>`).join('')}
        </div>
        <div class="otp-expiry">এই কোড ১০ মিনিটের জন্য বৈধ</div>
      </div>

      <div class="warning-box">
        <p>⚠️ <strong>সতর্কতা:</strong> এই কোড কারো সাথে শেয়ার করবেন না। Bangla Writer-এর কোনো প্রতিনিধি কখনো এই কোড চাইবে না।</p>
      </div>

      <p class="footer-text">
        আপনি যদি এই অ্যাকাউন্ট তৈরির অনুরোধ না করে থাকেন, এই ইমেইলটি উপেক্ষা করুন।
      </p>
    </div>

    <div class="footer">
      <p>© 2026 <span class="brand">Bangla Writer</span> — Made with ❤️ for Bangladeshi Creators</p>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Bangla Writer <noreply@banglawriter.com>',
    to,
    subject: `${otp} — আপনার Bangla Writer ভেরিফিকেশন কোড`,
    html,
  });
}

// ─── Send Password Reset Email ────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, otp: string) {
  const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8" />
  <title>Bangla Writer — পাসওয়ার্ড রিসেট</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #eff6ff; }
    .wrapper { max-width: 520px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 40px rgba(29,78,216,0.10); }
    .header { background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%); padding: 36px 32px; text-align: center; }
    .logo { font-size: 26px; font-weight: 900; color: white; }
    .logo span { opacity: 0.8; font-size: 14px; font-weight: 400; display: block; margin-top: 4px; }
    .body { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 10px; }
    .subtitle { font-size: 14px; color: #6b7280; margin-bottom: 28px; line-height: 1.6; }
    .otp-container { background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 20px; padding: 28px; text-align: center; margin-bottom: 24px; }
    .otp-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px; }
    .otp-digits { display: inline-flex; gap: 10px; margin-bottom: 14px; }
    .otp-digit { width: 48px; height: 56px; background: white; border: 2px solid #bfdbfe; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #1d4ed8; font-family: 'Courier New', monospace; }
    .otp-expiry { font-size: 12px; color: #9ca3af; }
    .footer { background: #fafafa; border-top: 1px solid #f3f4f6; padding: 20px 32px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; }
    .brand { color: #7c3aed; font-weight: 700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">🔐 Bangla Writer<span>পাসওয়ার্ড রিসেট</span></div>
    </div>
    <div class="body">
      <p class="title">পাসওয়ার্ড রিসেট কোড</p>
      <p class="subtitle">আপনার Bangla Writer অ্যাকাউন্টের পাসওয়ার্ড রিসেটের জন্য নিচের কোডটি ব্যবহার করুন।</p>
      <div class="otp-container">
        <div class="otp-label">রিসেট কোড</div>
        <div class="otp-digits">
          ${otp.split('').map(d => `<div class="otp-digit">${d}</div>`).join('')}
        </div>
        <div class="otp-expiry">⏱️ এই কোড ১০ মিনিটের জন্য বৈধ</div>
      </div>
      <p style="font-size:13px;color:#9ca3af;">আপনি যদি পাসওয়ার্ড রিসেটের অনুরোধ না করে থাকেন, এই ইমেইল উপেক্ষা করুন।</p>
    </div>
    <div class="footer">
      <p>© 2026 <span class="brand">Bangla Writer</span></p>
    </div>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Bangla Writer <noreply@banglawriter.com>',
    to,
    subject: `${otp} — Bangla Writer পাসওয়ার্ড রিসেট কোড`,
    html,
  });
}
