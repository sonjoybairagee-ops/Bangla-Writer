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

  // Check if user is authenticated and is admin
  if (!session?.user?.email) {
    redirect('/login');
  }

  // Check if user has admin role (you need to fetch from database)
  // For now, we'll allow all authenticated users to access admin
  // TODO: Add proper role checking from database

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
