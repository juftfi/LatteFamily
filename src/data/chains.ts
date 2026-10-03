import { ChainConfig } from '../types';

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  56: {
    id: 56,
    name: 'BNB Smart Chain',
    shortName: 'BSC',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      priceUSD: 590.25,
    },
    rpcUrl: 'https://binance.llamarpc.com',
    explorerUrl: 'https://bscscan.com',
    icon: '🟡',
    color: '#F3BA2F',
    mintingFee: 0.015, // ~ $8.85
    flapContracts: {
      launchpad: '0x1de460f363AF910f51726DEf188F9004276Bf4bc',
      portal: '0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0',
      standardTokenImpl: '0x88881b6f03090462a969eC7f48385744Eeb63333',
      taxTokenImpl: '0x024f18294970B5c76c0691b87f138A0317156422',
      vaultFactory: '0x7777a941656041B1F34614C808E58514101e4a64',
    },
  },
  8453: {
    id: 8453,
    name: 'Base',
    shortName: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      priceUSD: 2680.50,
    },
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    icon: '🔵',
    color: '#0052FF',
    mintingFee: 0.003, // ~ $8.04
    flapContracts: {
      launchpad: '0x1de460f363AF910f51726DEf188F9004276Bf4bc',
      portal: '0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0',
      standardTokenImpl: '0x88881b6f03090462a969eC7f48385744Eeb63333',
      taxTokenImpl: '0x024f18294970B5c76c0691b87f138A0317156422',
      vaultFactory: '0x7777a941656041B1F34614C808E58514101e4a64',
    },
  },
  137: {
    id: 137,
    name: 'Polygon PoS',
    shortName: 'Polygon',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18,
      priceUSD: 0.42,
    },
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    icon: '🟣',
    color: '#8247E5',
    mintingFee: 18.0, // ~ $7.56
    flapContracts: {
      launchpad: '0x1de460f363AF910f51726DEf188F9004276Bf4bc',
      portal: '0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0',
      standardTokenImpl: '0x88881b6f03090462a969eC7f48385744Eeb63333',
      taxTokenImpl: '0x024f18294970B5c76c0691b87f138A0317156422',
      vaultFactory: '0x7777a941656041B1F34614C808E58514101e4a64',
    },
  },
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
      priceUSD: 2680.50,
    },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    icon: '🔷',
    color: '#28A0F0',
    mintingFee: 0.003, // ~ $8.04
    flapContracts: {
      launchpad: '0x1de460f363AF910f51726DEf188F9004276Bf4bc',
      portal: '0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0',
      standardTokenImpl: '0x88881b6f03090462a969eC7f48385744Eeb63333',
      taxTokenImpl: '0x024f18294970B5c76c0691b87f138A0317156422',
      vaultFactory: '0x7777a941656041B1F34614C808E58514101e4a64',
    },
  },
  196: {
    id: 196,
    name: 'X Layer (OKX)',
    shortName: 'X Layer',
    nativeCurrency: {
      name: 'OKB',
      symbol: 'OKB',
      decimals: 18,
      priceUSD: 48.30,
    },
    rpcUrl: 'https://rpc.xlayer.tech',
    explorerUrl: 'https://www.okx.com/explorer/xlayer',
    icon: '⬛',
    color: '#000000',
    mintingFee: 0.18, // ~ $8.69
    flapContracts: {
      launchpad: '0x1de460f363AF910f51726DEf188F9004276Bf4bc',
      portal: '0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0',
      standardTokenImpl: '0x88881b6f03090462a969eC7f48385744Eeb63333',
      taxTokenImpl: '0x024f18294970B5c76c0691b87f138A0317156422',
      vaultFactory: '0x7777a941656041B1F34614C808E58514101e4a64',
    },
  },
  10143: {
    id: 10143,
    name: 'Monad Testnet',
    shortName: 'Monad',
    nativeCurrency: {
      name: 'Monad',
      symbol: 'MON',
      decimals: 18,
      priceUSD: 1.0,
    },
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    explorerUrl: 'https://testnet.monadexplorer.com',
    icon: '🟣',
    color: '#836EF9',
    mintingFee: 0.05,
    isTestnet: true,
    flapContracts: {
      launchpad: '0x1de460f363AF910f51726DEf188F9004276Bf4bc',
      portal: '0xe2cE6ab80874Fa9Fa2aAE65D277Dd6B8e65C9De0',
      standardTokenImpl: '0x88881b6f03090462a969eC7f48385744Eeb63333',
      taxTokenImpl: '0x024f18294970B5c76c0691b87f138A0317156422',
      vaultFactory: '0x7777a941656041B1F34614C808E58514101e4a64',
    },
  },
};

export const DEFAULT_CHAIN_ID = 56; // BNB Chain as Flap primary chain
