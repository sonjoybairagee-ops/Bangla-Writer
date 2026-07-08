'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Key,
  DollarSign,
  Globe
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async (section: string) => {
    setLoading(true);
    setSuccess('');
    
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      setSuccess(`${section} settings saved successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-slate-600 mt-1">
          Configure and manage your platform settings
        </p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic platform configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform Name</label>
              <Input defaultValue="Bangla Creator" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Support Email</label>
              <Input type="email" defaultValue="support@banglacreator.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Email</label>
              <Input type="email" defaultValue="admin@banglacreator.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Zone</label>
              <Input defaultValue="Asia/Dhaka" />
            </div>
          </div>
          <Button onClick={() => handleSave('General')} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Gateway Settings
          </CardTitle>
          <CardDescription>
            Configure payment gateways and pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-3">Paddle (International)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vendor ID</label>
                  <Input placeholder="Enter Paddle Vendor ID" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input type="password" placeholder="Enter Paddle API Key" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium mb-3">SSLCommerz (Bangladesh)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store ID</label>
                  <Input placeholder="Enter Store ID" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Store Password</label>
                  <Input type="password" placeholder="Enter Store Password" />
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => handleSave('Payment')} disabled={loading}>
            {loading ? 'Saving...' : 'Save Payment Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Configure email notifications and SMTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Host</label>
              <Input placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Port</label>
              <Input placeholder="587" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Username</label>
              <Input placeholder="your-email@gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SMTP Password</label>
              <Input type="password" placeholder="App Password" />
            </div>
          </div>
          <Button onClick={() => handleSave('Email')} disabled={loading}>
            {loading ? 'Saving...' : 'Save Email Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Access
          </CardTitle>
          <CardDescription>
            Manage security and access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-slate-600">
                  Require 2FA for admin accounts
                </div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium">Login Rate Limiting</div>
                <div className="text-sm text-slate-600">
                  Prevent brute force attacks
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium">API Rate Limiting</div>
                <div className="text-sm text-slate-600">
                  Control API usage per user
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure admin notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="font-medium">New User Signups</div>
              <div className="text-sm text-slate-600">
                Get notified when users register
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="font-medium">Payment Received</div>
              <div className="text-sm text-slate-600">
                Get notified of successful payments
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="font-medium">Subscription Changes</div>
              <div className="text-sm text-slate-600">
                Get notified of plan upgrades/downgrades
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <div className="font-medium">System Errors</div>
              <div className="text-sm text-slate-600">
                Get notified of critical errors
              </div>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <Button onClick={() => handleSave('Notifications')} disabled={loading}>
            {loading ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database & Backup
          </CardTitle>
          <CardDescription>
            Database management and backup configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium">Database Status</div>
                <div className="text-sm text-green-600">Connected</div>
              </div>
              <Button variant="outline" size="sm">Test Connection</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium">Last Backup</div>
                <div className="text-sm text-slate-600">
                  {new Date().toLocaleDateString()} at{' '}
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <Button variant="outline" size="sm">Backup Now</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium">Auto Backup</div>
                <div className="text-sm text-slate-600">
                  Daily at 2:00 AM
                </div>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys & Integrations
          </CardTitle>
          <CardDescription>
            Manage API keys and third-party integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input type="password" defaultValue="sk-..." />
            <p className="text-xs text-slate-500">
              Used for AI content generation
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Google OAuth Client ID</label>
            <Input placeholder="Your Google Client ID" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Google OAuth Client Secret</label>
            <Input type="password" placeholder="Your Google Client Secret" />
          </div>
          <Button onClick={() => handleSave('API Keys')} disabled={loading}>
            {loading ? 'Saving...' : 'Save API Keys'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
