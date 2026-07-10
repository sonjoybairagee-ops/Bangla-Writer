/**
 * Abuse Detection System (Admin Review Mode)
 * Detects suspicious activity but doesn't block - admin reviews and decides
 */

import { prisma } from '@/lib/prisma';

export interface AbuseCheckResult {
  isRisky: boolean; // Changed from isAbuse
  riskLevel: 'low' | 'medium' | 'high';
  reason?: string;
  flags: string[]; // List of detected issues
  metadata?: {
    ipAddress?: string;
    deviceFingerprint?: string;
    emailDomain?: string;
    similarAccounts?: number;
  };
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
 * Normalize email to detect duplicates
 */
export function normalizeEmail(email: string): string {
  const [localPart, domain] = email.toLowerCase().split('@');
  let normalized = localPart.split('+')[0];

  // For Gmail/Googlemail, remove dots
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    normalized = normalized.replace(/\./g, '');
  }

  return `${normalized}@${domain}`;
}

/**
 * Check for similar accounts (normalized email)
 */
export async function checkSimilarAccounts(email: string): Promise<number> {
  const normalized = normalizeEmail(email);

  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: normalized.split('@')[0],
      },
    },
    select: { email: true },
  });

  return users.filter((user) => normalizeEmail(user.email) === normalized).length;
}

/**
 * Check IP address for multiple signups
 */
export async function checkIPAbuse(ipAddress: string): Promise<number> {
  if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') {
    return 0;
  }

  // Count users with this IP in last 30 days
  const count = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return count;
}

/**
 * Comprehensive abuse check - LOGS but doesn't block
 */
export async function performAbuseCheck(
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<AbuseCheckResult> {
  const flags: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Check 1: Disposable email
  if (isDisposableEmail(email)) {
    flags.push('disposable_email');
    riskLevel = 'high';
  }

  // Check 2: Similar accounts (email variants)
  const similarCount = await checkSimilarAccounts(email);
  if (similarCount > 0) {
    flags.push(`similar_accounts:${similarCount}`);
    if (similarCount >= 3) {
      riskLevel = 'high';
    } else if (similarCount >= 2) {
      riskLevel = 'medium';
    }
  }

  // Check 3: Plus addressing
  if (email.includes('+')) {
    flags.push('plus_addressing');
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  // Check 4: IP abuse
  const ipSignups = await checkIPAbuse(ipAddress);
  if (ipSignups >= 5) {
    flags.push(`multiple_signups_from_ip:${ipSignups}`);
    riskLevel = 'high';
  } else if (ipSignups >= 3) {
    flags.push(`multiple_signups_from_ip:${ipSignups}`);
    if (riskLevel === 'low') riskLevel = 'medium';
  }

  // Build reason string
  let reason = '';
  if (flags.length > 0) {
    reason = flags.join(', ');
  }

  return {
    isRisky: flags.length > 0,
    riskLevel,
    reason,
    flags,
    metadata: {
      ipAddress,
      emailDomain: email.split('@')[1],
      similarAccounts: similarCount,
    },
  };
}

/**
 * Log flagged signup to database for admin review
 */
export async function logFlaggedSignup(
  userId: string,
  email: string,
  ipAddress: string,
  checkResult: AbuseCheckResult
) {
  try {
    await prisma.flaggedSignup.create({
      data: {
        userId,
        email,
        ipAddress,
        riskLevel: checkResult.riskLevel,
        flags: checkResult.flags,
        reason: checkResult.reason || '',
        metadata: checkResult.metadata || {},
        status: 'pending', // Admin will review
      },
    });
  } catch (error) {
    console.error('Failed to log flagged signup:', error);
  }
}

/**
 * Get client IP from Next.js request
 */
export function getClientIP(req: Request): string {
  const headers = req.headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}
