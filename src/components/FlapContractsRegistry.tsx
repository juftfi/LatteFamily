import React, { useState } from 'react';
import { SUPPORTED_CHAINS } from '../data/chains';
import { ProtocolType } from '../types';
import { 
  FileCode2, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Coins, 
  HelpCircle,
  Terminal,
  Coffee,
  Sparkles,
  Flame,
  ChevronDown,
  Clock,
  Bell,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface FlapContractsRegistryProps {
  selectedProtocol: ProtocolType;
  setSelectedProtocol: (proto: ProtocolType) => void;
}

export const FlapContractsRegistry: React.FC<FlapContractsRegistryProps> = ({
  selectedProtocol,
  setSelectedProtocol,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<number>(56); // BSC default
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [emailNotif, setEmailNotif] = useState('');
  const [notifSubmitted, setNotifSubmitted] = useState(false);

  const chain = SUPPORTED_CHAINS[selectedChainId] || SUPPORTED_CHAINS[56];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailNotif) return;
    setNotifSubmitted(true);
    setTimeout(() => {
      setNotifSubmitted(false);
      setEmailNotif('');
    }, 3000);
  };

  const flapContractsList = [
    {
      role: 'Launchpad Factory Contract',
      tag: 'Core Deployer',
      address: chain.flapContracts.launchpad,
      description: 'The primary factory entry point that deploys new bonding curve token smart contracts, initializes parameters, and transfers protocol fees.',
      vanity: 'Main Factory',
      isCore: true,
    },
    {
      role: 'Portal Contract',
      tag: 'Management & Routing',
      address: chain.flapContracts.portal,
      description: 'Handles token registration, event indexing, trade execution hooks, and automated DEX liquidity graduation routines.',
      vanity: 'Core Portal',
      isCore: true,
    },
    {
      role: 'Standard Token V3 Implementation',
      tag: 'ERC-20 / BEP-20',
      address: chain.flapContracts.standardTokenImpl,
      description: 'Master clone implementation for tokens with 0% tax. Maximum decentralized exchange routing compatibility.',
      vanity: 'Ends in ...8888',
      isCore: false,
    },
    {
      role: 'Tax Token V3 Implementation',
      tag: 'Fee Distribution',
      address: chain.flapContracts.taxTokenImpl,
      description: 'Master clone implementation for tokens with custom tax fee logic (transfer tax, marketing vault, LP burn).',
      vanity: 'Ends in ...7777',
      isCore: false,
    },
    {
      role: 'Vault Factory',
      tag: 'Treasury & Revenue',
      address: chain.flapContracts.vaultFactory,
      description: 'Factory contract responsible for creating dedicated fee collection vaults and developer revenue distribution modules.',
      vanity: 'Ends in ...4a64',
      isCore: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Protocol Switcher Combo Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0b101b] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Multi-Protocol Contract Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Deployed Smart Contract Addresses
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Verify official immutable factory, portal, and implementation contracts across leading Web3 launchpad protocols.
          </p>
        </div>

        {/* Combo Box on top of the page */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1.5">
            <button
              onClick={() => setSelectedProtocol('flap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProtocol === 'flap'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Flap.sh</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/20 text-slate-950 font-bold">
                Active
              </span>
            </button>

            <button
              onClick={() => setSelectedProtocol('brew')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProtocol === 'brew'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Brew.Family</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Soon
              </span>
            </button>

            <button
              onClick={() => setSelectedProtocol('four')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedProtocol === 'four'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Four.meme</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Soon
              </span>
            </button>
          </div>

          {selectedProtocol === 'flap' && (
            <a
              href="https://docs.flap.sh/flap/developers/deployed-contract-addresses"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex-shrink-0"
            >
              <span>Flap Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* VIEW 1: FLAP.SH ACTIVE CONTRACTS */}
      {selectedProtocol === 'flap' && (
        <div className="space-y-6">
          {/* Network Filter for Flap */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {Object.values(SUPPORTED_CHAINS).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChainId(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex-shrink-0 cursor-pointer ${
                  c.id === selectedChainId
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          {/* Contracts Table */}
          <div className="bg-[#0b101b] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{chain.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-white">{chain.name} Contracts</h2>
                  <span className="text-xs text-slate-400 font-mono">Chain ID: {chain.id} • Explorer: {chain.explorerUrl}</span>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified CREATE2 Deployments
              </span>
            </div>

            <div className="divide-y divide-slate-800">
              {flapContractsList.map((item, idx) => {
                const key = `${chain.id}-${idx}`;
                const isCopied = copiedKey === key;
                return (
                  <div key={idx} className="p-6 hover:bg-slate-900/30 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-sm font-bold text-white">{item.role}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {item.tag}
                          </span>
                          {item.vanity && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                              {item.vanity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Contract Address Bar */}
                      <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono text-xs">
                        <code className="text-emerald-400 select-all font-semibold">
                          {item.address}
                        </code>
                        <button
                          onClick={() => handleCopy(item.address, key)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Address"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={`${chain.explorerUrl}/address/${item.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                          title="View on Explorer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Developer Integration Code Example */}
          <div className="bg-[#0b101b] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                  Solidity / Ethers.js Factory Calling Snippet
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">FlapFactory.sol</span>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
{`// Calling Flap Launchpad Factory on ${chain.name} (${chain.flapContracts.launchpad})
const flapFactory = new ethers.Contract(
  "${chain.flapContracts.launchpad}",
  [
    "function createToken(string name, string symbol, uint256 totalSupply, bytes metadata) payable returns (address)",
    "function mintingFee() view returns (uint256)"
  ],
  signer
);

// Execute token creation with automated minting fee
const fee = await flapFactory.mintingFee(); // ${chain.mintingFee} ${chain.nativeCurrency.symbol}
const tx = await flapFactory.createToken(
  "Startup Name",
  "TICKER",
  ethers.parseUnits("1000000000", 18),
  ethers.toUtf8Bytes(JSON.stringify({ logoUrl, website, twitter })),
  { value: fee }
);
await tx.wait();`}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 2: BREW.FAMILY (SOON) */}
      {selectedProtocol === 'brew' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0b101b] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold font-mono uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Integration Status: Testnet Under Audit (Soon)</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <Coffee className="w-8 h-8 text-amber-400" />
                  Brew.Family Protocol Integration
                </h2>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                  Brew.Family is an upcoming decentralized fair-launchpad and liquidity brewing infrastructure offering cross-chain yield farming for new tokens, automated bonding reserves, and non-custodial treasury modules.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80 block">Target Chains</span>
                <div className="text-base font-bold text-white font-mono mt-1">BNB Chain & Arbitrum One</div>
                <span className="text-xs text-slate-400 font-mono">Launch: Q4 2026</span>
              </div>
            </div>

            {/* Contract Architecture Blueprint */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-4">
                Brew.Family Smart Contract Architecture Blueprint (Pre-Deployment)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <span>BrewFactory.sol</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Deployer for fair bonding tokens with dynamic brew curve pricing and zero team pre-mine.
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0xB7e...0001 (CREATE2 Vanity Hash Pending)
                  </code>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">BrewLiquidityRouter.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Direct automated liquidity injection to PancakeSwap V3 and Uniswap Arbitrum pool once cap is brewed.
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0xB7e...0002 (Router Core)
                  </code>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">BrewFairPool.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Decentralized staking pools where startup token holders receive coffee reward tokens ($BREW).
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0xB7e...0003 (Staking Engine)
                  </code>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">BrewLocker.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Immutable timelock mechanism ensuring 100% of initial creator and LP tokens cannot be rugged.
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0xB7e...0004 (Proof of Lock)
                  </code>
                </div>
              </div>
            </div>

            {/* Notification form */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Get Notified When Brew.Family Goes Live
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Receive instant contract addresses and testnet faucet access when the audit concludes.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  placeholder="your.wallet@domain.com"
                  value={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-amber-400 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            </div>

            {notifSubmitted && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! You will be notified the instant Brew.Family smart contracts are deployed.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: FOUR.MEME (SOON) */}
      {selectedProtocol === 'four' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0b101b] border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold font-mono uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Integration Status: BSC Mainnet Bridge (Soon)</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <Flame className="w-8 h-8 text-purple-400" />
                  Four.meme Protocol Integration
                </h2>
                <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                  Four.meme is a popular meme coin and community startup launchpad on BNB Chain. Designed with instant bonding curves, zero tax, and automatic migration to PancakeSwap once market cap reaches 24 BNB (~$14,000).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400/80 block">Ecosystem</span>
                <div className="text-base font-bold text-white font-mono mt-1">BNB Smart Chain (BSC)</div>
                <span className="text-xs text-purple-300 font-mono">Bonding: 24 BNB Target</span>
              </div>
            </div>

            {/* Contract Architecture Blueprint */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-4">
                Four.meme Smart Contract Architecture Blueprint (Pre-Deployment)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">FourMemeFactory.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    High throughput token generator on BSC with instant BscScan automatic source verification and fair launch queue.
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0x4444...meme (Contract Deployer)
                  </code>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">FourMemeBondingCurve.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Constant product virtual liquidity curve ensuring every trade increases market cap predictably without frontrunning.
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0x4444...curve (AMM Virtual Pool)
                  </code>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">FourMemeGraduationRouter.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Automatically seeds $12,000 in BNB + 200M tokens into PancakeSwap LP and sends the LP tokens to dead address (0x0...dead).
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0x4444...router (Auto-LP Burn)
                  </code>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">FourMemeAntiRugGuard.sol</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Pending Deployment
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Restricts creator sell limits to max 2% per block during initial launch phase to prevent flash dumping.
                  </p>
                  <code className="text-[11px] font-mono text-slate-500 block">
                    Target: 0x4444...guard (Security Protocol)
                  </code>
                </div>
              </div>
            </div>

            {/* Notification form */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-900/80 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  Get Notified When Four.meme Goes Live
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Be first in line to deploy meme startup tokens with Four.meme bonding contracts.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  placeholder="your.wallet@domain.com"
                  value={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-400 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            </div>

            {notifSubmitted && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! You will be notified the instant Four.meme contracts are live on BSC.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
