import React, { useEffect, useState } from 'react';
import { Vote, CheckCircle2, AlertCircle, Clock, User, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface VotingPanelProps {
  candidates: Candidate[];
  castVote: (id: number, aadhaar: string) => Promise<void>;
  checkStatus: (hash: string) => Promise<{ registered: boolean; voted: boolean }>;
  hashAadhaar: (aadhaar: string) => string;
  voterName: string;
  voterAadhaar: string;
  votingActive: boolean;
  loading: boolean;
}

export const VotingPanel: React.FC<VotingPanelProps> = ({
  candidates,
  castVote,
  checkStatus,
  hashAadhaar,
  voterName,
  voterAadhaar,
  votingActive,
  loading
}) => {
  const [status, setStatus] = useState({ registered: false, voted: false });
  const [checking, setChecking] = useState(true);

  const maskedAadhaar = `XXXX XXXX ${voterAadhaar.slice(-4)}`;

  useEffect(() => {
    const fetchStatus = async () => {
      setChecking(true);
      const hash = hashAadhaar(voterAadhaar);
      const res = await checkStatus(hash);
      setStatus(res);
      setChecking(false);
    };
    fetchStatus();
  }, [voterAadhaar, checkStatus, hashAadhaar]);

  if (!votingActive) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Ballot is Closed</h2>
        <p className="text-white/40 max-w-md text-lg">
          The election is not currently active. Please wait for the administrator to open the voting session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Voter Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-3xl bg-white/5 border border-white/10 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{voterName}</h2>
            <div className="flex items-center gap-2 text-white/40 font-mono text-sm">
              <Fingerprint className="w-4 h-4" />
              <span>{maskedAadhaar}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {checking ? (
            <div className="px-4 py-2 rounded-full bg-white/5 text-white/30 text-xs font-bold animate-pulse">Checking Status...</div>
          ) : status.voted ? (
            <div className="px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Already Voted
            </div>
          ) : status.registered ? (
            <div className="px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Registered
            </div>
          ) : (
            <div className="px-5 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-bold border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Not Registered
            </div>
          )}
        </div>
      </div>

      {!status.registered && !checking && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4"
        >
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-amber-500 font-bold text-lg">Verification Required</h3>
            <p className="text-amber-500/70">Your identity exists in our demo database, but has not been registered on the blockchain yet. Please ask the administrator to register your Aadhaar hash.</p>
          </div>
        </motion.div>
      )}

      {status.voted && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-emerald-500 font-bold text-lg">Vote Successfully Recorded</h3>
            <p className="text-emerald-500/70">Thank you for voting! Your choice has been encrypted and stored on the Ethereum blockchain using your hashed identity.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {candidates.map((candidate) => (
          <motion.div
            key={candidate.id}
            whileHover={{ y: -6 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between group transition-all hover:bg-white/[0.07]"
          >
            <div>
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white/20 font-mono text-xl font-black group-hover:text-emerald-400 transition-colors">
                0{candidate.id + 1}
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{candidate.name}</h3>
              <p className="text-white/20 text-xs font-mono mb-8 uppercase tracking-widest">Candidate ID: {candidate.id}</p>
            </div>

            <button
              onClick={() => castVote(candidate.id, voterAadhaar)}
              disabled={loading || status.voted || !status.registered}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all ${
                status.voted 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                  : !status.registered
                  ? 'bg-white/5 text-white/10 border border-white/5 cursor-not-allowed'
                  : 'bg-white text-navy-900 hover:bg-emerald-400 hover:text-white shadow-xl hover:shadow-emerald-500/20'
              }`}
            >
              {status.voted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Voted
                </>
              ) : (
                <>
                  <Vote className="w-5 h-5" />
                  Cast Vote
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
