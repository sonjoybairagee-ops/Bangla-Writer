import { prisma } from '@/lib/prisma';

/**
 * Trial Abuse Detection System
 * Prevents users from creating multiple trial accounts
 */

interface AbuseCheckResult {
  isAbuse: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
  existingAccounts?: number;
}

/**
 * Check if IP address has been used for multiple trials
 */
export async function checkIPAbuse(ipAddress: string): Promise<AbuseCheckResult> {
  if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') {
    return { isAbuse: false, riskLevel: 'low' };
  }

  // Count how many users have this IP in referral/session records
  const [referralCount, sessionCount] = await Promise.all([
    prisma.referral.count({
      where: {
        ipAddress: {
          contains: ipAddress,
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        subscriptions: {
          some: {
            planId: 'free',
            status: 'active',
          },
        },
      },
    }),
  ]);

  const totalAccounts = Math.max(referralCount, sessionCount);

  if (totalAccounts >= 5) {
    return {
      isAbuse: true,
      reason: 'Too many trial accounts from this IP address',
      riskLevel: 'high',
      existingAccounts: totalAccounts,
    };
  } else if (totalAccounts >= 3) {
    return {
      isAbuse: false,
      reason: 'Multiple accounts detected',
      riskLevel: 'medium',
      existingAccounts: totalAccounts,
    };
  }

  return { isAbuse: false, riskLevel: 'low' };
}

/**
 * Check if email is disposable/temporary
 */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'throwaway.email',
    'temp-mail.org',
    'yopmail.com',
    'trashmail.com',
    'getnada.com',
    'maildrop.cc',
    'sharklasers.com',
    'grr.la',
    'spam4.me',
    'tmails.net',
    'mohmal.com',
    'fakeinbox.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

/**
 * Check if email uses plus addressing (gmail+1@gmail.com)
 */
export function detectPlusAddressing(email: string): boolean {
  return email.includes('+');
}

/**
 * Normalize email to detect duplicates
 * gmail+test@gmail.com → gmail@gmail.com
 * g.m.a.i.l@gmail.com → gmail@gmail.com
 */
export function normalizeEmail(email: string): string {
  const [localPart, domain] = email.toLowerCase().split('@');

  // Remove plus addressing
  let normalized = localPart.split('+')[0];

  // For Gmail/Googlemail, remove dots
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    normalized = normalized.replace(/\./g, '');
  }

  return `${normalized}@${domain}`;
}

/**
 * Check if normalized email already exists
 */
export async function checkEmailDuplicate(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);

  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: normalized.split('@')[0],
      },
    },
    select: { email: true },
  });

  // Check if any existing user has the same normalized email
  return users.some((user) => normalizeEmail(user.email) === normalized);
}

/**
 * Comprehensive abuse check
 */
export async function performAbuseCheck(
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<AbuseCheckResult> {
  // Check 1: Disposable email
  if (isDisposableEmail(email)) {
    return {
      isAbuse: true,
      reason: 'Temporary email addresses are not allowed',
      riskLevel: 'high',
    };
  }

  // Check 2: Email duplicate (normalized)
  const hasDuplicate = await checkEmailDuplicate(email);
  if (hasDuplicate) {
    return {
      isAbuse: true,
      reason: 'This email is already registered (detected variant)',
      riskLevel: 'high',
    };
  }

  // Check 3: IP abuse
  const ipCheck = await checkIPAbuse(ipAddress);
  if (ipCheck.isAbuse) {
    return ipCheck;
  }

  // Check 4: Warning for plus addressing (not blocking, just flagging)
  if (detectPlusAddressing(email)) {
    return {
      isAbuse: false,
      reason: 'Plus addressing detected',
      riskLevel: 'medium',
    };
  }

  return {
    isAbuse: false,
    riskLevel: ipCheck.riskLevel,
  };
}

/**
 * Get client IP from Next.js request
 */
export function getClientIP(req: Request): string {
  const headers = req.headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') || // Cloudflare
    '127.0.0.1'
  );
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
  email: string,
  ipAddress: string,
  reason: string,
  riskLevel: 'low' | 'medium' | 'high'
) {
  console.warn('[ABUSE DETECTION]', {
    timestamp: new Date().toISOString(),
    email,
    ipAddress,
    reason,
    riskLevel,
  });

  // You can also store this in database for admin review
  // await prisma.abuseLog.create({ ... })
}
