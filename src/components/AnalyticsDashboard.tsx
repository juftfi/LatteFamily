import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { TokenMetadata, TradeTransaction } from '../types';
import { SUPPORTED_CHAINS } from '../data/chains';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Copy, 
  Check, 
  Users, 
  Coins, 
  Flame, 
  ShieldCheck, 
  Lock, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Send, 
  Globe, 
  Twitter, 
  Share2,
  Sparkles,
  Percent,
  CircleDollarSign,
  AlertCircle
} from 'lucide-react';

interface AnalyticsDashboardProps {
  selectedToken: TokenMetadata;
  onSelectToken: (token: TokenMetadata) => void;
  onOpenCreate: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  selectedToken,
  onSelectToken,
  onOpenCreate,
}) => {
  const { wallet, tokens, trades, addTrade, faucetDemo } = useWallet();
  const [copied, setCopied] = useState(false);
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '1M'>('24H');
  
  // Swap / Simulator state
  const [swapTab, setSwapTab] = useState<'BUY' | 'SELL'>('BUY');
  const [swapAmount, setSwapAmount] = useState<string>('0.1');
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccessMessage, setSwapSuccessMessage] = useState<string | null>(null);

  // Airdrop state
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [airdropAddress, setAirdropAddress] = useState('');
  const [airdropAmount, setAirdropAmount] = useState('100000');
  const [airdropSuccess, setAirdropSuccess] = useState(false);

  const chain = SUPPORTED_CHAINS[selectedToken.chainId] || SUPPORTED_CHAINS[56];
  const tokenTrades = trades.filter((t) => t.tokenAddress.toLowerCase() === selectedToken.contractAddress.toLowerCase());

  const handleCopyContract = () => {
    navigator.clipboard.writeText(selectedToken.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Bonding Curve calculations for Swap
  const numericAmount = parseFloat(swapAmount) || 0;
  const tokenPriceNative = selectedToken.currentPrice;
  const estTokensOut = swapTab === 'BUY' 
    ? Math.floor(numericAmount / tokenPriceNative)
    : numericAmount;
  const estNativeOut = swapTab === 'SELL' 
    ? (numericAmount * tokenPriceNative).toFixed(4)
    : numericAmount.toFixed(4);

  const handleExecuteTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      alert('Please connect your Web3 wallet first.');
      return;
    }

    if (swapTab === 'BUY' && numericAmount > wallet.balanceNative) {
      alert(`Insufficient ${chain.nativeCurrency.symbol} balance!`);
      return;
    }

    setSwapLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const amountNative = swapTab === 'BUY' ? numericAmount : parseFloat(estNativeOut);
    const amountTokens = swapTab === 'BUY' ? estTokensOut : numericAmount;
    const amountUSD = amountNative * chain.nativeCurrency.priceUSD;

    addTrade({
      tokenAddress: selectedToken.contractAddress,
      type: swapTab,
      amountToken: amountTokens,
      amountNative,
      amountUSD,
      traderAddress: wallet.address ? `${wallet.address.slice(0, 5)}...${wallet.address.slice(-4)}` : '0xAnon...9a88',
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    });

    setSwapLoading(false);
    setSwapSuccessMessage(`Successfully ${swapTab === 'BUY' ? 'purchased' : 'sold'} ${amountTokens.toLocaleString()} ${selectedToken.symbol}!`);
    setTimeout(() => setSwapSuccessMessage(null), 4000);
  };

  const handleSendAirdrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!airdropAddress) return;
    setAirdropSuccess(true);
    setTimeout(() => {
      setAirdropSuccess(false);
      setShowAirdrop(false);
      setAirdropAddress('');
    }, 2500);
  };

  // SVG Chart points calculation
  const chartPoints = selectedToken.priceHistory.map((p, idx) => {
    const minPrice = Math.min(...selectedToken.priceHistory.map((h) => h.price)) * 0.95;
    const maxPrice = Math.max(...selectedToken.priceHistory.map((h) => h.price)) * 1.05;
    const range = maxPrice - minPrice || 1;
    const x = (idx / Math.max(1, selectedToken.priceHistory.length - 1)) * 500;
    const y = 160 - ((p.price - minPrice) / range) * 130;
    return { x, y, price: p.price, volume: p.volume };
  });

  const svgPolyline = chartPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');
  const svgArea = `${chartPoints[0]?.x || 0},170 ${svgPolyline} ${chartPoints[chartPoints.length - 1]?.x || 500},170`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Token Selector & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0b101b] p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-slate-400">Switch Token:</span>
          <select
            value={selectedToken.id}
            onChange={(e) => {
              const tok = tokens.find((t) => t.id === e.target.value);
              if (tok) onSelectToken(tok);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none"
          >
            {tokens.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (${t.symbol}) - {t.isUserCreated ? '★ Created By You' : SUPPORTED_CHAINS[t.chainId]?.shortName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {selectedToken.isUserCreated && (
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Admin Mode
            </span>
          )}

          <button
            onClick={onOpenCreate}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
          >
            + Launch Another Token
          </button>
        </div>
      </div>

      {/* Hero Token Overview Card */}
      <div className="bg-[#0b101b] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={selectedToken.logoUrl}
              alt={selectedToken.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700 shadow-xl bg-slate-950"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {selectedToken.name}
                </h1>
                <span className="text-sm sm:text-base font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                  ${selectedToken.symbol}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                  <span>{chain.icon}</span>
                  <span>{chain.name}</span>
                </span>
                {selectedToken.isGraduated ? (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    🚀 GRADUATED TO DEX
                  </span>
                ) : (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    🔥 FLAP BONDING CURVE
                  </span>
                )}
              </div>

              {/* Contract address copy bar */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400 font-mono">Contract:</span>
                <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 font-mono text-xs text-emerald-400">
                  <span>{selectedToken.contractAddress.slice(0, 10)}...{selectedToken.contractAddress.slice(-8)}</span>
                  <button
                    onClick={handleCopyContract}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy Contract"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <a
                  href={`${chain.explorerUrl}/token/${selectedToken.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Socials & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedToken.website && (
              <a
                href={selectedToken.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {selectedToken.twitter && (
              <a
                href={selectedToken.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {selectedToken.telegram && (
              <a
                href={selectedToken.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => setShowAirdrop(!showAirdrop)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Airdrop Tool</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mt-4 max-w-3xl leading-relaxed">
          {selectedToken.description}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Market Cap</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              ${selectedToken.marketCapUSD.toLocaleString()}
            </div>
            <div className={`text-[11px] font-mono flex items-center gap-1 mt-1 ${
              selectedToken.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {selectedToken.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h}% (24h)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Token Price</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              ${selectedToken.currentPriceUSD.toFixed(7)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              ≈ {(selectedToken.currentPrice * 1e6).toFixed(4)} μ{chain.nativeCurrency.symbol}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Bonding Reserve</span>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {selectedToken.reserveBalance.toFixed(2)} {chain.nativeCurrency.symbol}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              ≈ ${(selectedToken.reserveBalance * chain.nativeCurrency.priceUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Total Holders</span>
            <div className="text-lg font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{selectedToken.holdersCount.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              +14 today
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">24h Volume</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              ${selectedToken.volume24hUSD.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {tokenTrades.length} trades recorded
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Circulating Supply</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {selectedToken.circulatingSupply >= 1_000_000_000 
                ? `${(selectedToken.circulatingSupply / 1_000_000_000).toFixed(1)}B`
                : `${(selectedToken.circulatingSupply / 1_000_000).toFixed(0)}M`}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              of {selectedToken.totalSupply >= 1_000_000_000 ? `${selectedToken.totalSupply / 1_000_000_000}B` : `${selectedToken.totalSupply / 1_000_000}M`}
            </div>
          </div>
        </div>

        {/* Bonding Curve Progress Bar Section */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                Bonding Curve Graduation Progress
              </span>
              <p className="text-xs text-slate-400">
                When market cap reaches ${selectedToken.bondingTargetUSD.toLocaleString()} (100%), all liquidity is automatically deposited to PancakeSwap / Uniswap and burned forever.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-400 font-mono">
                {selectedToken.bondingProgress}%
              </span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-lg shadow-emerald-500/50 transition-all duration-500"
              style={{ width: `${Math.min(100, selectedToken.bondingProgress)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-2">
            <span>Current: ${(selectedToken.marketCapUSD).toLocaleString()}</span>
            <span>Target: ${(selectedToken.bondingTargetUSD).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Airdrop Tool Subpanel (if toggled) */}
      {showAirdrop && (
        <div className="bg-[#0b101b] border border-amber-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Startup Token Airdrop Simulator</h3>
            </div>
            <button
              onClick={() => setShowAirdrop(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Distribute tokens directly to early community members, testers, or ambassadors without impacting the automated bonding curve pricing.
          </p>

          <form onSubmit={handleSendAirdrop} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Recipient Address (0x...)"
              value={airdropAddress}
              onChange={(e) => setAirdropAddress(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none focus:border-amber-400"
            />
            <input
              type="number"
              required
              placeholder="Amount of tokens"
              value={airdropAmount}
              onChange={(e) => setAirdropAmount(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Distribute Airdrop
            </button>
          </form>

          {airdropSuccess && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Airdrop of {parseFloat(airdropAmount).toLocaleString()} ${selectedToken.symbol} successfully sent to {airdropAddress.slice(0, 10)}...!</span>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Price Chart (Left) + Interactive Swap / Trade Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Price Chart & History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0b101b] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Live Bonding Curve Price</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  ${selectedToken.currentPriceUSD.toFixed(7)}
                </div>
              </div>

              {/* Timeframe Pills */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['1H', '24H', '7D', '1M'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      timeframe === tf
                        ? 'bg-slate-800 text-emerald-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive Area Price Chart */}
            <div className="w-full h-48 relative overflow-hidden bg-slate-950/40 rounded-2xl border border-slate-900 p-2">
              <svg 
                viewBox="0 0 500 170" 
                preserveAspectRatio="none" 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Filled Area */}
                <polygon points={svgArea} fill="url(#curveGradient)" />

                {/* Main line */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPolyline}
                />

                {/* Glowing points */}
                {chartPoints.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === chartPoints.length - 1 ? 4.5 : 2.5}
                    fill="#10B981"
                    stroke="#080B11"
                    strokeWidth="1.5"
                    className={i === chartPoints.length - 1 ? 'animate-pulse' : ''}
                  />
                ))}
              </svg>

              {/* Min/Max indicators */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-500">
                High: ${(Math.max(...selectedToken.priceHistory.map((h) => h.price))).toFixed(7)}
              </div>
              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
                Low: ${(Math.min(...selectedToken.priceHistory.map((h) => h.price))).toFixed(7)}
              </div>
            </div>
          </div>

          {/* Trade Activity / Launch History Table */}
          <div className="bg-[#0b101b] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Recent Bonding Curve Transactions
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Real-time Swaps
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Amount ({selectedToken.symbol})</th>
                    <th className="pb-3 font-semibold">{chain.nativeCurrency.symbol} Value</th>
                    <th className="pb-3 font-semibold">USD</th>
                    <th className="pb-3 font-semibold">Trader</th>
                    <th className="pb-3 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tokenTrades.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No transactions recorded yet. Be the first to buy on this curve!
                      </td>
                    </tr>
                  ) : (
                    tokenTrades.map((tr) => (
                      <tr key={tr.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tr.type === 'BUY'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {tr.type}
                          </span>
                        </td>
                        <td className="py-3 text-white font-medium">
                          {tr.amountToken.toLocaleString()}
                        </td>
                        <td className="py-3 text-slate-300">
                          {tr.amountNative.toFixed(4)} {chain.nativeCurrency.symbol}
                        </td>
                        <td className="py-3 text-slate-400">
                          ${tr.amountUSD.toFixed(2)}
                        </td>
                        <td className="py-3 text-slate-400">
                          <a
                            href={`${chain.explorerUrl}/address/${tr.traderAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-400 transition-colors"
                          >
                            {tr.traderAddress}
                          </a>
                        </td>
                        <td className="py-3 text-right text-slate-500">
                          {Math.max(1, Math.round((Date.now() - tr.timestamp) / 60000))}m ago
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Automated Bonding Curve Swap / Trade Simulator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b101b] border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Bonding Curve Swap
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Slippage 0.5%
              </span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl mb-4 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSwapTab('BUY');
                  setSwapAmount('0.1');
                }}
                className={`py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  swapTab === 'BUY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                BUY {selectedToken.symbol}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSwapTab('SELL');
                  setSwapAmount('1000000');
                }}
                className={`py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  swapTab === 'SELL'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SELL {selectedToken.symbol}
              </button>
            </div>

            <form onSubmit={handleExecuteTrade} className="space-y-4">
              {/* Pay Input */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>You Pay</span>
                  <span>
                    Bal: {wallet.balanceNative.toFixed(3)} {chain.nativeCurrency.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="number"
                    step="any"
                    min="0.0001"
                    required
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="w-full bg-transparent text-xl font-mono font-bold text-white outline-none"
                    placeholder="0.0"
                  />
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-white flex-shrink-0">
                    {swapTab === 'BUY' ? chain.nativeCurrency.symbol : selectedToken.symbol}
                  </span>
                </div>
              </div>

              {/* Estimated Receive */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>You Receive (Est.)</span>
                  <span>Price Impact ~0.8%</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-mono font-bold text-emerald-400 truncate">
                    {swapTab === 'BUY'
                      ? estTokensOut.toLocaleString()
                      : estNativeOut}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-white flex-shrink-0">
                    {swapTab === 'BUY' ? selectedToken.symbol : chain.nativeCurrency.symbol}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {swapTab === 'BUY' ? (
                  ['0.05', '0.1', '0.5', '1.0'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setSwapAmount(amt)}
                      className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                    >
                      {amt}
                    </button>
                  ))
                ) : (
                  ['25%', '50%', '75%', '100%'].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => setSwapAmount('2500000')}
                      className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                    >
                      {pct}
                    </button>
                  ))
                )}
              </div>

              {/* Fee notice */}
              <div className="text-[11px] font-mono text-slate-400 space-y-1 border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between">
                  <span>Routing:</span>
                  <span className="text-slate-300">Flap Bonding Curve</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Trading Fee:</span>
                  <span className="text-slate-300">0.25%</span>
                </div>
                {selectedToken.tokenType === 'tax' && (
                  <div className="flex items-center justify-between text-purple-300">
                    <span>Tax Fee:</span>
                    <span>{selectedToken.taxBuyRate || 2}%</span>
                  </div>
                )}
              </div>

              {/* Trade Button */}
              <button
                type="submit"
                disabled={swapLoading}
                className={`w-full py-3 rounded-xl font-extrabold text-sm shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                  swapTab === 'BUY'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-rose-500/20'
                }`}
              >
                {swapLoading
                  ? 'Executing Web3 Swap...'
                  : `${swapTab} ${selectedToken.symbol}`}
              </button>

              {swapSuccessMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center">
                  {swapSuccessMessage}
                </div>
              )}
            </form>

            {/* Smart Contract Security Badges */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ownership Renounced</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>LP Burn on Graduation</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  AUTO-100%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
