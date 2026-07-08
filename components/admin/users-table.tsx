'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Crown, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
  Mail,
  Calendar
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
    const badges: Record<string, { variant: any; label: string }> = {
      free: { variant: 'secondary', label: 'Free' },
      starter: { variant: 'info', label: 'Starter' },
      pro: { variant: 'purple', label: 'Pro' },
      agency: { variant: 'warning', label: 'Agency' },
    };

    const badge = badges[planId] || badges.free;
    return (
      <Badge variant={badge.variant}>
        {badge.label}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          {/* Header with Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {filteredUsers.length} users
              </Badge>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const subscription = user.subscriptions[0];
                    const isActive = subscription?.status === 'active';

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-semibold">
                              {(user.name || user.email)?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {user.name || 'No name'}
                                {user.role === 'admin' && (
                                  <Badge variant="warning" className="text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Admin
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {subscription ? (
                            getPlanBadge(subscription.planId)
                          ) : (
                            <Badge variant="outline">No plan</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {isActive ? (
                            <Badge variant="success" leftIcon={<CheckCircle className="h-3 w-3" />}>
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" leftIcon={<XCircle className="h-3 w-3" />}>
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user._count.brands}</span>
                              <span className="text-slate-500">brands</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user._count.scripts}</span>
                              <span className="text-slate-500">scripts</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowAssignModal(true);
                            }}
                            leftIcon={<Edit className="h-3 w-3" />}
                          >
                            Assign Plan
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
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
