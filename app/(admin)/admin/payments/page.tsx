import { prisma } from '@/lib/prisma';
import PaymentsTable from '@/components/admin/payments-table';

export const dynamic = 'force-dynamic';

export default async function PaymentsPage() {
  // Fetch all payments with user info
  const payments = await prisma.payment.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      subscription: {
        select: {
          planId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 100, // Last 100 payments
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments Management</h1>
          <p className="text-slate-600 mt-1">
            View and verify all payment transactions
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-slate-600">Total Payments</div>
          <div className="text-2xl font-bold">{payments.length}</div>
        </div>
      </div>

      <PaymentsTable payments={payments} />
    </div>
  );
}
