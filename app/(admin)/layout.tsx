import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminNav from '@/components/admin/admin-nav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated
  if (!session?.user?.email) {
    redirect('/login?error=unauthorized');
  }

  // Check if user has admin role
  if (session.user.role !== 'admin') {
    // Redirect to dashboard if not admin
    redirect('/dashboard?error=admin_access_denied');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
