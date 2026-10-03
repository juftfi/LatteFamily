import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { SUPPORTED_CHAINS } from '../data/chains';
import { SupportedChainId, TokenMetadata, TokenType, DeploymentProgress } from '../types';
import { DeployModal } from './DeployModal';
import { 
  Rocket, 
  Sparkles, 
  Shield, 
  Globe, 
  Twitter, 
  Send, 
  Github, 
  Info, 
  Image as ImageIcon, 
  DollarSign, 
  Zap, 
  Layers, 
  Flame,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TokenCreationFormProps {
  onTokenCreated: (token: TokenMetadata) => void;
  onViewDashboard: (token: TokenMetadata) => void;
}

const SAMPLE_LOGOS = [
  { name: 'AI Core', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
  { name: 'Quantum', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80' },
  { name: 'Cyber Mesh', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&auto=format&fit=crop&q=80' },
  { name: 'Fintech Gold', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&auto=format&fit=crop&q=80' },
  { name: 'Neon Doge', url: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=200&auto=format&fit=crop&q=80' },
];

export const TokenCreationForm: React.FC<TokenCreationFormProps> = ({
  onTokenCreated,
  onViewDashboard,
}) => {
  const { wallet, connectWallet, switchChain, executeContractPayment, faucetDemo } = useWallet();

  // Form states
  const [selectedChainId, setSelectedChainId] = useState<SupportedChainId>(wallet.chainId || 56);
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState(SAMPLE_LOGOS[0].url);
  const [supply, setSupply] = useState<number>(1_000_000_000);
  const [tokenType, setTokenType] = useState<TokenType>('standard');
  const [taxRate, setTaxRate] = useState<number>(2); // 2% buy/sell
  const [devBuyAmount, setDevBuyAmount] = useState<number>(0); // native currency

  // Socials
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [github, setGithub] = useState('');

  // Deployment progress modal
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState<DeploymentProgress>({
    status: 'idle',
    step: 1,
    message: '',
  });
  const [createdToken, setCreatedToken] = useState<TokenMetadata | null>(null);

  const currentChain = SUPPORTED_CHAINS[selectedChainId] || SUPPORTED_CHAINS[56];
  const totalCost = currentChain.mintingFee + 0.002 + devBuyAmount; // minting fee + estimated gas + dev buy
  const hasEnoughBalance = wallet.isConnected && wallet.balanceNative >= totalCost;

  const handleSelectPresetSupply = (amount: number) => {
    setSupply(amount);
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !symbol.trim()) {
      alert('Please enter a valid Token Name and Symbol');
      return;
    }

    if (!wallet.isConnected) {
      await connectWallet('auto');
      return;
    }

    // Ensure wallet is on the selected chain
    if (wallet.chainId !== selectedChainId) {
      await switchChain(selectedChainId);
    }

    setIsDeploying(true);
    setProgress({
      status: 'preparing',
      step: 1,
      message: 'Encoding metadata, IPFS manifest and Flap contract parameters...',
    });

    try {
      // Step 1: Simulated IPFS Hashing
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Step 2: Request Wallet Signature & Minting Fee
      setProgress({
        status: 'signing',
        step: 2,
        message: `Requesting transaction authorization for ${totalCost.toFixed(4)} ${currentChain.nativeCurrency.symbol}...`,
      });

      const { txHash, blockNumber } = await executeContractPayment({
        to: currentChain.flapContracts.launchpad,
        amountNative: totalCost,
        description: `Deploy Flap Token: ${symbol}`,
      });

      // Step 3: Broadcast to Flap Factory
      setProgress({
        status: 'broadcasting',
        step: 3,
        message: `Broadcasting deploy to Flap Factory (${currentChain.flapContracts.launchpad.slice(0, 10)}...)...`,
        txHash,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Clone & Vanity Generation
      const vanitySuffix = tokenType === 'tax' ? '7777' : '8888';
      const randomMiddle = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const generatedContract = `0x${randomMiddle.slice(0, 6)}${vanitySuffix}${randomMiddle.slice(10, 36)}${vanitySuffix}`;

      setProgress({
        status: 'confirming',
        step: 4,
        message: `Contract verified! Registering to Flap Portal: ${currentChain.flapContracts.portal.slice(0, 10)}...`,
        txHash,
        contractAddress: generatedContract,
      });
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 5: Liquidity Pool Initialized & Token Metadata assembled
      const initialPriceUSD = 0.000030; // base starting bonding curve price
      const marketCapUSD = Math.round(supply * initialPriceUSD);
      const initialReserve = devBuyAmount > 0 ? devBuyAmount : 0.5;

      const newToken: TokenMetadata = {
        id: `token-${Date.now()}-${symbol.toLowerCase()}`,
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        description: description.trim() || 'A breakthrough decentralized startup protocol launched with automated bonding curve liquidity.',
        logoUrl: logoUrl || SAMPLE_LOGOS[0].url,
        website: website.trim() || undefined,
        twitter: twitter.trim() || undefined,
        telegram: telegram.trim() || undefined,
        github: github.trim() || undefined,
        chainId: selectedChainId,
        tokenType,
        taxBuyRate: tokenType === 'tax' ? taxRate : undefined,
        taxSellRate: tokenType === 'tax' ? taxRate : undefined,
        taxReceiver: tokenType === 'tax' ? wallet.address || undefined : undefined,
        contractAddress: generatedContract,
        creatorAddress: wallet.address || '0x000000000000000000000000000000000000dEaD',
        txHash,
        blockNumber,
        createdAt: Date.now(),
        totalSupply: supply,
        circulatingSupply: Math.round(supply * 0.7),
        currentPrice: initialPriceUSD / currentChain.nativeCurrency.priceUSD,
        currentPriceUSD: initialPriceUSD,
        priceChange24h: 0.0,
        marketCapUSD: marketCapUSD,
        reserveBalance: initialReserve,
        bondingTargetUSD: 69000,
        bondingProgress: parseFloat(((marketCapUSD / 69000) * 100).toFixed(1)),
        holdersCount: 1 + (devBuyAmount > 0 ? 1 : 0),
        volume24hUSD: devBuyAmount * currentChain.nativeCurrency.priceUSD,
        isGraduated: false,
        isUserCreated: true,
        priceHistory: [
          { timestamp: Date.now() - 3600000, price: initialPriceUSD * 0.95, volume: 500 },
          { timestamp: Date.now(), price: initialPriceUSD, volume: devBuyAmount * currentChain.nativeCurrency.priceUSD },
        ],
      };

      setCreatedToken(newToken);
      onTokenCreated(newToken);

      setProgress({
        status: 'success',
        step: 5,
        message: `Token ${newToken.symbol} is live on ${currentChain.name}!`,
        txHash,
        contractAddress: generatedContract,
      });

    } catch (err: any) {
      console.error('Deployment error:', err);
      setProgress({
        status: 'failed',
        step: 2,
        message: 'Deployment failed',
        error: err.message || 'Transaction rejected by user or insufficient network gas.',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Flame className="w-3.5 h-3.5" />
          <span>Flap Factory Contract Deployment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Launch Your Startup Token
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
          Instantly deploy an automated bonding curve smart contract powered by Flap.sh protocol. 
          Zero initial liquidity required — tokens trade immediately with automatic graduation to decentralized exchanges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Token Creation Form */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <form onSubmit={handleDeploy} className="space-y-6">
            {/* 1. Chain Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Deployment Network
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.values(SUPPORTED_CHAINS).map((chain) => {
                  const isSelected = chain.id === selectedChainId;
                  return (
                    <button
                      type="button"
                      key={chain.id}
                      onClick={() => {
                        setSelectedChainId(chain.id);
                        if (wallet.isConnected && wallet.chainId !== chain.id) {
                          switchChain(chain.id);
                        }
                      }}
                      className={`flex flex-col items-center p-2.5 rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xl mb-1">{chain.icon}</span>
                      <span className="text-xs font-bold leading-tight">{chain.shortName}</span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {chain.nativeCurrency.symbol}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                <span>Flap Factory Contract:</span>
                <span className="text-emerald-400">
                  {currentChain.flapContracts.launchpad}
                </span>
              </div>
            </div>

            {/* 2. Token Name & Ticker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Token Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flap Protocol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Symbol / Ticker <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-sm">$</span>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="FLAP"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white text-sm font-mono uppercase tracking-wider transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 3. Total Supply Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Total Supply
                </label>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  {supply.toLocaleString()} {symbol || 'TOKENS'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[100_000_000, 1_000_000_000, 10_000_000_000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => handleSelectPresetSupply(amt)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                      supply === amt
                        ? 'bg-slate-800 text-white border-emerald-500/60 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {amt >= 1_000_000_000 ? `${amt / 1_000_000_000}B` : `${amt / 1_000_000}M`}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Token Type: Standard vs Tax Token */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Smart Contract Implementation (Flap Archetype)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setTokenType('standard')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    tokenType === 'standard'
                      ? 'bg-emerald-500/10 border-emerald-500/60 shadow-inner'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Standard Token V3</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      Ends ...8888
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pure ERC20 / BEP20 with 0% tax. Maximum compatibility across DEXs and CEXs.
                  </p>
                </div>

                <div
                  onClick={() => setTokenType('tax')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    tokenType === 'tax'
                      ? 'bg-purple-500/10 border-purple-500/60 shadow-inner'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Flap Tax Token V3</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                      Ends ...7777
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Built-in customizable fee on transfers to fund startup dev treasury or LP auto-burn.
                  </p>
                </div>
              </div>

              {tokenType === 'tax' && (
                <div className="mt-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-purple-200">Protocol Fee Rate</div>
                    <div className="text-[11px] text-purple-300/80">Applied on automated Buy / Sell transactions</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 5].map((rate) => (
                      <button
                        type="button"
                        key={rate}
                        onClick={() => setTaxRate(rate)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                          taxRate === rate
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Project Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Project Description & Pitch
              </label>
              <textarea
                rows={3}
                placeholder="Explain what your startup builds, the utility of your token, roadmap, and bonding curve goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white text-sm transition-all resize-none"
              />
            </div>

            {/* 6. Logo & Avatar Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Token Logo URL
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={logoUrl || SAMPLE_LOGOS[0].url}
                  alt="Token preview"
                  className="w-11 h-11 rounded-xl object-cover border border-slate-700 bg-slate-900 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SAMPLE_LOGOS[0].url;
                  }}
                />
                <input
                  type="url"
                  placeholder="https://... (image url)"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white text-xs font-mono transition-all"
                />
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-400">Presets:</span>
                {SAMPLE_LOGOS.map((sample) => (
                  <button
                    type="button"
                    key={sample.name}
                    onClick={() => setLogoUrl(sample.url)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Social Links */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Project Socials (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center bg-slate-900 rounded-xl px-3 border border-slate-800 focus-within:border-emerald-500">
                  <Globe className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full py-2 bg-transparent text-xs text-white outline-none"
                  />
                </div>

                <div className="flex items-center bg-slate-900 rounded-xl px-3 border border-slate-800 focus-within:border-emerald-500">
                  <Twitter className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    placeholder="https://x.com/project"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full py-2 bg-transparent text-xs text-white outline-none"
                  />
                </div>

                <div className="flex items-center bg-slate-900 rounded-xl px-3 border border-slate-800 focus-within:border-emerald-500">
                  <Send className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    placeholder="https://t.me/project"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full py-2 bg-transparent text-xs text-white outline-none"
                  />
                </div>

                <div className="flex items-center bg-slate-900 rounded-xl px-3 border border-slate-800 focus-within:border-emerald-500">
                  <Github className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    placeholder="https://github.com/project"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full py-2 bg-transparent text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 8. Initial Dev Buy (Optional) */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Initial Dev Buy (Optional)
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {devBuyAmount} {currentChain.nativeCurrency.symbol}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Be the very first buyer on your bonding curve. Buying initial supply ensures you hold skin-in-the-game at the best price.
              </p>
              <div className="flex items-center gap-2">
                {[0, 0.05, 0.1, 0.25, 0.5].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setDevBuyAmount(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                      devBuyAmount === val
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {val === 0 ? 'None' : `${val}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 9. Cost Breakdown & Automated Payment Summary */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Flap Protocol Minting Fee:</span>
                <span>{currentChain.mintingFee} {currentChain.nativeCurrency.symbol}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Estimated Network Gas:</span>
                <span>~0.002 {currentChain.nativeCurrency.symbol}</span>
              </div>
              {devBuyAmount > 0 && (
                <div className="flex items-center justify-between text-amber-300 text-[11px]">
                  <span>Creator Seed Purchase:</span>
                  <span>+{devBuyAmount} {currentChain.nativeCurrency.symbol}</span>
                </div>
              )}
              <div className="border-t border-emerald-500/20 pt-2 flex items-center justify-between text-white font-bold text-sm">
                <span>Total Payment:</span>
                <span className="text-emerald-400">
                  {totalCost.toFixed(4)} {currentChain.nativeCurrency.symbol}
                  <span className="text-[11px] font-normal text-slate-400 ml-1.5">
                    (≈ ${(totalCost * currentChain.nativeCurrency.priceUSD).toFixed(2)})
                  </span>
                </span>
              </div>
            </div>

            {/* Low balance alert / Faucet button */}
            {wallet.isConnected && !hasEnoughBalance && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Insufficient balance ({wallet.balanceNative.toFixed(3)} {currentChain.nativeCurrency.symbol})</span>
                </div>
                <button
                  type="button"
                  onClick={() => faucetDemo(2.0)}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 cursor-pointer"
                >
                  Faucet +2.0
                </button>
              </div>
            )}

            {/* Deploy Button */}
            <button
              type="submit"
              disabled={isDeploying}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Rocket className="w-5 h-5 text-slate-950" />
              <span>Deploy Token via Flap Factory</span>
            </button>
          </form>
        </div>

        {/* Right: Live Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b101b] border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Live Launch Card Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                NEW LAUNCH
              </span>
            </div>

            {/* Preview Card Body */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={logoUrl || SAMPLE_LOGOS[0].url}
                  alt="preview"
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md bg-slate-950"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SAMPLE_LOGOS[0].url;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white truncate">
                      {name || 'Your Startup Token'}
                    </h3>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      ${symbol || 'TICKER'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                    <span>{currentChain.icon} {currentChain.name}</span>
                    <span>•</span>
                    <span className="capitalize">{tokenType}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {description || 'Token description will appear here as soon as you type it in the form. Investors can read this before bonding curve swaps.'}
              </p>

              {/* Bonding Curve Meter */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Bonding Curve Progress</span>
                  <span className="text-emerald-400 font-bold">
                    {devBuyAmount > 0 ? '4.8%' : '0.5%'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                    style={{ width: devBuyAmount > 0 ? '4.8%' : '0.5%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Start: $30,000 MC</span>
                  <span>Target: $69,000 to DEX</span>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total Supply</span>
                  <span className="text-white font-semibold">
                    {supply >= 1_000_000_000 ? `${supply / 1_000_000_000}B` : `${supply / 1_000_000}M`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Initial Price</span>
                  <span className="text-emerald-400 font-semibold">$0.000030</span>
                </div>
              </div>
            </div>

            {/* Safety & Protocol Guarantees */}
            <div className="mt-5 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Fair launch: No private presale or team allocation locks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated liquidity migration when target ($69k) is reached</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Burned LP tokens & immutable smart contract guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Modal */}
      <DeployModal
        isOpen={isDeploying}
        onClose={() => setIsDeploying(false)}
        progress={progress}
        tokenData={createdToken || {
          name,
          symbol,
          chainId: selectedChainId,
          tokenType,
        }}
        onViewDashboard={onViewDashboard}
      />
    </div>
  );
};
