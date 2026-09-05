# Full-Stack Web3 dApp: ERC-20, ERC-721, and IPFS Integration

A decentralized application built with Foundry, Next.js 15, RainbowKit, Wagmi v2, Viem, and Pinata IPFS. The platform enables wallet connectivity, ERC-20 token transfers, decentralized file and metadata pinning via IPFS, and ERC-721 NFT minting on Ethereum Sepolia testnet.

- Live Application: https://foundry-smart-contracts-ten.vercel.app
- Network: Ethereum Sepolia Testnet

---

## Architectural Overview

This system operates without a centralized backend server. Client interactions interface directly with on-chain smart contracts through RPC nodes, while digital assets and metadata are preserved using decentralized storage protocols.


```

Browser Client (Next.js 15 + Wagmi v2 + Viem)
|
+---> Pinata API / IPFS (Asset & Metadata Storage)
|
+---> Ethereum Sepolia RPC (EVM State Execution)
|
+---> HaxhirToken (ERC-20)
+---> HaxhirNFT (ERC-721)

```

---

## Deployed Smart Contracts

Both contracts are deployed and verified on the Ethereum Sepolia testnet.

| Contract | Type | Address | Explorer Link |
| :--- | :--- | :--- | :--- |
| HaxhirToken | ERC-20 | `0xc2e4955F5ef720CB8f7c618a8ae401ecde9Fad47` | [View on Etherscan](https://sepolia.etherscan.io/address/0xc2e4955F5ef720CB8f7c618a8ae401ecde9Fad47) |
| HaxhirNFT | ERC-721 | `0x0848681f089a2ebeEFE32f86AF08be14D059e528` | [View on Etherscan](https://sepolia.etherscan.io/address/0x0848681f089a2ebeEFE32f86AF08be14D059e528) |

---

## Tech Stack

### Smart Contracts
- Solidity `^0.8.20`
- Foundry (Forge, Anvil, Cast) for compilation, local testing, and deployment
- OpenZeppelin Contracts (ERC20, ERC721URIStorage, Ownable)

### Frontend & Web3 Bridge
- Next.js 15 (React 19, TypeScript)
- Tailwind CSS
- RainbowKit (Multi-wallet connector with SSR-safe hydration)
- Wagmi v2 & Viem (Type-safe Ethereum RPC interactions)
- Pinata SDK (Decentralized asset pinning to IPFS)
- Hosted on Vercel (Edge-optimized serverless build)

---

## Key Features

1. Wallet Onboarding: Multi-wallet connection interface powered by RainbowKit supporting MetaMask and injected Web3 wallets with automatic chain detection for Sepolia.
2. ERC-20 Management: Real-time query of token name, symbol, decimals, and user balance, combined with safe token transfer executions.
3. Decentralized NFT Minting: Image upload and standard metadata packaging (name, description, image URI) sent directly to IPFS via Pinata. The returned CID is minted directly into the ERC-721 contract as an immutable `tokenURI`.
4. Transaction Explorer Links: Dynamic transaction feedback linking directly to Sepolia Etherscan for auditability.

---

## Project Structure


```

├── contracts/
│   ├── src/
│   │   ├── Haxhir.sol          # ERC-20 Token contract
│   │   └── HaxhirNFT.sol       # ERC-721 NFT contract with URI storage
│   ├── script/
│   │   └── Haxhir.s.sol        # Foundry deployment scripts
│   ├── test/                   # Foundry smart contract unit tests
│   └── foundry.toml            # Foundry configuration
│
└── frontend/
├── src/app/
│   ├── constants/
│   │   └── contracts.ts    # Contract ABIs and Sepolia addresses
│   ├── utils/
│   │   └── pinata.ts       # IPFS asset and metadata upload service
│   ├── page.tsx            # Main dApp UI and Web3 execution logic
│   └── wagmi.ts            # Wagmi and RainbowKit chain configurations
└── package.json

```

---

## Local Development & Setup

### Prerequisites
- Node.js `>= 18.x`
- Foundry toolchain (`forge`, `anvil`, `cast`)
- MetaMask browser extension

### 1. Smart Contracts Setup

```bash
cd contracts

# Install OpenZeppelin dependencies
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Compile contracts
forge build

# Run local node (Optional for local testing)
anvil

```

To deploy to Sepolia:

```bash
# Create .env file inside /contracts
echo "SEPOLIA_RPC_URL=your_rpc_url" >> .env
echo "PRIVATE_KEY=your_private_key" >> .env
source .env

# Deploy ERC-20
forge create src/Haxhir.sol:HaxhirToken \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --constructor-args 1000000

# Deploy ERC-721
forge create src/HaxhirNFT.sol:HaxhirNFT \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

```

Add your Pinata credentials inside `frontend/.env.local`:

```env
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_GATEWAY_URL=gateway.pinata.cloud

```

Run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```