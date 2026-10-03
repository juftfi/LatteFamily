import React, { useState, useMemo } from 'react';
import { TokenMetadata, SupportedChainId } from '../types';
import { SUPPORTED_CHAINS } from '../data/chains';
import { LatteLogo } from './LatteLogo';
import { 
  Search, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Rocket, 
  Filter, 
  Users, 
  Coins, 
  Coffee,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface ExploreTokensProps {
  tokens: TokenMetadata[];
  onSelectToken: (token: TokenMetadata) => void;
  onOpenCreate: () => void;
}

export const ExploreTokens: React.FC<ExploreTokensProps> = ({
  tokens,
  onSelectToken,
  onOpenCreate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChainFilter, setSelectedChainFilter] = useState<number | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'marketCap' | 'progress' | 'gainers' | 'newest'>('progress');

  // Filtered & sorted tokens
  const filteredTokens = useMemo(() => {
    return tokens
      .filter((tok) => {
        const matchesSearch =
          tok.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tok.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tok.contractAddress.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesChain =
          selectedChainFilter === 'ALL' || tok.chainId === selectedChainFilter;

        return matchesSearch && matchesChain;
      })
      .sort((a, b) => {
        if (sortBy === 'marketCap') return b.marketCapUSD - a.marketCapUSD;
        if (sortBy === 'progress') return b.bondingProgress - a.bondingProgress;
        if (sortBy === 'gainers') return b.priceChange24h - a.priceChange24h;
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        return 0;
      });
  }, [tokens, searchQuery, selectedChainFilter, sortBy]);

  // Aggregate stats
  const totalVolume = tokens.reduce((acc, t) => acc + t.volume24hUSD, 0);
  const totalMarketCap = tokens.reduce((acc, t) => acc + t.marketCapUSD, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner with Stats */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#090e1a] to-[#070b14] border border-slate-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <LatteLogo size={18} />
            <span>Latte Family Launchpad Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover & Launch <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Startup Tokens</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Fair token generation events with instant automated bonding curves. 
            No seed rounds, no insider allocations — smart contracts deploy directly using verified Flap factory architecture.
          </p>

          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Rocket className="w-4 h-4 text-slate-950" />
              <span>Launch Startup Token</span>
            </button>

            <a
              href="https://x.com/Lattedotfamily"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md group"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Follow on X</span>
            </a>

            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md group"
            >
              <svg className="w-4 h-4 fill-current text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>Join Telegram</span>
            </a>

            <a
              href="https://flap.sh/bnb/0x3c73b6f7bc952de8187262dcaf2e581eb5d97777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/60 hover:border-amber-400 text-amber-300 hover:text-white text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer shadow-md shadow-amber-500/10 group"
            >
              <Coffee className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Buy $Latte</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Global Protocol Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Active Tokens</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {tokens.length}
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">24h Global Volume</span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              ${totalVolume.toLocaleString()}
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Total Market Cap</span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
              ${totalMarketCap.toLocaleString()}
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Graduation Target</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
              $69,000 MC
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by token name, ticker, or contract address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs sm:text-sm text-white transition-all font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chain Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedChainFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedChainFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Chains
            </button>
            {Object.values(SUPPORTED_CHAINS).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChainFilter(c.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedChainFilter === c.id
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{c.icon}</span>
                <span className="hidden sm:inline">{c.shortName}</span>
              </button>
            ))}
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 outline-none"
          >
            <option value="progress">⚡ Bonding Progress</option>
            <option value="marketCap">💎 Market Cap</option>
            <option value="gainers">📈 24h Top Gainers</option>
            <option value="newest">🕒 Recently Launched</option>
          </select>
        </div>
      </div>

      {/* Token Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No tokens found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords</p>
          </div>
        ) : (
          filteredTokens.map((token) => {
            const chain = SUPPORTED_CHAINS[token.chainId] || SUPPORTED_CHAINS[56];
            return (
              <div
                key={token.id}
                onClick={() => onSelectToken(token)}
                className="group rounded-2xl bg-[#0b101b] border border-slate-800/80 hover:border-emerald-500/50 p-5 shadow-xl hover:shadow-emerald-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={token.logoUrl}
                        alt={token.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {token.name}
                          </h3>
                          {token.isUserCreated && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            ${token.symbol}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <span>{chain.icon}</span>
                            <span>{chain.shortName}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold flex items-center justify-end gap-0.5 ${
                        token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">24h</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {token.description}
                  </p>
                </div>

                <div>
                  {/* Bonding Curve Progress Bar */}
                  <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Bonding Curve</span>
                      <span className="text-emerald-400 font-bold">
                        {token.bondingProgress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                        style={{ width: `${Math.min(100, token.bondingProgress)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Reserve: {token.reserveBalance.toFixed(1)} {chain.nativeCurrency.symbol}</span>
                      <span>Cap: ${token.marketCapUSD.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Card Footer: Metrics & Details */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{token.holdersCount} holders</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>Trade & Analytics</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
