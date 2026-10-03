import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Coins
} from 'lucide-react';
import { SupportedChainId, TokenMetadata, DeploymentProgress } from '../types';
import { SUPPORTED_CHAINS } from '../data/chains';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: DeploymentProgress;
  tokenData: Partial<TokenMetadata> | null;
  onViewDashboard: (token: TokenMetadata) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  progress,
  tokenData,
  onViewDashboard,
}) => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const chain = tokenData?.chainId ? SUPPORTED_CHAINS[tokenData.chainId] : SUPPORTED_CHAINS[56];

  useEffect(() => {
    if (progress.status === 'success') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#6366F1', '#F59E0B'],
      });
    }
  }, [progress.status]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'contract' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'contract') {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const steps = [
    { step: 1, label: 'Metadata & IPFS Spec', desc: 'Encoding token parameters, logo URI & bonding curve params' },
    { step: 2, label: 'Wallet Signature & Launchpad Fee', desc: `Processing automated minting fee (${chain.mintingFee} ${chain.nativeCurrency.symbol})` },
    { step: 3, label: 'Broadcasting to Flap Factory', desc: `Target: ${chain.flapContracts.launchpad.slice(0, 10)}...${chain.flapContracts.launchpad.slice(-6)}` },
    { step: 4, label: 'Contract Clone & Vanity Instantiation', desc: tokenData?.tokenType === 'tax' ? 'Flap Tax Token V3 (Ends in 7777)' : 'Flap Standard Token V3 (Ends in 8888)' },
    { step: 5, label: 'Portal Registration & Liquidity Curve', desc: 'Bonding curve ready for immediate zero-slippage swaps' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0c121e] border border-slate-700/80 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 mb-3 shadow-inner">
            {progress.status === 'success' ? (
              <Sparkles className="w-7 h-7 text-emerald-400 animate-bounce" />
            ) : progress.status === 'failed' ? (
              <AlertCircle className="w-7 h-7 text-rose-400" />
            ) : (
              <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {progress.status === 'success'
              ? 'Token Deployed Successfully!'
              : progress.status === 'failed'
              ? 'Deployment Transaction Failed'
              : 'Deploying Token to Blockchain...'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {progress.message || 'Interacting with Flap.sh smart contract protocols'}
          </p>
        </div>

        {/* Real-Time Step Pipeline */}
        <div className="space-y-3 my-6 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
          {steps.map((s) => {
            const isCompleted = progress.step > s.step || progress.status === 'success';
            const isCurrent = progress.step === s.step && progress.status !== 'success' && progress.status !== 'failed';
            const isPending = progress.step < s.step && progress.status !== 'success';

            return (
              <div 
                key={s.step} 
                className={`flex items-start gap-3 transition-opacity ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[10px] flex items-center justify-center font-mono">
                      {s.step}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isCompleted ? 'text-emerald-300' : isCurrent ? 'text-cyan-300' : 'text-slate-300'}`}>
                      {s.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-cyan-400 font-mono animate-pulse">
                        In Progress...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Details Box */}
        {progress.status === 'success' && progress.contractAddress && (
          <div className="space-y-3 my-5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">New Token Smart Contract:</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                VERIFIED FLAP CLONE
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
              <code className="text-xs text-emerald-400 font-mono break-all select-all">
                {progress.contractAddress}
              </code>
              <button
                onClick={() => copyToClipboard(progress.contractAddress!, 'contract')}
                className="ml-2 p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy Address"
              >
                {copiedContract ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {progress.txHash && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
                <span>Tx Hash:</span>
                <a
                  href={`${chain.explorerUrl}/tx/${progress.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>{progress.txHash.slice(0, 10)}...{progress.txHash.slice(-8)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Failed Details Box */}
        {progress.status === 'failed' && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs mb-4">
            <div className="font-semibold mb-1">Transaction Failed</div>
            <p className="text-rose-200/80">{progress.error || 'User rejected the transaction or insufficient funds for gas.'}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          {progress.status === 'success' ? (
            <>
              <a
                href={`${chain.explorerUrl}/token/${progress.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  onClose();
                  if (tokenData) {
                    onViewDashboard(tokenData as TokenMetadata);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <span>Open Token Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </>
          ) : progress.status === 'failed' ? (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              Close & Try Again
            </button>
          ) : (
            <div className="w-full text-center py-2 text-xs text-slate-400 font-mono">
              Please do not close this window until the transaction finishes...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
