import React, { useEffect, useState } from 'react';
import { parseSheetData } from '../services/authService';
import { SheetUserRow } from '../types';
import { Shield, RefreshCw, Database, Eye, EyeOff } from 'lucide-react';

const AdminView: React.FC = () => {
  const [users, setUsers] = useState<SheetUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // Uses the default LIVE_SHEET_URL defined in authService
    const data = await parseSheetData();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3">
        <Shield className="w-6 h-6 text-red-500 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-red-600 dark:text-red-400">Restricted Database Area</h3>
          <p className="text-sm text-red-800 dark:text-red-300">
            This view is only accessible to users with the <code>admin</code> role. 
            It reflects the current state of your connected Google Sheet.
          </p>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5" /> Live User Database
            </h2>
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowPasswords(!showPasswords)} 
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title={showPasswords ? "Hide Passwords" : "Show Passwords"}
                >
                    {showPasswords ? <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                </button>
                <button 
                    onClick={fetchData} 
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Username</th>
                        <th className="px-6 py-4">Password</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/50">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Syncing with Google Sheets...</td>
                        </tr>
                    ) : users.map((user, idx) => (
                        <tr key={idx} className="hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{user.username}</td>
                            <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                                {showPasswords ? user.password : '••••••••'}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                    user.role === 'admin' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' :
                                    user.role === 'viewer' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300' :
                                    'bg-gray-500/20 text-gray-600 dark:text-gray-300'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.status}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;