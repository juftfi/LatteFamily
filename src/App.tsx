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

          <div className="flex items-center gap-4 text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <a
                href="https://x.com/Lattedotfamily"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-all text-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>@Lattedotfamily</span>
              </a>

              <a
                href="https://t.me/Lattedotfamily"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current text-cyan-400" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Telegram</span>
              </a>
            </div>

            <span>•</span>

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
