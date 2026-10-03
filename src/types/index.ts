export type SupportedChainId = 56 | 8453 | 137 | 42161 | 196 | 10143;

export type ProtocolType = 'flap' | 'brew' | 'four';

export interface ChainConfig {
  id: SupportedChainId;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
    priceUSD: number;
  };
  rpcUrl: string;
  explorerUrl: string;
  icon: string;
  color: string;
  mintingFee: number; // in native currency
  isTestnet?: boolean;
  flapContracts: {
    launchpad: string;
    portal: string;
    standardTokenImpl: string;
    taxTokenImpl: string;
    vaultFactory: string;
  };
}

export type TokenType = 'standard' | 'tax';

export interface TokenMetadata {
  id: string;
  name: string;
  symbol: string;
  description: string;
  logoUrl: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  chainId: SupportedChainId;
  tokenType: TokenType;
  taxBuyRate?: number; // e.g. 2%
  taxSellRate?: number; // e.g. 2%
  taxReceiver?: string;
  contractAddress: string;
  creatorAddress: string;
  txHash: string;
  blockNumber: number;
  createdAt: number;
  totalSupply: number;
  circulatingSupply: number;
  currentPrice: number; // in native currency
  currentPriceUSD: number;
  priceChange24h: number; // percentage +/-
  marketCapUSD: number;
  reserveBalance: number; // Native coin in bonding curve
  bondingTargetUSD: number; // usually $69,000 for graduation
  bondingProgress: number; // 0 to 100%
  holdersCount: number;
  volume24hUSD: number;
  isGraduated: boolean;
  isUserCreated?: boolean;
  priceHistory: { timestamp: number; price: number; volume: number }[];
}

export interface TradeTransaction {
  id: string;
  tokenAddress: string;
  type: 'BUY' | 'SELL';
  amountToken: number;
  amountNative: number;
  amountUSD: number;
  traderAddress: string;
  txHash: string;
  timestamp: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: SupportedChainId;
  balanceNative: number;
  walletName: 'MetaMask' | 'OKX Wallet' | 'Coinbase' | 'Demo Wallet' | null;
  isDemo: boolean;
}

export type DeploymentStatus = 'idle' | 'preparing' | 'signing' | 'broadcasting' | 'confirming' | 'success' | 'failed';

export interface DeploymentProgress {
  status: DeploymentStatus;
  step: number; // 1 to 5
  message: string;
  txHash?: string;
  contractAddress?: string;
  error?: string;
}
