import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

const projectId = '841954456e7a91cb59147dd04ecc5685';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        // useWalletConnectCaller: false QR generator ko trigger hone se rokta hai
        metaMaskWallet,
        coinbaseWallet,
        injectedWallet,
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