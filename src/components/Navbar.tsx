import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { SUPPORTED_CHAINS } from '../data/chains';
import { SupportedChainId, ProtocolType } from '../types';
import { LatteLogo } from './LatteLogo';
import { 
  Rocket, 
  Layers, 
  BarChart3, 
  FileCode2, 
  Wallet, 
  ChevronDown, 
  ExternalLink, 
  Check, 
  Copy, 
  LogOut, 
  Coins, 
  Zap,
  Flame,
  Coffee,
  Sparkles,
  Send
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'create' | 'dashboard' | 'contracts';
  setActiveTab: (tab: 'explore' | 'create' | 'dashboard' | 'contracts') => void;
  onOpenCreate: () => void;
  selectedProtocol: ProtocolType;
  setSelectedProtocol: (protocol: ProtocolType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenCreate,
  selectedProtocol,
  setSelectedProtocol,
}) => {
  const { wallet, connectWallet, disconnectWallet, switchChain, faucetDemo } = useWallet();
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [showContractsMenu, setShowContractsMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const contractsMenuRef = useRef<HTMLDivElement>(null);
  const networkMenuRef = useRef<HTMLDivElement>(null);
  const walletMenuRef = useRef<HTMLDivElement>(null);

  const currentChain = SUPPORTED_CHAINS[wallet.chainId] || SUPPORTED_CHAINS[56];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contractsMenuRef.current && !contractsMenuRef.current.contains(event.target as Node)) {
        setShowContractsMenu(false);
      }
      if (networkMenuRef.current && !networkMenuRef.current.contains(event.target as Node)) {
        setShowNetworkMenu(false);
      }
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setShowWalletMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const protocols = [
    {
      id: 'flap' as ProtocolType,
      name: 'Flap Contracts',
      subtext: 'Official Deployed Contracts',
      status: 'Active',
      statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: <Flame className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'brew' as ProtocolType,
      name: 'Brew.Family',
      subtext: 'Multi-chain Fair Launchpad',
      status: 'Soon',
      statusColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: <Coffee className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'four' as ProtocolType,
      name: 'Four.meme',
      subtext: 'BNB Chain Meme Coin Engine',
      status: 'Soon',
      statusColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
  ];

  const currentProtocolObj = protocols.find(p => p.id === selectedProtocol) || protocols[0];

  const handleSelectProtocol = (proto: ProtocolType) => {
    setSelectedProtocol(proto);
    setActiveTab('contracts');
    setShowContractsMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B11]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <LatteLogo size={42} className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                  Latte
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Latte Family Startup Launchpad</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-slate-800/90 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Explore Tokens
            </button>

            <button
              onClick={() => {
                setActiveTab('create');
                onOpenCreate();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Rocket className="w-4 h-4 text-cyan-400" />
              Create Token
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800/90 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Dashboard & Analytics
            </button>

            {/* COMBO BOX MENU: Protocol Contracts (Flap, Brew.Family, Four.meme) */}
            <div className="relative" ref={contractsMenuRef}>
              <button
                onClick={() => setShowContractsMenu(!showContractsMenu)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeTab === 'contracts'
                    ? 'bg-slate-800/90 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4 text-amber-400" />
                  <span>{currentProtocolObj.name}</span>
                </div>
                {currentProtocolObj.status === 'Soon' && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Soon
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showContractsMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown / Combo Box Panel */}
              {showContractsMenu && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0c121e]/98 border border-slate-700/80 shadow-2xl backdrop-blur-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                    <span>Protocol Contracts</span>
                    <span className="text-emerald-400 font-mono">Registry</span>
                  </div>

                  <div className="space-y-1">
                    {protocols.map((proto) => {
                      const isSelected = activeTab === 'contracts' && selectedProtocol === proto.id;
                      return (
                        <button
                          key={proto.id}
                          onClick={() => handleSelectProtocol(proto.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                              : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              {proto.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{proto.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {proto.subtext}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${proto.statusColor}`}>
                              {proto.status}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Select to view contract addresses</span>
                    <span>Flap.sh v3</span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right side controls: Social Links, Network Switcher & Wallet */}
        <div className="flex items-center gap-2">
          {/* Social Links: X & Telegram */}
          <div className="flex items-center gap-1.5 mr-0.5">
            <a
              href="https://x.com/Lattedotfamily"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/90 text-slate-300 hover:text-white transition-all flex items-center justify-center cursor-pointer group shadow-sm"
              title="Latte Family on X: @Lattedotfamily"
            >
              <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/90 text-slate-300 hover:text-cyan-400 transition-all flex items-center justify-center cursor-pointer group shadow-sm"
              title="Latte Family on Telegram: @Lattedotfamily"
            >
              <Send className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* Buy $Latte Button */}
          <a
            href="https://flap.sh/bnb/0x3c73b6f7bc952de8187262dcaf2e581eb5d97777"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-white font-mono font-bold text-xs shadow-sm hover:shadow-amber-500/20 transition-all cursor-pointer group"
            title="Buy $Latte on Flap.sh"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Buy $Latte</span>
            <ExternalLink className="w-3 h-3 text-amber-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Network Switcher Dropdown */}
          <div className="relative" ref={networkMenuRef}>
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <span className="text-base">{currentChain.icon}</span>
              <span className="hidden sm:inline font-mono">{currentChain.shortName}</span>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>3.2 Gwei</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showNetworkMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowNetworkMenu(false)}
              >
                <div className="px-3 py-2 text-[11px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Select Blockchain
                </div>
                {Object.values(SUPPORTED_CHAINS).map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => switchChain(chain.id as SupportedChainId)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      chain.id === wallet.chainId
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{chain.icon}</span>
                      <div className="text-left">
                        <div className="text-white font-medium">{chain.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Fee: {chain.mintingFee} {chain.nativeCurrency.symbol}
                        </div>
                      </div>
                    </div>
                    {chain.id === wallet.chainId && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wallet Button */}
          {!wallet.isConnected ? (
            <div className="relative">
              <button
                onClick={() => connectWallet('auto')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-slate-950" />
                <span>Connect Wallet</span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={walletMenuRef}>
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-xs cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <div className="font-mono font-bold text-white text-xs">
                    {wallet.balanceNative.toFixed(3)} {currentChain.nativeCurrency.symbol}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    ≈ ${(wallet.balanceNative * currentChain.nativeCurrency.priceUSD).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 text-emerald-300 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </button>

              {showWalletMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        {wallet.walletName || 'Web3 Injected'}
                        {wallet.isDemo && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                            DEMO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {currentChain.name}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="my-3 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Balance</span>
                      <div className="text-base font-bold font-mono text-white">
                        {wallet.balanceNative.toFixed(4)} {currentChain.nativeCurrency.symbol}
                      </div>
                    </div>
                    <button
                      onClick={() => faucetDemo(1.5)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors cursor-pointer"
                      title="Receive 1.5 free test coins"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      Faucet +1.5
                    </button>
                  </div>

                  <div className="space-y-1">
                    <a
                      href={`${currentChain.explorerUrl}/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/80 transition-colors"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <button
                      onClick={() => {
                        setShowWalletMenu(false);
                        disconnectWallet();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <span>Disconnect Wallet</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tab bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 py-2 px-2 bg-slate-950/90 text-xs">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center py-1 px-2 rounded cursor-pointer ${
            activeTab === 'explore' ? 'text-emerald-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4 mb-0.5" />
          Explore
        </button>
        <button
          onClick={() => {
            setActiveTab('create');
            onOpenCreate();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded cursor-pointer ${
            activeTab === 'create' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Rocket className="w-4 h-4 mb-0.5" />
          Create
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded cursor-pointer ${
            activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          Dashboard
        </button>
        <button
          onClick={() => {
            setActiveTab('contracts');
            setShowContractsMenu(!showContractsMenu);
          }}
          className={`flex flex-col items-center py-1 px-2 rounded cursor-pointer ${
            activeTab === 'contracts' ? 'text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <FileCode2 className="w-4 h-4 mb-0.5" />
          Contracts ▾
        </button>
      </div>

      {/* Mobile Contracts Dropdown popup */}
      {showContractsMenu && (
        <div className="md:hidden bg-slate-900 border-t border-b border-slate-800 p-2 space-y-1 animate-in fade-in">
          {protocols.map((proto) => (
            <button
              key={proto.id}
              onClick={() => handleSelectProtocol(proto.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs ${
                selectedProtocol === proto.id ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {proto.icon}
                <span>{proto.name}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${proto.statusColor}`}>
                {proto.status}
              </span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
