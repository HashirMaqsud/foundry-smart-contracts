import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { anvil, sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Haxhir Web3 dApp',
  projectId: 'YOUR_PROJECT_ID',
  chains: [anvil, sepolia, mainnet],
  ssr: false,
});