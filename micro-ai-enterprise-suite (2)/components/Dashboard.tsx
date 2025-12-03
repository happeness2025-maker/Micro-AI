import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ChartDataPoint } from '../types';

const data: ChartDataPoint[] = [
  { name: 'Mon', value: 4000, uv: 2400 },
  { name: 'Tue', value: 3000, uv: 1398 },
  { name: 'Wed', value: 2000, uv: 9800 },
  { name: 'Thu', value: 2780, uv: 3908 },
  { name: 'Fri', value: 1890, uv: 4800 },
  { name: 'Sat', value: 2390, uv: 3800 },
  { name: 'Sun', value: 3490, uv: 4300 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Scripts Generated</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">1,248</p>
          <span className="text-green-500 text-sm font-semibold">+12.5%</span>
        </div>
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active API Tokens</h3>
          <p className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">864k</p>
          <span className="text-blue-500 text-sm font-semibold">Gemini Flash</span>
        </div>
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">System Status</h3>
          <p className="text-3xl font-bold mt-2 text-green-500">Operational</p>
          <span className="text-gray-400 text-sm">Latency: 45ms</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl h-80">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Usage Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
              />
              <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl h-80">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Model Performance</h3>
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.1)'}}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="uv" name="Latency (ms)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="value" name="Tokens" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;