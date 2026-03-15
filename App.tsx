import { useState, useEffect } from 'react';
import { useVoting } from './hooks/useVoting';
import { WalletConnect } from './components/WalletConnect';
import { AdminPanel } from './components/AdminPanel';
import { VotingPanel } from './components/VotingPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { LoginPage } from './components/LoginPage';
import { LayoutDashboard, Vote, BarChart3, ShieldAlert, Loader2, XCircle, LogOut, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'vote' | 'results' | 'admin';

const DisclaimerBanner = () => (
  <div className="bg-amber-500 text-navy-950 py-2 px-4 text-center font-bold text-xs sm:text-sm flex items-center justify-center gap-2 sticky top-0 z-[100]">
    <Info className="w-4 h-4" />
    <span>⚠️ DEMO PROJECT — All voter data is fictional and created for educational/internship demonstration only. Not connected to any real identity system.</span>
  </div>
);

export default function App() {
  const {
    account,
    candidates,
    isOwner,
    votingActive,
    loading,
    error,
    txHash,
    connectWallet,
    bulkRegister,
    addCandidate,
    castVote,
    toggleVoting,
    checkStatus,
    hashAadhaar,
    fetchData
  } = useVoting();

  const [voter, setVoter] = useState<{ aadhaar: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('vote');

  const handleLogin = (aadhaar: string, name: string) => {
    setVoter({ aadhaar, name });
  };

  const handleLogout = () => {
    setVoter(null);
    setActiveTab('vote');
  };

  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account, fetchData]);

  return (
    <div className="min-h-screen bg-navy-950 text-white selection:bg-emerald-500/30">
      <DisclaimerBanner />
      
      {!voter ? (
        <div className="min-h-[calc(100vh-40px)] flex items-center justify-center p-6">
          <LoginPage 
            onLogin={handleLogin} 
            connectWallet={connectWallet} 
            account={account} 
            loading={loading} 
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 bg-navy-900/50 border-b border-white/10 backdrop-blur-md sticky top-[40px] z-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Vote className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-white hidden sm:block uppercase">RISE Ballot</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Connected Identity</span>
                <span className="text-sm font-bold text-emerald-400">{voter.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl bg-white/5 text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <main className="max-w-5xl mx-auto px-4 py-12">
            {/* Navigation Tabs */}
            <div className="flex p-1.5 bg-white/5 rounded-2xl mb-12 border border-white/5">
              <button
                onClick={() => setActiveTab('vote')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                  activeTab === 'vote' ? 'bg-white text-navy-900 shadow-xl' : 'text-white/40 hover:text-white'
                }`}
              >
                <Vote className="w-4 h-4" />
                <span>Ballot</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                  activeTab === 'results' ? 'bg-white text-navy-900 shadow-xl' : 'text-white/40 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Results</span>
              </button>
              {isOwner && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                    activeTab === 'admin' ? 'bg-white text-navy-900 shadow-xl' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-10 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-between text-red-500"
                >
                  <div className="flex items-center gap-4">
                    <ShieldAlert className="w-6 h-6" />
                    <span className="text-sm font-bold">{error}</span>
                  </div>
                  <button className="p-2 hover:bg-red-500/20 rounded-xl transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Area */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'vote' && (
                <VotingPanel 
                  candidates={candidates} 
                  castVote={castVote} 
                  checkStatus={checkStatus}
                  hashAadhaar={hashAadhaar}
                  voterName={voter.name}
                  voterAadhaar={voter.aadhaar}
                  votingActive={votingActive}
                  loading={loading}
                />
              )}
              {activeTab === 'results' && (
                <ResultsPanel candidates={candidates} />
              )}
              {activeTab === 'admin' && isOwner && (
                <AdminPanel 
                  bulkRegister={bulkRegister}
                  addCandidate={addCandidate}
                  toggleVoting={toggleVoting}
                  votingActive={votingActive}
                  txHash={txHash}
                  loading={loading}
                />
              )}
            </motion.div>
          </main>
        </>
      )}

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {loading && !txHash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/90 backdrop-blur-md z-[200] flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-emerald-500/20 rounded-full" />
              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin absolute top-0 left-0" />
            </div>
            <p className="text-white font-black text-xl mt-8 tracking-widest uppercase animate-pulse">Processing Transaction</p>
            <p className="text-white/40 text-sm mt-2">Please confirm the request in MetaMask</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
