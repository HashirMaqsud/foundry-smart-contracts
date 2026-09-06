import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Haxhir Web3 dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '841954456e7a91cb59147dd04ecc5685',
  chains: [sepolia, anvil, mainnet],
  ssr: false,
});