import React, { useState } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { ExploreTokens } from './components/ExploreTokens';
import { TokenCreationForm } from './components/TokenCreationForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { FlapContractsRegistry } from './components/FlapContractsRegistry';
import { LatteLogo } from './components/LatteLogo';
import { TokenMetadata, ProtocolType } from './types';
import { INITIAL_TOKENS } from './data/mockTokens';

function MainApp() {
  const { tokens, addToken } = useWallet();
  const [activeTab, setActiveTab] = useState<'explore' | 'create' | 'dashboard' | 'contracts'>('explore');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('flap');
  const [selectedToken, setSelectedToken] = useState<TokenMetadata>(tokens[0] || INITIAL_TOKENS[0]);

  const handleSelectToken = (token: TokenMetadata) => {
    setSelectedToken(token);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTokenCreated = (token: TokenMetadata) => {
    addToken(token);
    setSelectedToken(token);
  };

  const handleViewDashboardFromModal = (token: TokenMetadata) => {
    setSelectedToken(token);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCreate={() => {
            setActiveTab('create');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          selectedProtocol={selectedProtocol}
          setSelectedProtocol={setSelectedProtocol}
        />

        <main className="pb-16 animate-in fade-in duration-300">
          {activeTab === 'explore' && (
            <ExploreTokens
              tokens={tokens}
              onSelectToken={handleSelectToken}
              onOpenCreate={() => {
                setActiveTab('create');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'create' && (
            <TokenCreationForm
              onTokenCreated={handleTokenCreated}
              onViewDashboard={handleViewDashboardFromModal}
            />
          )}

          {activeTab === 'dashboard' && (
            <AnalyticsDashboard
              selectedToken={selectedToken}
              onSelectToken={(t) => setSelectedToken(t)}
              onOpenCreate={() => {
                setActiveTab('create');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'contracts' && (
            <FlapContractsRegistry 
              selectedProtocol={selectedProtocol}
              setSelectedProtocol={setSelectedProtocol}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#06080e] py-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LatteLogo size={24} />
            <span className="text-slate-200 font-semibold">Latte Family Protocol</span>
            <span>•</span>
            <span>Automated Web3 Startup Bonding Curve Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://docs.flap.sh/flap/developers/deployed-contract-addresses"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              Flap Docs
            </a>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('contracts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Contract Registry
            </button>
            <span>•</span>
            <span>BNB Chain / Base / Polygon / Arbitrum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <MainApp />
    </WalletProvider>
  );
}
