import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '841954456e7a91cb59147dd04ecc5685';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended Wallets',
      wallets: [
        injectedWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: 'Haxhir Web3 dApp',
    projectId,
  }
);

export const config = createConfig({
  connectors,
  chains: [sepolia, anvil, mainnet],
  transports: {
    [sepolia.id]: http(),
    [anvil.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: false,
});