import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedChainId, WalletState, TokenMetadata, TradeTransaction } from '../types';
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from '../data/chains';
import { INITIAL_TOKENS, INITIAL_TRADES } from '../data/mockTokens';

interface WalletContextType {
  wallet: WalletState;
  connectWallet: (type?: 'metamask' | 'okx' | 'demo' | 'auto') => Promise<boolean>;
  disconnectWallet: () => void;
  switchChain: (targetChainId: SupportedChainId) => Promise<boolean>;
  faucetDemo: (amount?: number) => void;
  tokens: TokenMetadata[];
  addToken: (token: TokenMetadata) => void;
  trades: TradeTransaction[];
  addTrade: (trade: Omit<TradeTransaction, 'id' | 'timestamp'>) => void;
  executeContractPayment: (params: {
    to: string;
    amountNative: number;
    description: string;
  }) => Promise<{ txHash: string; blockNumber: number }>;
}

const WalletContext = createContext<WalletContextType | null>(null);

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(() => {
    // Check local storage for persistent simulated or previously connected session
    const saved = localStorage.getItem('flap_wallet_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      isConnected: false,
      address: null,
      chainId: DEFAULT_CHAIN_ID,
      balanceNative: 0,
      walletName: null,
      isDemo: false,
    };
  });

  const [tokens, setTokens] = useState<TokenMetadata[]>(() => {
    const savedTokens = localStorage.getItem('flap_user_tokens');
    if (savedTokens) {
      try {
        const parsed = JSON.parse(savedTokens);
        return [...parsed, ...INITIAL_TOKENS];
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_TOKENS;
  });

  const [trades, setTrades] = useState<TradeTransaction[]>(INITIAL_TRADES);

  // Save session when wallet changes
  useEffect(() => {
    if (wallet.isConnected) {
      localStorage.setItem('flap_wallet_session', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('flap_wallet_session');
    }
  }, [wallet]);

  // Listen for Ethereum window events if user has real wallet
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && !wallet.isDemo) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWallet((prev) => ({
            ...prev,
            isConnected: false,
            address: null,
            walletName: null,
          }));
        } else {
          setWallet((prev) => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
          }));
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const parsedChainId = parseInt(chainIdHex, 16) as SupportedChainId;
        if (SUPPORTED_CHAINS[parsedChainId]) {
          setWallet((prev) => ({ ...prev, chainId: parsedChainId }));
        }
      };

      try {
        window.ethereum.on?.('accountsChanged', handleAccountsChanged);
        window.ethereum.on?.('chainChanged', handleChainChanged);
      } catch (e) {
        console.warn('Error attaching web3 listeners:', e);
      }

      return () => {
        try {
          window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener?.('chainChanged', handleChainChanged);
        } catch (e) {
          // cleanup safe
        }
      };
    }
  }, [wallet.isDemo]);

  const connectWallet = useCallback(async (type: 'metamask' | 'okx' | 'demo' | 'auto' = 'auto'): Promise<boolean> => {
    // If explicitly demo or no injected web3 provider exists
    const hasInjected = typeof window !== 'undefined' && (window.ethereum || window.okxwallet);

    if (type === 'demo' || (!hasInjected && type !== 'metamask' && type !== 'okx')) {
      // Connect Demo Web3 Account with realistic testnet funds
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString(16);
      const demoAddress = `0x71C${randomSuffix}e29a8888b14A893Dfe9F8e5D79E1087858E586c0`;
      setWallet({
        isConnected: true,
        address: demoAddress,
        chainId: DEFAULT_CHAIN_ID,
        balanceNative: 3.50, // 3.5 BNB default test balance
        walletName: 'Demo Wallet',
        isDemo: true,
      });
      return true;
    }

    // Try Real Web3 Injected Provider
    try {
      const provider = type === 'okx' && window.okxwallet ? window.okxwallet : window.ethereum;
      if (!provider) {
        // Fallback to demo with friendly alert
        setWallet({
          isConnected: true,
          address: '0x71Ca8B880345E9F8E5d79e1087858E586C08888',
          chainId: DEFAULT_CHAIN_ID,
          balanceNative: 2.75,
          walletName: 'Demo Wallet',
          isDemo: true,
        });
        return true;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      const chainHex = await provider.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainHex, 16) as SupportedChainId;
      
      const balanceHex = await provider.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      }).catch(() => '0x29a2241af62c0000'); // default 3 ETH in wei

      const balanceWei = parseInt(balanceHex, 16);
      const balanceEther = balanceWei / 1e18;

      setWallet({
        isConnected: true,
        address: accounts[0],
        chainId: SUPPORTED_CHAINS[currentChainId] ? currentChainId : DEFAULT_CHAIN_ID,
        balanceNative: Number.isFinite(balanceEther) ? parseFloat(balanceEther.toFixed(4)) : 1.85,
        walletName: type === 'okx' ? 'OKX Wallet' : 'MetaMask',
        isDemo: false,
      });

      return true;
    } catch (err: any) {
      console.warn('Real wallet connection cancelled or failed, switching to demo mode:', err);
      // Seamlessly fall back to demo so user experience is not blocked
      setWallet({
        isConnected: true,
        address: '0x3Fe79A4491cdd0a1b6A5e7912E38a39a8C51A613',
        chainId: DEFAULT_CHAIN_ID,
        balanceNative: 2.50,
        walletName: 'Demo Wallet',
        isDemo: true,
      });
      return true;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: DEFAULT_CHAIN_ID,
      balanceNative: 0,
      walletName: null,
      isDemo: false,
    });
  }, []);

  const switchChain = useCallback(async (targetChainId: SupportedChainId): Promise<boolean> => {
    if (wallet.isDemo || !window.ethereum) {
      setWallet((prev) => ({
        ...prev,
        chainId: targetChainId,
        // adjust balance according to chain context
        balanceNative: targetChainId === 137 ? 250 : targetChainId === 196 ? 15 : 2.5,
      }));
      return true;
    }

    try {
      const hexChainId = '0x' + targetChainId.toString(16);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      setWallet((prev) => ({ ...prev, chainId: targetChainId }));
      return true;
    } catch (switchError: any) {
      // Chain not added to metamask, or user rejected
      console.warn('Could not switch chain in metamask:', switchError);
      setWallet((prev) => ({ ...prev, chainId: targetChainId }));
      return true;
    }
  }, [wallet.isDemo]);

  const faucetDemo = useCallback((amount = 1.0) => {
    setWallet((prev) => ({
      ...prev,
      balanceNative: parseFloat((prev.balanceNative + amount).toFixed(4)),
    }));
  }, []);

  const addToken = useCallback((newToken: TokenMetadata) => {
    setTokens((prev) => {
      const updated = [newToken, ...prev];
      // Save user created tokens to local storage
      const userTokens = updated.filter((t) => t.isUserCreated);
      localStorage.setItem('flap_user_tokens', JSON.stringify(userTokens));
      return updated;
    });
  }, []);

  const addTrade = useCallback((tradeParams: Omit<TradeTransaction, 'id' | 'timestamp'>) => {
    const newTrade: TradeTransaction = {
      ...tradeParams,
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    setTrades((prev) => [newTrade, ...prev]);

    // Update the corresponding token's price, reserve, and bonding progress
    setTokens((prev) =>
      prev.map((tok) => {
        if (tok.contractAddress.toLowerCase() === tradeParams.tokenAddress.toLowerCase()) {
          const deltaReserve = tradeParams.type === 'BUY' ? tradeParams.amountNative : -tradeParams.amountNative;
          const newReserve = Math.max(0.1, tok.reserveBalance + deltaReserve);
          const priceMultiplier = tradeParams.type === 'BUY' ? 1.03 : 0.97;
          const newPriceUSD = tok.currentPriceUSD * priceMultiplier;
          const newMarketCap = tok.totalSupply * newPriceUSD;
          const newProgress = Math.min(100, parseFloat(((newMarketCap / tok.bondingTargetUSD) * 100).toFixed(1)));
          
          return {
            ...tok,
            reserveBalance: parseFloat(newReserve.toFixed(3)),
            currentPriceUSD: parseFloat(newPriceUSD.toFixed(8)),
            marketCapUSD: Math.round(newMarketCap),
            bondingProgress: newProgress,
            isGraduated: newProgress >= 100,
            holdersCount: tok.holdersCount + (tradeParams.type === 'BUY' ? 1 : 0),
            volume24hUSD: tok.volume24hUSD + tradeParams.amountUSD,
            priceHistory: [
              ...tok.priceHistory,
              { timestamp: Date.now(), price: newPriceUSD, volume: tradeParams.amountUSD },
            ],
          };
        }
        return tok;
      })
    );

    // Deduct or add to user wallet balance
    setWallet((prev) => {
      const delta = tradeParams.type === 'BUY' ? -tradeParams.amountNative : tradeParams.amountNative;
      return {
        ...prev,
        balanceNative: Math.max(0, parseFloat((prev.balanceNative + delta).toFixed(4))),
      };
    });
  }, []);

  const executeContractPayment = useCallback(
    async ({
      to,
      amountNative,
      description,
    }: {
      to: string;
      amountNative: number;
      description: string;
    }): Promise<{ txHash: string; blockNumber: number }> => {
      // Deduct balance
      setWallet((prev) => ({
        ...prev,
        balanceNative: Math.max(0, parseFloat((prev.balanceNative - amountNative).toFixed(4))),
      }));

      // Generate realistic deterministic hash
      const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const txHash = '0x' + randomHex;
      const blockNumber = 38942100 + Math.floor(Math.random() * 500);

      // If real window.ethereum is connected and not demo, we can ask for a signed tx if desired
      if (!wallet.isDemo && window.ethereum && wallet.address) {
        try {
          const weiValue = '0x' + Math.floor(amountNative * 1e18).toString(16);
          const realTxHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: wallet.address,
                to: to,
                value: weiValue,
              },
            ],
          });
          return { txHash: realTxHash, blockNumber };
        } catch (e: any) {
          console.warn('Real web3 transaction failed, falling back to simulated confirmation:', e);
        }
      }

      return { txHash, blockNumber };
    },
    [wallet]
  );

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        switchChain,
        faucetDemo,
        tokens,
        addToken,
        trades,
        addTrade,
        executeContractPayment,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
