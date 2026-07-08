import { prisma } from '@/lib/prisma';
import UsersTable from '@/components/admin/users-table';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  // Fetch all users with their subscriptions
  const users = await prisma.user.findMany({
    include: {
      subscriptions: {
        where: {
          status: 'active',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      _count: {
        select: {
          brands: true,
          scripts: true,
          contentPlans: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-slate-600 mt-1">
          Manage all users, assign plans, and view activity
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
