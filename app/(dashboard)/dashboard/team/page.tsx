'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserPlus,
  Mail,
  Crown,
  Shield,
  Pencil,
  Trash2,
  Check,
  X,
  Clock,
  Copy,
  Send,
  AlertCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  canManageTeam: boolean;
  joinedAt: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  sender: {
    name: string;
    email: string;
  };
  createdAt: string;
  expiresAt: string;
}

interface TeamData {
  team: {
    id: string;
    name: string;
    description: string;
    maxMembers: number;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
  members: TeamMember[];
  invitations: TeamInvitation[];
  userRole: string;
  canManage: boolean;
}

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'member',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      // First, get user's team
      const teamsRes = await fetch('/api/team/my-teams');
      const teamsData = await teamsRes.json();

      if (!teamsData.teams || teamsData.teams.length === 0) {
        setLoading(false);
        return;
      }

      const teamId = teamsData.teams[0].id;

      // Fetch team members
      const res = await fetch(`/api/team/members?teamId=${teamId}`);
      const data = await res.json();

      if (res.ok) {
        setTeamData(data);
      } else {
        alert(data.error || 'Failed to fetch team data');
      }
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inviteForm.email || !teamData) {
      setError('Email is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: teamData.team.id,
          email: inviteForm.email,
          role: inviteForm.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Invitation sent successfully!');
        setShowInviteModal(false);
        setInviteForm({ email: '', role: 'member' });
        fetchTeamData(); // Refresh
      } else {
        setError(data.error || 'Failed to send invitation');
      }
    } catch (err) {
      setError('Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the team?`)) {
      return;
    }

    try {
      const res = await fetch(
        `/api/team/members?memberId=${memberId}&teamId=${teamData?.team.id}`,
        { method: 'DELETE' }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Member removed successfully');
        fetchTeamData();
      } else {
        alert(data.error || 'Failed to remove member');
      }
    } catch (error) {
      alert('Failed to remove member');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <Crown className="w-3 h-3" />
            Admin
          </span>
        );
      case 'member':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <Shield className="w-3 h-3" />
            Member
          </span>
        );
      case 'creator':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            <Pencil className="w-3 h-3" />
            Creator
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <Card className="p-12 text-center border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Team Yet</h2>
          <p className="text-slate-500 mb-6">
            Pro or Agency plan required to create and manage teams
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-slate-700 font-semibold mb-2">Team Plans:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Pro Plan: 2 team members
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Agency Plan: 5 team members
              </li>
            </ul>
          </div>
          <Button
            onClick={() => (window.location.href = '/dashboard/billing')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Upgrade to Pro or Agency
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            {teamData.team.name}
          </h1>
          <p className="text-slate-500 mt-1">{teamData.team.description}</p>
        </div>
        {teamData.canManage && (
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-purple-600 hover:bg-purple-700 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Team Members</p>
              <p className="text-3xl font-bold text-slate-900">
                {teamData.members.length} / {teamData.team.maxMembers}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Pending Invites</p>
              <p className="text-3xl font-bold text-slate-900">
                {teamData.invitations.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Your Role</p>
              <p className="text-2xl font-bold text-slate-900 capitalize">
                {teamData.userRole}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Members List */}
      <Card className="p-6 border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-700" />
          Team Members
        </h2>

        <div className="space-y-3">
          {teamData.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {member.name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{member.name || 'User'}</p>
                    {member.userId === teamData.team.owner.id && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{member.email}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Joined {formatDate(member.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getRoleBadge(member.role)}
                {teamData.canManage &&
                  member.userId !== teamData.team.owner.id && (
                    <Button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      size="sm"
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Invitations */}
      {teamData.invitations.length > 0 && (
        <Card className="p-6 border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-slate-700" />
            Pending Invitations
          </h2>

          <div className="space-y-3">
            {teamData.invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{invitation.email}</p>
                    <p className="text-sm text-slate-500">
                      Invited by {invitation.sender.name || invitation.sender.email}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Expires {formatDate(invitation.expiresAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getRoleBadge(invitation.role)}
                  <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-semibold">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Invite Team Member</h2>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Role *
                </label>
                <select
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="admin">Admin - Full team management access</option>
                  <option value="member">Member - Create & manage content</option>
                  <option value="creator">Creator - Content creation only</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
