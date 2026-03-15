import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface ResultsPanelProps {
  candidates: Candidate[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ candidates }) => {
  const data = candidates.map(c => ({
    name: c.name,
    votes: c.voteCount
  }));

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const winner = [...candidates].sort((a, b) => b.voteCount - a.voteCount)[0];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 md:col-span-2"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Live Standings</h2>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff50" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff50" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ 
                    backgroundColor: '#0a192f', 
                    border: '1px solid #ffffff10',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Current Leader</h2>
            </div>
            
            {totalVotes > 0 ? (
              <div className="space-y-2">
                <p className="text-4xl font-black text-white">{winner.name}</p>
                <p className="text-emerald-400 font-medium">{winner.voteCount} Votes</p>
              </div>
            ) : (
              <p className="text-white/30 italic">No votes cast yet</p>
            )}
          </div>

          <div className="pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm">Total Participation</p>
            <p className="text-2xl font-bold text-white">{totalVotes}</p>
          </div>
        </motion.div>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Detailed Breakdown</h3>
        <div className="space-y-4">
          {candidates.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4">
              <span className="text-white/30 font-mono w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-white font-medium">{c.name}</span>
                  <span className="text-white/50">{c.voteCount} votes</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
