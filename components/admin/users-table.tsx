'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Crown, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import AssignPlanModal from './assign-plan-modal';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  subscriptions: Array<{
    id: string;
    planId: string;
    status: string;
    currentPeriodEnd: Date;
  }>;
  _count: {
    brands: number;
    scripts: number;
    contentPlans: number;
  };
}

export default function UsersTable({ users }: { users: User[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanBadge = (planId: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      free: { color: 'bg-slate-100 text-slate-700', label: 'Free' },
      starter: { color: 'bg-blue-100 text-blue-700', label: 'Starter' },
      pro: { color: 'bg-purple-100 text-purple-700', label: 'Pro' },
      agency: { color: 'bg-amber-100 text-amber-700', label: 'Agency' },
    };

    const badge = badges[planId] || badges.free;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-slate-600">
              {filteredUsers.length} users
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    Plan
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    Activity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                    Joined
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const subscription = user.subscriptions[0];
                  const isActive = subscription?.status === 'active';

                  return (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {user.name || 'No name'}
                            {user.role === 'admin' && (
                              <Crown className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {subscription ? (
                          getPlanBadge(subscription.planId)
                        ) : (
                          <span className="text-sm text-slate-500">No plan</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {isActive ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">Inactive</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-slate-600">
                          <div>{user._count.brands} brands</div>
                          <div>{user._count.scripts} scripts</div>
                          <div>{user._count.contentPlans} plans</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowAssignModal(true);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Assign Plan
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No users found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Plan Modal */}
      {selectedUser && (
        <AssignPlanModal
          user={selectedUser}
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
