'use client';

import { Shield, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MaintenancePage() {
  const [message, setMessage] = useState('Site şu anda bakım modundadır. Lütfen daha sonra tekrar deneyin.');
  const [siteName, setSiteName] = useState({ name: 'Red', accent: 'Line' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.maintenanceMessage) {
          setMessage(data.maintenanceMessage);
        }
        if (data.siteName) {
          setSiteName({ name: data.siteName, accent: data.siteNameAccent });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="w-16 h-16 text-cyber-red" />
          <h1 className="text-4xl md:text-5xl font-black text-white">
            {siteName.name}<span className="text-cyber-red">{siteName.accent}</span>
          </h1>
        </div>
        
        <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-8 mb-6">
          <Wrench className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Maintenance Mode</h2>
          <p className="text-gray-300 text-lg whitespace-pre-wrap">{message}</p>
        </div>
        
        <p className="text-gray-500 text-sm">
          We apologize for any inconvenience. Please check back later.
        </p>
      </div>
    </div>
  );
}
