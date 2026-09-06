import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Haxhir Web3 dApp',
projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [sepolia, anvil, mainnet],
  ssr: false,
});