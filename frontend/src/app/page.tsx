'use client';

import { useState, useSyncExternalStore } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseUnits, formatUnits, getAddress } from 'viem';
import { 
  HAXHIR_TOKEN_ADDRESS, 
  HAXHIR_TOKEN_ABI, 
  HAXHIR_NFT_ADDRESS, 
  HAXHIR_NFT_ABI 
} from './constants/contracts';
import { uploadToIPFS } from './utils/pinata';

const emptySubscribe = () => () => {};

export default function Home() {
  const isHydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Token Transfer States
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  // NFT Mint States
  const [nftFile, setNftFile] = useState<File | null>(null);
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Safe Checksummed Contract Addresses
  const tokenAddress = getAddress(HAXHIR_TOKEN_ADDRESS);
  const nftAddress = getAddress(HAXHIR_NFT_ADDRESS);

  // --- Read Token Details ---
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'decimals',
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: HAXHIR_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [getAddress(address)] : undefined,
  });

  // --- Read NFT Details ---
  const { data: totalMinted, refetch: refetchNFTs } = useReadContract({
    address: nftAddress,
    abi: HAXHIR_NFT_ABI,
    functionName: 'totalMinted',
  });

  // --- Write: Transfer ---
  const { data: transferHash, isPending: isTransferPending, writeContract: writeTransfer } = useWriteContract();
  const { isLoading: isTransferConfirming, isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({
    hash: transferHash,
  });

  // --- Write: Mint NFT ---
  const { data: mintHash, isPending: isMintPending, writeContract: writeMint } = useWriteContract();
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  const getExplorerUrl = (hash: `0x${string}`) => {
    if (chainId === 11155111) {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    }
    return null;
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount || decimals === undefined) return;

    try {
      const validRecipient = getAddress(recipient.trim());
      writeTransfer(
        {
          address: tokenAddress,
          abi: HAXHIR_TOKEN_ABI,
          functionName: 'transfer',
          args: [validRecipient, parseUnits(amount, decimals)],
        },
        {
          onSuccess: () => {
            setAmount('');
            refetchBalance();
          },
        }
      );
    } catch {
      alert('Invalid Ethereum recipient address');
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftFile || !nftName || !address) return;

    try {
      setUploadStatus('Uploading asset & metadata to IPFS...');
      const tokenURI = await uploadToIPFS(nftFile, nftName, nftDescription);

      setUploadStatus('Broadcasting mint transaction to blockchain...');
      writeMint(
        {
          address: nftAddress,
          abi: HAXHIR_NFT_ABI,
          functionName: 'mintNFT',
          args: [getAddress(address), tokenURI],
        },
        {
          onSuccess: () => {
            setNftName('');
            setNftDescription('');
            setNftFile(null);
            setUploadStatus('');
            refetchNFTs();
          },
          onError: (err) => {
            setUploadStatus(`Mint failed: ${err.message}`);
          },
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadStatus(`Error: ${errorMessage}`);
    }
  };

  if (!isHydrated) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Haxhir Web3 Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Foundry + Next.js 15 + Wagmi v2 + Pinata IPFS</p>
        </div>

        <div className="flex justify-center">
          <ConnectButton />
        </div>

        {isConnected && (
          <div className="flex flex-col gap-6">
            {/* Section 1: ERC20 Token & Transfer */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4">
              <span className="text-sm font-semibold text-indigo-400">ERC-20 Token Engine</span>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Token:</span>
                <span className="font-medium text-slate-200">
                  {name ? `${String(name)} (${symbol || ''})` : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Balance:</span>
                <span className="font-semibold text-emerald-400">
                  {balance !== undefined && decimals !== undefined
                    ? `${formatUnits(balance as bigint, decimals)} ${symbol || ''}`
                    : '0'}
                </span>
              </div>

              <form onSubmit={handleTransfer} className="flex flex-col gap-2 pt-2 border-t border-slate-800/50">
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
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isTransferPending || isTransferConfirming}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  {isTransferPending ? 'Confirm in Wallet...' : isTransferConfirming ? 'Waiting Block...' : 'Send Tokens'}
                </button>

                {isTransferSuccess && transferHash && (
                  <div className="text-xs text-center text-emerald-400 mt-1 flex flex-col gap-0.5">
                    <span>Tokens Transferred Successfully!</span>
                    {getExplorerUrl(transferHash) ? (
                      <a 
                        href={getExplorerUrl(transferHash)!} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-indigo-400 underline hover:text-indigo-300"
                      >
                        View on Etherscan ↗
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[10px]">Tx: {transferHash.slice(0, 10)}...{transferHash.slice(-8)}</span>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Section 2: ERC721 NFT & IPFS Minting */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-indigo-400">ERC-721 NFT + IPFS Storage</span>
                <span className="text-xs bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 px-2 py-1 rounded-md">
                  Total Minted: {totalMinted !== undefined ? String(totalMinted) : '0'}
                </span>
              </div>

              <form onSubmit={handleMint} className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNftFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                  required
                />
                <input
                  type="text"
                  placeholder="NFT Name (e.g. Cyber Haxhir #1)"
                  value={nftName}
                  onChange={(e) => setNftName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Description (Optional)"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isMintPending || isMintConfirming || !!uploadStatus}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  {uploadStatus || (isMintPending ? 'Confirm in Wallet...' : isMintConfirming ? 'Minting on EVM...' : 'Upload to IPFS & Mint NFT')}
                </button>

                {isMintSuccess && mintHash && (
                  <div className="text-xs text-center text-emerald-400 mt-1 flex flex-col gap-0.5">
                    <span>NFT Minted Successfully! Total Minted updated.</span>
                    {getExplorerUrl(mintHash) ? (
                      <a 
                        href={getExplorerUrl(mintHash)!} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-indigo-400 underline hover:text-indigo-300"
                      >
                        View on Etherscan ↗
                      </a>
                    ) : (
                      <span className="text-slate-500 font-mono text-[10px]">Tx: {mintHash.slice(0, 10)}...{mintHash.slice(-8)}</span>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}