import React from 'react';
import { UserPlus, PlusCircle, Play, Square, ExternalLink, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { testVoters } from '../constants/testVoters';

interface AdminPanelProps {
  bulkRegister: (hashes: string[]) => Promise<void>;
  addCandidate: (name: string) => Promise<void>;
  toggleVoting: (status: boolean) => Promise<void>;
  votingActive: boolean;
  txHash: string | null;
  loading: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  bulkRegister,
  addCandidate,
  toggleVoting,
  votingActive,
  txHash,
  loading
}) => {
  const [candidateName, setCandidateName] = React.useState('');

  const handleBulkRegister = async () => {
    const aadhaarNumbers = testVoters.map(v => v.aadhaarNumber);
    await bulkRegister(aadhaarNumbers);
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (candidateName) {
      await addCandidate(candidateName);
      setCandidateName('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulk Registration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Voter Management</h2>
          </div>
          <p className="text-white/50 text-sm mb-6">
            Quickly register all 5 pre-defined test voters to the blockchain in a single transaction.
          </p>
          <button
            onClick={handleBulkRegister}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Register All Test Voters
          </button>
        </motion.div>

        {/* Candidate Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Add Candidate</h2>
          </div>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <input
              type="text"
              placeholder="Candidate Name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !candidateName}
              className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              Add to Ballot
            </button>
          </form>
        </motion.div>
      </div>

      {/* Voting Control */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Election Control</h2>
          <p className="text-white/50 text-sm">Open or close the ballot for all registered identities.</p>
        </div>
        <button
          onClick={() => toggleVoting(!votingActive)}
          disabled={loading}
          className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg transition-all ${
            votingActive 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20'
          }`}
        >
          {votingActive ? (
            <>
              <Square className="w-5 h-5 fill-current" />
              Stop Voting
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Start Voting
            </>
          )}
        </button>
      </motion.div>

      {/* Transaction Feedback */}
      {txHash && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 font-bold">Transaction Pending...</span>
          </div>
          <a 
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-2 underline underline-offset-4"
          >
            View on Etherscan <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </div>
  );
};
