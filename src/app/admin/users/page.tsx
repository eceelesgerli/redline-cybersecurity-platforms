'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, Search } from 'lucide-react';

const RANKS = [
  { level: 1, name: 'Script Kiddie', emoji: '🔰' },
  { level: 2, name: 'White Hat Trainee', emoji: '🎓' },
  { level: 3, name: 'Ethical Hacker', emoji: '💻' },
  { level: 4, name: 'Security Engineer', emoji: '🛡️' },
  { level: 5, name: 'Cyber Guardian', emoji: '⚔️' },
];

interface User {
  _id: string;
  username: string;
  email: string;
  rank: number;
  topicsCount: number;
  repliesCount: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRankChange = async (userId: string, newRank: number) => {
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, rank: newRank }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u._id === userId ? updatedUser : u));
      }
    } catch (error) {
      console.error('Error updating rank:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getRankInfo = (rank: number) => {
    return RANKS.find(r => r.level === rank) || RANKS[0];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-cyber-red" />
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-gray-500">{users.length} registered users</p>
          </div>
        </div>
      </div>

      {/* Rank Legend */}
      <div className="card">
        <h2 className="font-bold mb-3">Rank System</h2>
        <div className="flex flex-wrap gap-3">
          {RANKS.map((rank) => (
            <div key={rank.level} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <span>{rank.emoji}</span>
              <span className="text-sm font-medium">{rank.name}</span>
              <span className="text-xs text-gray-400">(Lv.{rank.level})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="input-field pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 font-bold">User</th>
                <th className="text-left p-4 font-bold">Email</th>
                <th className="text-left p-4 font-bold">Rank</th>
                <th className="text-center p-4 font-bold">Topics</th>
                <th className="text-center p-4 font-bold">Replies</th>
                <th className="text-left p-4 font-bold">Joined</th>
                <th className="text-left p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const rankInfo = getRankInfo(user.rank);
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyber-red rounded-full flex items-center justify-center text-white font-bold">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="font-semibold">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {rankInfo.emoji} {rankInfo.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">{user.topicsCount}</td>
                    <td className="p-4 text-center">{user.repliesCount}</td>
                    <td className="p-4 text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      <select
                        value={user.rank}
                        onChange={(e) => handleRankChange(user._id, parseInt(e.target.value))}
                        disabled={updating === user._id}
                        className="border-2 border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        {RANKS.map((rank) => (
                          <option key={rank.level} value={rank.level}>
                            {rank.emoji} {rank.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
