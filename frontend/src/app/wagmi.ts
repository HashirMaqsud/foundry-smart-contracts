import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet as originalMetaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

const projectId = '841954456e7a91cb59147dd04ecc5685';

const safeMetaMaskWallet = (params: any) => {
  const wallet = originalMetaMaskWallet(params);
  
  // Bugged WalletConnect QR fallback ko forcefully delete kar rahe hain
  delete wallet.qrCode;
  delete wallet.mobile;
  
  return wallet;
};

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        safeMetaMaskWallet,
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