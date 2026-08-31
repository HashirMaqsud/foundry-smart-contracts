# Foundry Smart Contracts: ERC-20 & ERC-721 Tooling

Production-grade Solidity smart contracts developed, tested, and deployed using **Foundry** (Forge, Anvil, Cast) and **OpenZeppelin v5**.

---

## Contracts Overview

* **`HaxhirToken` (`HASH`):** Standard ERC-20 token with initial supply minting and owner-controlled minting functionality.
* **`HaxhirNFT` (`HXNFT`):** Standard ERC-721 token with token URI metadata management (`ERC721URIStorage`) and secure sequential minting.

---

## 🛠 Tech Stack

* **Smart Contract Framework:** Foundry (Forge, Anvil, Cast)
* **Solidity Version:** `^0.8.20`
* **Libraries:** OpenZeppelin Contracts v5.x
* **Testing:** Automated Unit & Access Control Tests via `forge-std`

---

## Quick Start

### 1. Build Contracts
```bash
forge build

```

### 2. Run Test Suite

```bash
forge test -vvv

```

### 3. Local Deployment (Anvil)

Start local node:

```bash
anvil

```

Deploy contracts:

```bash
# Deploy ERC-20
forge script script/Haxhir.s.sol:DeployHaxhir --fork-url [http://127.0.0.1:8545](http://127.0.0.1:8545) --unlocked --sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --broadcast

# Deploy ERC-721
forge script script/HaxhirNFT.s.sol:DeployHaxhirNFT --fork-url [http://127.0.0.1:8545](http://127.0.0.1:8545) --unlocked --sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --broadcast