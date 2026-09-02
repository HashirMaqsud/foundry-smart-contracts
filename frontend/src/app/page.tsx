'use client';

import { useSyncExternalStore } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { HAXHIR_TOKEN_ADDRESS, HAXHIR_TOKEN_ABI } from './constants/contracts';

// Client-only guard without useEffect setState
const subscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

export default function Home() {
  const mounted = useMounted();
  const { address, isConnected } = useAccount();

  // 1. Read Token Name
  const { data: tokenName } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'name',
  });

  // 2. Read Token Symbol
  const { data: tokenSymbol } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'symbol',
  });

  // 3. Read Token Decimals
  const { data: decimals } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'decimals',
  });

  // 4. Read User Balance
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const formattedBalance =
    balance !== undefined && decimals !== undefined
      ? formatUnits(balance, decimals)
      : '0';

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Haxhir Web3 Portal</h1>

        <ConnectButton />

        {isConnected && (
          <div className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Token:</span>
              <span className="text-slate-200 font-medium">
                {(tokenName as string) || 'Loading...'} ({(tokenSymbol as string) || ''})
              </span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Your HASH Balance:</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {isBalanceLoading ? 'Loading...' : `${formattedBalance} ${tokenSymbol || ''}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}