import React, { useState } from 'react';
import { Fingerprint, Wallet, ChevronDown, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { testVoters } from '../constants/testVoters';

interface LoginPageProps {
  onLogin: (aadhaar: string, name: string) => void;
  connectWallet: () => Promise<void>;
  account: string | null;
  loading: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, connectWallet, account, loading }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectVoter = (voter: typeof testVoters[0]) => {
    setAadhaar(voter.aadhaarNumber);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const voter = testVoters.find(v => v.aadhaarNumber === aadhaar);
    if (voter) {
      onLogin(aadhaar, voter.name);
    } else {
      // For demo, allow any 12 digit number if not in test list
      if (aadhaar.replace(/\s/g, '').length === 12) {
        onLogin(aadhaar, "Guest Voter");
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-8">
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20"
        >
          <Fingerprint className="text-white w-10 h-10" />
        </motion.div>
        <h1 className="text-3xl font-black text-white mb-2">Voter Verification</h1>
        <p className="text-white/50">Enter your Aadhaar number to access the ballot.</p>
      </div>

      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
        {/* Wallet Connection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Step 1: Wallet Connection</label>
          <button
            onClick={connectWallet}
            disabled={loading}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all ${
              account 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-white text-navy-900 hover:bg-emerald-400 hover:text-white'
            }`}
          >
            {account ? (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Connect MetaMask</span>
              </>
            )}
          </button>
        </div>

        {/* Aadhaar Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 relative">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Step 2: Identity Verification</label>
              <button 
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors"
              >
                Test Users <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            
            <input
              type="text"
              placeholder="XXXX XXXX XXXX"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white text-xl font-mono tracking-widest placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 transition-all"
            />

            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 w-full mt-2 bg-navy-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                {testVoters.map((voter) => (
                  <button
                    key={voter.aadhaarNumber}
                    type="button"
                    onClick={() => handleSelectVoter(voter)}
                    className="w-full px-5 py-4 text-left hover:bg-white/5 flex flex-col border-b border-white/5 last:border-0"
                  >
                    <span className="text-white font-bold">{voter.name}</span>
                    <span className="text-white/30 text-xs font-mono">{voter.aadhaarNumber} ({voter.walletHint})</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={!account || aadhaar.replace(/\s/g, '').length !== 12}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            Verify & Enter
          </button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-white/20 text-xs">
          By continuing, you agree to the demo terms. <br/>
          Your Aadhaar number is hashed before being sent to the blockchain.
        </p>
      </div>
    </div>
  );
};
