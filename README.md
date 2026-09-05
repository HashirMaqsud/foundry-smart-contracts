# Full-Stack Web3 dApp: ERC-20, ERC-721, IPFS & Advanced Security Suite

A production-grade decentralized application built with Foundry, Next.js 15, RainbowKit, Wagmi v2, Viem, and Pinata IPFS. The ecosystem integrates a complete smart contract security verification pipeline—spanning Slither static analysis, Foundry property-based fuzz testing, and simulated reentrancy exploit defense—deployed on the Ethereum Sepolia testnet.

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
+---> HaxhirToken (ERC-20) [Audited V2]
+---> HaxhirNFT (ERC-721)  [Audited V2]

```

---

## Deployed Smart Contracts (V2 Audited)

Both contracts are compiled with Solidity `^0.8.20`, hardened against common EVM vulnerabilities, and deployed on Ethereum Sepolia.

| Contract | Standard | Address | Explorer Link |
| :--- | :--- | :--- | :--- |
| **HaxhirToken** | ERC-20 | `0xB1f95652B787970acc66952Db344F5b82aA38B15` | [View on Etherscan](https://sepolia.etherscan.io/address/0xB1f95652B787970acc66952Db344F5b82aA38B15) |
| **HaxhirNFT** | ERC-721 | `0x36C5E35dBf75097478A82233a33199C8069Bc1f6` | [View on Etherscan](https://sepolia.etherscan.io/address/0x36C5E35dBf75097478A82233a33199C8069Bc1f6) |

---

## Security Auditing & Verification Pipeline

Prior to production deployment, all contracts underwent a rigorous 3-tier security validation lifecycle:


```

[ Tier 1: Static Analysis ] ---> [ Tier 2: Property Fuzzing ] ---> [ Tier 3: Exploit Lab & Defense ]
(Slither)                           (Foundry)                    (Reentrancy & CEI Guard)

```

### 1. Static Analysis (Slither AST Scanning)
- Scanned contracts using Slither AST analyzers for common vulnerabilities (state variable shadowing, uninitialized state, reentrancy vulnerabilities, arbitrary send).
- Remediation: Resolved variable shadowing on inherited state variables and enforced strict state ordering across the codebase.
- **Audit Result:** 0 critical, 0 high, 0 medium findings.

### 2. Property-Based Fuzz Testing (Foundry)
- Tested contract properties and edge cases over **256 randomized runs per function** with boundary condition fuzzing (e.g., $0$, $1$, $2^{256} - 1$, randomized recipient addresses).
- **HaxhirToken Tests:**
  - `testFuzz_TransferValidAmount`: Invariant check ensuring balance consistency across random valid amounts.
  - `testFuzz_RevertWhenTransferExceedsBalance`: Strict revert validation when random input exceeds caller balance.
  - `testFuzz_TransferBetweenRandomUsers`: Random recipient and amount handling with zero-address discarding via `vm.assume`.
- **HaxhirNFT Tests:**
  - `testFuzz_MintNFT`: Randomized recipient generation and URI string assignment verifying total supply invariants and token ownership.

### 3. Reentrancy Exploit & Defense Lab
- Implemented an exploit proof-of-concept (`contracts/src/security-labs/`):
  - **`VulnerableBank.sol`**: State balance updated *after* external raw call execution (violating CEI).
  - **`Attacker.sol`**: Malicious contract triggering a recursive fallback loop to drain the bank.
  - **`SafeBank.sol`**: Implemented OpenZeppelin's `ReentrancyGuard` (`nonReentrant`) and the Checks-Effects-Interactions (CEI) design pattern.
- Automated tests in `ReentrancyExploit.t.sol` mathematically verified both the 11 ETH bank drain attack and the subsequent revert defense on `SafeBank`.

---

## Tech Stack

### Smart Contracts & Security Tooling
- Solidity `^0.8.20`
- Foundry (`forge`, `anvil`, `cast`) for property testing, fuzzing, scripting, and deployment
- Slither (Static analyzer)
- OpenZeppelin Contracts (ERC20, ERC721URIStorage, Ownable, ReentrancyGuard)

### Frontend & Web3 Bridge
- Next.js 15 (React 19, TypeScript)
- Tailwind CSS
- RainbowKit (Multi-wallet connector with SSR-safe hydration)
- Wagmi v2 & Viem (Type-safe Ethereum RPC interactions)
- Pinata SDK (Decentralized asset and metadata pinning to IPFS)
- Hosted on Vercel (Edge-optimized serverless build)

---

## Project Structure


```

├── contracts/
│   ├── src/
│   │   ├── Haxhir.sol                  # ERC-20 Token contract
│   │   ├── HaxhirNFT.sol               # ERC-721 NFT contract with URI storage
│   │   └── security-labs/
│   │       ├── VulnerableBank.sol       # Flawed bank contract (interaction before effect)
│   │       ├── Attacker.sol             # Malicious fallback reentrancy contract
│   │       └── SafeBank.sol             # Patched bank using CEI & ReentrancyGuard
│   ├── script/
│   │   ├── Haxhir.s.sol                # Token deployment script
│   │   └── HaxhirNFT.s.sol             # NFT deployment script
│   ├── test/
│   │   ├── Haxhir.t.sol                # Property-based fuzz tests for ERC-20
│   │   ├── HaxhirNFT.t.sol             # Property-based fuzz tests for ERC-721
│   │   └── security-labs/
│   │       └── ReentrancyExploit.t.sol  # Exploit verification & defense test suite
│   └── foundry.toml                    # Foundry configuration
│
└── frontend/
├── src/app/
│   ├── constants/
│   │   └── contracts.ts            # Contract ABIs and V2 Sepolia addresses
│   ├── utils/
│   │   └── pinata.ts               # IPFS asset and metadata upload service
│   ├── page.tsx                    # Main dApp UI and Web3 execution logic
│   └── wagmi.ts                    # Wagmi and RainbowKit chain configurations
└── package.json

```

---

## Local Development & Setup

### Prerequisites
- Node.js `>= 18.x`
- Foundry toolchain (`forge`, `anvil`, `cast`)
- Python 3.x with Slither installed (`pip3 install slither-analyzer`)
- MetaMask browser extension

### 1. Smart Contracts Setup & Testing

```bash
cd contracts

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts --no-commit

# Run all unit and fuzz tests
forge test -vv

# Run the Reentrancy Exploit & Defense Lab
forge test --match-path test/security-labs/ReentrancyExploit.t.sol -vv

# Run Slither static analysis
slither . --config-file slither.config.json

```

### 2. Sepolia Deployment

```bash
# Set up environment variables inside contracts/.env
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_key

# Deploy HaxhirNFT
forge script script/HaxhirNFT.s.sol:DeployHaxhirNFT \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify -vvvv

# Deploy HaxhirToken
forge script script/Haxhir.s.sol:DeployHaxhir \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify -vvvv

```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
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