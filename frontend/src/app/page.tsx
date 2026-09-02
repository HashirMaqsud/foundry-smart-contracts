'use client';

import { useState, useSyncExternalStore } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { HAXHIR_TOKEN_ADDRESS, HAXHIR_TOKEN_ABI } from './constants/contracts';

const emptySubscribe = () => () => {};

export default function Home() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { address, isConnected } = useAccount();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  // Read Contract Details
  const { data: name } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'decimals',
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: HAXHIR_TOKEN_ADDRESS,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Write Contract (Transfer)
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount || decimals === undefined) return;

    writeContract(
      {
        address: HAXHIR_TOKEN_ADDRESS,
        abi: HAXHIR_TOKEN_ABI,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseUnits(amount, decimals)],
      },
      {
        onSuccess: () => {
          setAmount('');
          refetchBalance();
        },
      }
    );
  };

  if (!isHydrated) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Haxhir Web3 Portal</h1>
        </div>

        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && (
          <>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Token:</span>
                <span className="font-medium text-slate-200">
                  {name ? `${String(name)} (${symbol || ''})` : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Your {symbol ? String(symbol) : 'HASH'} Balance:</span>
                <span className="font-semibold text-emerald-400">
                  {balance !== undefined && decimals !== undefined
                    ? `${formatUnits(balance as bigint, decimals)} ${symbol || ''}`
                    : '0'}
                </span>
              </div>
            </div>

            {/* Transfer Section */}
            <form onSubmit={handleTransfer} className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-slate-300">Transfer Tokens</span>
              
              <input
                type="text"
                placeholder="Recipient Address (0x...)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />

              <input
                type="number"
                step="any"
                placeholder="Amount (e.g. 50)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                required
              />

              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2 rounded-lg transition-colors text-sm"
              >
                {isPending ? 'Confirming in Wallet...' : isConfirming ? 'Waiting for Block...' : 'Send Tokens'}
              </button>

              {isConfirmed && (
                <span className="text-xs text-center text-emerald-400 mt-1">
                  Transaction Successful! Balance updated.
                </span>
              )}
            </form>
          </>
        )}
      </div>
    </main>
  );
}