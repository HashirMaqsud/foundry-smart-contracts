import { connectorsForWallets, Wallet } from '@rainbow-me/rainbowkit';
import { coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { sepolia, anvil, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '841954456e7a91cb59147dd04ecc5685';

const safeMetaMaskWallet = (): Wallet => {
  const isMetaMaskInstalled =
    typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    (window.ethereum as any).isMetaMask;

  return {
    id: 'metaMask',
    name: 'MetaMask',
    iconUrl: 'https://raw.githubusercontent.com/rainbow-me/rainbowkit/main/packages/rainbowkit/src/wallets/walletConnectors/metaMaskWallet/metaMaskWallet.svg',
    iconBackground: '#fff',
    installed: !!isMetaMaskInstalled,
    downloadUrls: {
      chrome: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      browserExtension: 'https://metamask.io/download/',
    },
    // STRICT FIX: Return the function exactly as Wagmi expects, DO NOT execute it.
    createConnector: () => injected({ target: 'metaMask' }),
  };
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