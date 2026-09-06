import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        injectedWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: 'Haxhir Web3 dApp',
    projectId: '841954456e7a91cb59147dd04ecc5685',
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