'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Search,
  Filter,
  User,
  Mail,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo: {
    name: string;
    email: string;
  } | null;
  messages: Array<{
    id: string;
    message: string;
    isAdminReply: boolean;
    createdAt: string;
    user: {
      name: string;
      role: string;
    };
  }>;
  _count: {
    messages: number;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/support?status=${statusFilter}&priority=${priorityFilter}`
      );
      const data = await res.json();

      if (res.ok) {
        setTickets(data.tickets);
      } else {
        alert(data.error || 'Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      alert('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    setSending(true);
    try {
      const res = await fetch('/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: newMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update selected ticket with new message
        setSelectedTicket({
          ...selectedTicket,
          messages: [...selectedTicket.messages, data.message],
        });
        setNewMessage('');
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          action: 'updateStatus',
          status,
        }),
      });

      if (res.ok) {
        fetchTickets();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status });
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchQuery.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(query) ||
      ticket.user.name?.toLowerCase().includes(query) ||
      ticket.user.email.toLowerCase().includes(query)
    );
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-slate-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <MessageCircle className="w-8 h-8 text-purple-600" />
          Support Tickets
        </h1>
        <p className="text-slate-500 mt-1">Manage and respond to user support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Total</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Open</p>
              <p className="text-3xl font-bold text-slate-900">{stats.open}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">In Progress</p>
              <p className="text-3xl font-bold text-slate-900">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">Resolved</p>
              <p className="text-3xl font-bold text-slate-900">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Content: Ticket List + Chat */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ticket List */}
        <Card className="p-6 border-slate-200 max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Tickets</h2>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No tickets found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 border rounded-lg transition-all ${
                    selectedTicket?.id === ticket.id
                      ? 'border-purple-300 bg-purple-50/50'
                      : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                      {ticket.subject}
                    </p>
                    {getStatusIcon(ticket.status)}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 text-slate-400" />
                    <p className="text-xs text-slate-600">{ticket.user.name}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {ticket._count.messages} messages
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Chat View */}
        <Card className="p-6 border-slate-200 flex flex-col max-h-[600px]">
          {!selectedTicket ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Select a ticket to view details</p>
              </div>
            </div>
          ) : (
            <>
              {/* Ticket Header */}
              <div className="pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      {selectedTicket.subject}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{selectedTicket.user.name}</span>
                      <span>•</span>
                      <Mail className="w-4 h-4" />
                      <span>{selectedTicket.user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                      selectedTicket.priority
                    )}`}
                  >
                    {selectedTicket.priority}
                  </span>
                  <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-full">
                    {selectedTicket.category?.replace('_', ' ')}
                  </span>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                  {selectedTicket.status === 'open' && (
                    <Button
                      onClick={() =>
                        handleUpdateStatus(selectedTicket.id, 'in_progress')
                      }
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Working
                    </Button>
                  )}
                  {selectedTicket.status === 'in_progress' && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Resolved
                    </Button>
                  )}
                  {selectedTicket.status === 'resolved' && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                      size="sm"
                      className="bg-slate-600 hover:bg-slate-700"
                    >
                      Close Ticket
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isAdminReply ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.isAdminReply
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1">
                        {msg.user.name}
                        {msg.user.role === 'admin' && ' (Admin)'}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.isAdminReply ? 'text-purple-200' : 'text-slate-500'
                        }`}
                      >
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              {selectedTicket.status !== 'closed' && (
                <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <Button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
