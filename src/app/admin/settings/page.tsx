'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, Upload, X, Shield, AlertTriangle, Power } from 'lucide-react';

interface SiteSettings {
  siteName: string;
  siteNameAccent: string;
  logoUrl?: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Red',
    siteNameAccent: 'Line',
    logoUrl: '',
    maintenanceMode: false,
    maintenanceMessage: 'Site şu anda bakım modundadır. Lütfen daha sonra tekrar deneyin.',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings({
          siteName: data.siteName || 'Red',
          siteNameAccent: data.siteNameAccent || 'Line',
          logoUrl: data.logoUrl || '',
          maintenanceMode: data.maintenanceMode || false,
          maintenanceMessage: data.maintenanceMessage || 'Site şu anda bakım modundadır. Lütfen daha sonra tekrar deneyin.',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setSettings({ ...settings, logoUrl: data.url });
    } catch (err) {
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save');
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="card space-y-6">
        <h2 className="text-lg font-bold border-b pb-2">Branding</h2>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-bold mb-2">Site Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {settings.logoUrl ? (
              <div className="relative inline-block">
                <Image
                  src={settings.logoUrl}
                  alt="Site Logo"
                  width={100}
                  height={100}
                  className="rounded object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, logoUrl: '' })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <span className="text-gray-500">
                  {uploadingLogo ? 'Uploading...' : 'Click to upload logo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploadingLogo}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            If no logo is uploaded, the default shield icon will be used
          </p>
        </div>

        {/* Site Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="siteName" className="block text-sm font-bold mb-2">
              Site Name (First Part)
            </label>
            <input
              id="siteName"
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="input-field"
              placeholder="Red"
            />
          </div>
          <div>
            <label htmlFor="siteNameAccent" className="block text-sm font-bold mb-2">
              Site Name (Accent Part)
            </label>
            <input
              id="siteNameAccent"
              type="text"
              value={settings.siteNameAccent}
              onChange={(e) => setSettings({ ...settings, siteNameAccent: e.target.value })}
              className="input-field"
              placeholder="Line"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-bold mb-2">Preview</label>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <Image
                  src={settings.logoUrl}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <Shield className="w-12 h-12 text-cyber-red" />
              )}
              <span className="text-4xl font-black tracking-tight text-white">
                {settings.siteName}<span className="text-cyber-red">{settings.siteNameAccent}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="card space-y-6">
        <h2 className="text-lg font-bold border-b pb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Maintenance Mode
        </h2>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-bold">Site Status</h3>
            <p className="text-sm text-gray-500">
              {settings.maintenanceMode 
                ? 'Site is currently in maintenance mode. Visitors cannot access the site.' 
                : 'Site is active and accessible to all visitors.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
              settings.maintenanceMode
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            {settings.maintenanceMode ? 'Activate Site' : 'Enable Maintenance'}
          </button>
        </div>

        {settings.maintenanceMode && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Warning: Maintenance mode is ON. Visitors will see the maintenance message instead of the site.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="maintenanceMessage" className="block text-sm font-bold mb-2">
            Maintenance Message
          </label>
          <textarea
            id="maintenanceMessage"
            value={settings.maintenanceMessage}
            onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
            className="input-field min-h-[100px]"
            placeholder="Enter the message to show visitors during maintenance..."
          />
          <p className="text-sm text-gray-500 mt-1">
            This message will be displayed to visitors when maintenance mode is enabled.
          </p>
        </div>
      </div>
    </div>
  );
}
