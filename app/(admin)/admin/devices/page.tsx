'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Ban,
  RefreshCw,
  Search,
  Monitor,
  Users,
  Activity,
  Clock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DeviceFingerprint {
  id: string;
  fingerprint: string;
  firstSeenIp: string;
  firstSeenEmail: string;
  firstSeenAt: string;
  userIds: string[];
  emailAddresses: string[];
  ipAddresses: string[];
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  riskLevel: 'low' | 'medium' | 'high';
  isBlocked: boolean;
  blockedAt: string | null;
  blockedReason: string | null;
  signupCount: number;
  lastSeenAt: string;
}

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<DeviceFingerprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDevices();
  }, [filter]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/devices?filter=${filter}`);
      const data = await res.json();
      
      if (res.ok) {
        setDevices(data.devices);
      } else {
        alert(data.error || 'Failed to fetch devices');
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      alert('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (deviceId: string, shouldBlock: boolean) => {
    if (!confirm(`Are you sure you want to ${shouldBlock ? 'block' : 'unblock'} this device?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/devices/${deviceId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: shouldBlock }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || `Device ${shouldBlock ? 'blocked' : 'unblocked'} successfully`);
        fetchDevices();
      } else {
        alert(data.error || `Failed to ${shouldBlock ? 'block' : 'unblock'} device`);
      }
    } catch (error) {
      console.error('Failed to update device:', error);
      alert('Failed to update device');
    }
  };

  const filteredDevices = devices.filter((device) => {
    const query = searchQuery.toLowerCase();
    return (
      device.fingerprint.toLowerCase().includes(query) ||
      device.firstSeenEmail.toLowerCase().includes(query) ||
      device.emailAddresses.some((email) => email.toLowerCase().includes(query)) ||
      device.ipAddresses.some((ip) => ip.includes(query))
    );
  });

  const stats = {
    total: devices.length,
    low: devices.filter((d) => d.riskLevel === 'low').length,
    medium: devices.filter((d) => d.riskLevel === 'medium').length,
    high: devices.filter((d) => d.riskLevel === 'high').length,
    blocked: devices.filter((d) => d.isBlocked).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Monitor className="w-8 h-8 text-purple-600" />
            Device Fingerprints
          </h1>
          <p className="text-slate-500 mt-1">
            Monitor and manage devices for trial abuse prevention
          </p>
        </div>
        <Button
          onClick={fetchDevices}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase">Total Devices</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Monitor className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium uppercase">Low Risk</p>
              <p className="text-2xl font-bold text-green-900">{stats.low}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium uppercase">Medium Risk</p>
              <p className="text-2xl font-bold text-amber-900">{stats.medium}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600 font-medium uppercase">High Risk</p>
              <p className="text-2xl font-bold text-red-900">{stats.high}</p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-medium uppercase">Blocked</p>
              <p className="text-2xl font-bold text-slate-900">{stats.blocked}</p>
            </div>
            <Ban className="w-8 h-8 text-slate-600" />
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by fingerprint, email, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'low', 'medium', 'high', 'blocked'] as const).map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              className={
                filter === status
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : ''
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Devices List */}
      {filteredDevices.length === 0 ? (
        <Card className="p-12 text-center">
          <Monitor className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">No devices found</p>
          <p className="text-slate-400 text-sm mt-1">
            {searchQuery ? 'Try a different search query' : 'Devices will appear here'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDevices.map((device) => (
            <Card key={device.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-6">
                {/* Device Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          device.isBlocked
                            ? 'bg-slate-200'
                            : device.riskLevel === 'high'
                            ? 'bg-red-100'
                            : device.riskLevel === 'medium'
                            ? 'bg-amber-100'
                            : 'bg-green-100'
                        }`}
                      >
                        {device.isBlocked ? (
                          <Ban className="w-6 h-6 text-slate-600" />
                        ) : device.riskLevel === 'high' ? (
                          <Shield className="w-6 h-6 text-red-600" />
                        ) : device.riskLevel === 'medium' ? (
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-mono font-bold text-slate-900">
                            {device.fingerprint.slice(0, 16)}...
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              device.isBlocked
                                ? 'bg-slate-100 text-slate-700'
                                : device.riskLevel === 'high'
                                ? 'bg-red-100 text-red-700'
                                : device.riskLevel === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {device.isBlocked ? 'BLOCKED' : device.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {device.browser} on {device.os} • {device.device}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-4 h-4" />
                        <span className="text-2xl font-bold">{device.signupCount}</span>
                      </div>
                      <p className="text-xs text-slate-500">Signups</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 rounded-lg p-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Activity className="w-3 h-3" />
                        First Seen
                      </div>
                      <p className="font-semibold text-sm text-slate-900">
                        {formatDate(device.firstSeenAt)}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{device.firstSeenEmail}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Clock className="w-3 h-3" />
                        Last Seen
                      </div>
                      <p className="font-semibold text-sm text-slate-900">
                        {formatDate(device.lastSeenAt)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <Users className="w-3 h-3" />
                        Emails Used
                      </div>
                      <p className="font-semibold text-sm text-slate-900">
                        {device.emailAddresses.length}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {device.emailAddresses[0]}
                      </p>
                    </div>
                  </div>

                  {/* Email & IP Lists */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">All Emails:</p>
                      <div className="space-y-1">
                        {device.emailAddresses.map((email, idx) => (
                          <div key={idx} className="text-xs text-slate-600 font-mono bg-white px-2 py-1 rounded border">
                            {email}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2">All IP Addresses:</p>
                      <div className="space-y-1">
                        {device.ipAddresses.map((ip, idx) => (
                          <div key={idx} className="text-xs text-slate-600 font-mono bg-white px-2 py-1 rounded border">
                            {ip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Blocked Reason */}
                  {device.isBlocked && device.blockedReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-700 mb-1">Blocked Reason:</p>
                      <p className="text-sm text-red-600">{device.blockedReason}</p>
                      {device.blockedAt && (
                        <p className="text-xs text-red-500 mt-1">
                          Blocked on {formatDate(device.blockedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {device.isBlocked ? (
                    <Button
                      onClick={() => handleBlock(device.id, false)}
                      size="sm"
                      variant="outline"
                      className="border-green-300 text-green-600 hover:bg-green-50 gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleBlock(device.id, true)}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 gap-2"
                    >
                      <Ban className="w-4 h-4" />
                      Block
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
