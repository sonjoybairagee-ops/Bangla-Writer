import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Check if the current user is an admin
 * Use this in Server Components and API routes
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

/**
 * Require admin role, throw error if not admin
 * Use this in API routes that require admin access
 */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
}
