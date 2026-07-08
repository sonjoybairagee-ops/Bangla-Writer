// Email template wrapper with consistent styling
function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bangla Creator AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✨ Bangla Creator AI</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">AI-Powered Content Creation Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                © ${new Date().getFullYear()} Bangla Creator AI. All rights reserved.
              </p>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 12px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" style="color: #9333ea; text-decoration: none;">Manage Subscription</a> | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #9333ea; text-decoration: none;">Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Welcome email
export function welcomeEmail(name: string, referredBy?: string) {
  const content = `
    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">Welcome to Bangla Creator AI! 🎉</h2>
    <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="color: #475569; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
      Thank you for joining Bangla Creator AI! We're excited to help you create amazing content with the power of AI.
    </p>
    
    ${referredBy ? `
    <div style="background: linear-gradient(135deg, #ddd6fe 0%, #fbcfe8 100%); border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
      <p style="color: #7c3aed; margin: 0; font-size: 14px; font-weight: 600;">🎁 REFERRAL BONUS</p>
      <p style="color: #581c87; margin: 8px 0 0 0; font-size: 16px; font-weight: bold;">
        You've been referred! Get 20% OFF your first paid subscription.
      </p>
    </div>
    ` : ''}
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
      <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px;">🚀 Quick Start Guide</h3>
      <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8;">
        <li>Create your first content with AI Writer</li>
        <li>Generate viral hooks for your content</li>
        <li>Plan your content calendar</li>
        <li>Set up your Brand Brain for consistent messaging</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Go to Dashboard
      </a>
    </div>
    
    <p style="color: #64748b; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6;">
      Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/support" style="color: #9333ea;">support center</a>.
    </p>
  `;
  
  return emailWrapper(content);
}

// Payment confirmation email
export function paymentConfirmationEmail(name: string, planName: string, amount: number, duration: string) {
  const content = `
    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">Payment Confirmed! 🎊</h2>
    <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="color: #475569; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
      Your payment has been successfully processed and your subscription is now active!
    </p>
    
    <div style="background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; border-left: 4px solid #10b981;">
      <h3 style="color: #065f46; margin: 0 0 16px 0; font-size: 18px;">📋 Subscription Details</h3>
      <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 15px;">
        <tr>
          <td style="color: #047857; font-weight: 600;">Plan:</td>
          <td style="color: #065f46; text-align: right;">${planName}</td>
        </tr>
        <tr>
          <td style="color: #047857; font-weight: 600;">Amount:</td>
          <td style="color: #065f46; text-align: right;">৳${amount}</td>
        </tr>
        <tr>
          <td style="color: #047857; font-weight: 600;">Duration:</td>
          <td style="color: #065f46; text-align: right;">${duration}</td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
      <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px;">✨ What's Included:</h3>
      <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8;">
        <li>Unlimited AI-powered content generation</li>
        <li>Advanced copywriting frameworks</li>
        <li>Brand Brain memory system</li>
        <li>Priority support</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Start Creating Content
      </a>
    </div>
    
    <p style="color: #64748b; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6;">
      Your subscription will automatically renew. You can manage or cancel anytime from your billing settings.
    </p>
  `;
  
  return emailWrapper(content);
}

// Referral signup notification (to referrer)
export function referralSignupEmail(referrerName: string, referredUserName: string, totalReferrals: number, paidReferrals: number) {
  const content = `
    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">New Referral Signup! 🎉</h2>
    <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
      Hi ${referrerName},
    </p>
    <p style="color: #475569; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
      Great news! Someone just signed up using your referral link.
    </p>
    
    <div style="background: linear-gradient(135deg, #ddd6fe 0%, #fbcfe8 100%); border-radius: 12px; padding: 24px; margin: 0 0 24px 0; text-align: center;">
      <p style="color: #7c3aed; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">NEW SIGNUP</p>
      <p style="color: #581c87; margin: 0; font-size: 20px; font-weight: bold;">
        ${referredUserName} joined using your link!
      </p>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
      <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px;">📊 Your Referral Stats</h3>
      <div style="display: flex; justify-content: space-around; text-align: center;">
        <div>
          <p style="color: #9333ea; margin: 0; font-size: 32px; font-weight: bold;">${totalReferrals}</p>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Total Signups</p>
        </div>
        <div>
          <p style="color: #10b981; margin: 0; font-size: 32px; font-weight: bold;">${paidReferrals}</p>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Paid Referrals</p>
        </div>
      </div>
    </div>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
      <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
        💡 <strong>Tip:</strong> When your referral subscribes to a paid plan, you'll earn rewards and unlock free months!
      </p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referrals" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        View Referral Dashboard
      </a>
    </div>
  `;
  
  return emailWrapper(content);
}

