import React from 'react';
import { Wallet, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface WalletConnectProps {
  account: string | null;
  onConnect: () => void;
  loading: boolean;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ account, onConnect, loading }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-navy-900/50 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">RISE Voting</h1>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onConnect}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
          account 
            ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' 
            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : account ? (
          <>
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-mono">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
