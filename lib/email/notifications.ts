import { sendEmail } from './resend';
import {
  welcomeEmail,
  paymentConfirmationEmail,
  referralSignupEmail,
  referralRewardEmail,
  firstPaymentDiscountEmail,
} from './templates';

// Send welcome email
export async function sendWelcomeEmail(
  email: string,
  name: string,
  referredBy?: string
) {
  return sendEmail({
    to: email,
    subject: '🎉 Welcome to Bangla Creator AI!',
    html: welcomeEmail(name, referredBy),
  });
}

// Send payment confirmation
export async function sendPaymentConfirmation(
  email: string,
  name: string,
  planName: string,
  amount: number,
  duration: string
) {
  return sendEmail({
    to: email,
    subject: '✅ Payment Confirmed - Bangla Creator AI',
    html: paymentConfirmationEmail(name, planName, amount, duration),
  });
}

// Send referral signup notification (to referrer)
export async function sendReferralSignupNotification(
  referrerEmail: string,
  referrerName: string,
  referredUserName: string,
  totalReferrals: number,
  paidReferrals: number
) {
  return sendEmail({
    to: referrerEmail,
    subject: '🎉 New Referral Signup!',
    html: referralSignupEmail(referrerName, referredUserName, totalReferrals, paidReferrals),
  });
}

// Send referral reward notification
export async function sendReferralRewardNotification(
  email: string,
  name: string,
  rewardType: string,
  milestone: number
) {
  return sendEmail({
    to: email,
    subject: '🎁 Congratulations! You Earned a Reward!',
    html: referralRewardEmail(name, rewardType, milestone),
  });
}

// Send first payment discount notification
export async function sendFirstPaymentDiscount(
  email: string,
  name: string,
  discount: number,
  savedAmount: number
) {
  return sendEmail({
    to: email,
    subject: '💰 Your Referral Discount Applied!',
    html: firstPaymentDiscountEmail(name, discount, savedAmount),
  });
}