// Referral reward earned email
export function referralRewardEmail(name: string, rewardType: string, milestone: number) {
  const rewardDetails: Record<string, { emoji: string; title: string; description: string }> = {
    '14_DAYS_FREE': { emoji: '🎯', title: '14 Days Pro Free', description: 'Enjoy 2 weeks of Pro features' },
    '1_MONTH_FREE': { emoji: '🎉', title: '1 Month Pro Free', description: 'Full month of Pro access' },
    '2_MONTHS_FREE': { emoji: '🏆', title: '2 Months Pro + Badge', description: '2 months Pro + Referral Champion badge' },
    'LIFETIME_20_DISCOUNT': { emoji: '⭐', title: 'Lifetime 20% Discount', description: '20% off all future renewals forever' },
    '3_MONTHS_AGENCY': { emoji: '👑', title: '3 Months Agency + Ambassador', description: '3 months Agency plan + Ambassador status' },
  };
  
  const reward = rewardDetails[rewardType] || { emoji: '🎁', title: 'Reward Unlocked', description: 'Congratulations!' };
  
  const content = `
    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">Congratulations! You Earned a Reward! ${reward.emoji}</h2>
    <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="color: #475569; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
      Amazing work! You've reached <strong>${milestone} paid referrals</strong> and unlocked an exclusive reward!
    </p>
    
    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 32px; margin: 0 0 24px 0; text-align: center; border: 3px solid #f59e0b;">
      <div style="font-size: 64px; margin: 0 0 16px 0;">${reward.emoji}</div>
      <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 28px; font-weight: bold;">${reward.title}</h3>
      <p style="color: #b45309; margin: 0; font-size: 16px;">${reward.description}</p>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
      <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 18px;">🎯 Keep Going!</h3>
      <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.6;">
        You're doing amazing! Share your referral link with more creators and unlock even bigger rewards.
      </p>
      
      <div style="margin: 16px 0 0 0; padding: 16px; background-color: #ffffff; border-radius: 8px; border: 2px dashed #e2e8f0;">
        <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">Next Milestone</p>
        <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: bold;">Keep referring to unlock more rewards!</p>
      </div>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referrals" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Share Your Referral Link
      </a>
    </div>
    
    <p style="color: #64748b; margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; text-align: center;">
      Your reward has been automatically applied to your account.
    </p>
  `;
  
  return emailWrapper(content);
}

// Payment received notification (for referred user)
export function firstPaymentDiscountEmail(name: string, discount: number, savedAmount: number) {
  const content = `
    <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">Your Referral Discount Applied! 🎉</h2>
    <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">
      Hi ${name},
    </p>
    <p style="color: #475569; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6;">
      Great news! Your referral discount has been applied to your first payment.
    </p>
    
    <div style="background: linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%); border-radius: 12px; padding: 32px; margin: 0 0 24px 0; text-align: center;">
      <p style="color: #065f46; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">YOU SAVED</p>
      <p style="color: #047857; margin: 0; font-size: 48px; font-weight: bold;">৳${savedAmount}</p>
      <p style="color: #059669; margin: 8px 0 0 0; font-size: 16px;">${discount}% referral discount applied</p>
    </div>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 0 0 24px 0;">
      <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 18px;">🎁 Want to earn rewards too?</h3>
      <p style="color: #475569; margin: 0 0 16px 0; font-size: 15px; line-height: 1.6;">
        Share Bangla Creator AI with your friends and earn free months when they subscribe!
      </p>
      <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
        <li>3 paid referrals → 14 Days Free</li>
        <li>5 paid referrals → 1 Month Free</li>
        <li>10 paid referrals → 2 Months Free + Badge</li>
        <li>25 paid referrals → Lifetime 20% Discount</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referrals" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Get Your Referral Link
      </a>
    </div>
  `;
  
  return emailWrapper(content);
}
