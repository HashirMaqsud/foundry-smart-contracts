import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet as originalMetaMaskWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, anvil, mainnet } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '841954456e7a91cb59147dd04ecc5685';

const safeMetaMaskWallet = (params: any) => {
  const wallet = originalMetaMaskWallet(params);
  
  const isMetaMaskInstalled =
    typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    (window.ethereum as any).isMetaMask === true;
  
  wallet.installed = isMetaMaskInstalled;
  
  if (!isMetaMaskInstalled) {
    delete wallet.qrCode;
    delete wallet.mobile;
  }
  
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