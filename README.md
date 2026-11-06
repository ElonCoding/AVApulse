<p align="center">
  <h1 align="center">⚡ AVApulse</h1>
  <p align="center"><strong>Confidential Payroll on Avalanche</strong></p>
  <p align="center">
    Pay your team with encrypted amounts. Only authorized parties can decrypt.<br/>
    Built with <a href="https://protocol.iex.ec/">iExec Nox Protocol</a> · <a href="https://eips.ethereum.org/EIPS/eip-7984">ERC-7984</a> · Avalanche Fuji
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-^0.8.28-363636?logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/Hardhat-2.x-yellow?logo=hardhat" alt="Hardhat" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Network-Avalanche%20Fuji-E84142?logo=avalanche" alt="Network" />
  <img src="https://img.shields.io/badge/ERC-7984-green" alt="ERC-7984" />
</p>

---

## The Problem

On-chain payroll is transparent by default. Every salary, every bonus, every payment amount is publicly visible to anyone with a block explorer. Companies can't use blockchain payroll without exposing compensation data to competitors, employees seeing each other's pay, or the entire world.

## The Solution

**AVApulse** wraps standard ERC-20 tokens into **ERC-7984 confidential tokens** using iExec's Nox Protocol. Salary amounts are encrypted on-chain as opaque `bytes32` handles — nobody watching the blockchain can see how much was paid. Only authorized parties (the employee, or an employer-approved auditor) can decrypt specific amounts.

### 🔒 Key Differentiator: Selective Auditor Disclosure

> The employer can grant an external auditor **read-only access** to specific payment handles via on-chain ACL. The auditor can decrypt individual salaries for compliance verification — without employees publicly revealing their compensation, and without the employer emailing a CSV.

This demonstrates the **core value proposition of confidential tokens**: privacy with selective, verifiable, on-chain disclosure.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (Vite + React + ethers v6)        │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │ 🏢 Employer    │  │ 👤 Employee    │  │ 🔍 Auditor   │   │
│  │ - Wrap tokens  │  │ - Decrypt bal  │  │ - Decrypt    │   │
│  │ - Batch pay    │  │ - Unwrap ERC20 │  │   payments   │   │
│  │ - Grant audit  │  │                │  │ - Read-only  │   │
│  └───────┬────────┘  └───────┬────────┘  └──────────────┘   │
│          │     @iexec-nox/handle SDK      │                  │
└──────────┼────────────────────────────────┼──────────────────┘
           │                   │
           ▼                   ▼
┌──────────────────────────────────────────┐
│          AVALANCHE FUJI (Chain 43113)    │
│                                          │
│  MockERC20      ConfPayToken (ERC-7984)  │
│  PayrollManager                          │
│  NoxCompute (ACL + TEE gateway)          │
└──────────────────────────────────────────┘
```

---

## Deployed Contracts (Avalanche Fuji)

| Contract | Address |
|----------|---------|
| MockERC20 | `0x155b9eee80e9f89f0594953bb9B9554d8b653a00` |
| ConfPayToken (ERC-7984) | `0x08A1ABF57C949Db12848bE205498f492e9b5BBa6` |
| PayrollManager | `0xe3A2240060e1f52D84d8acE41dBb908aF53B3825` |

> See [`deployments/avalanche-fuji.json`](deployments/avalanche-fuji.json) for full deployment details.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MetaMask** browser extension
- **Avalanche Fuji AVAX** — get from [Avalanche Faucet](https://faucet.avax.network/)

### Setup

```bash
# Clone the repository
git clone https://github.com/ElonCoding/AVApulse.git
cd AVApulse

# Install smart contract dependencies
cd code
cp .env.example .env
# Add your deployer private key to .env
npm install

# Install frontend dependencies
cd frontend
npm install
```

### Run the Frontend

```bash
cd code/frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and connect MetaMask to **Avalanche Fuji** (Chain ID: 43113).

### Deploy Contracts (Optional)

The contracts are already deployed on Avalanche Fuji. To redeploy:

```bash
cd code

# Edit .env with your private key
# PRIVATE_KEY=your_private_key_here

npx hardhat run scripts/deploy.js --network avalancheFuji
```

---

## Frontend Pages

| Route | Role | Description |
|-------|------|-------------|
| `/` | All | Landing page with contract addresses and architecture overview |
| `/employer` | Employer | Wrap tokens, manage employees, batch pay, grant auditors |
| `/employee` | Employee | View encrypted balance, decrypt, unwrap to ERC-20 |
| `/auditor` | Auditor | Read-only view of disclosed payment handles with decrypt |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity 0.8.28, Hardhat 2.x, OpenZeppelin 5.x |
| Confidential Layer | iExec Nox Protocol, ERC-7984, `@iexec-nox/nox-confidential-contracts` |
| Frontend | React 19, Vite 8, ethers.js 6, React Router 7 |
| Encryption SDK | `@iexec-nox/handle` (ECIES + Intel TDX TEE) |
| Network | Avalanche Fuji (Chain ID: 43113) |

---

## Demo Flow

| Time | Scene | What Happens |
|------|-------|-------------|
| 0:00–0:10 | Hook | Problem statement: "Salary payments on-chain are public" |
| 0:10–0:40 | Wrap + Pay | Employer wraps 1000 mUSDC, pays 2 employees (500 + 300) with encrypted transfers |
| 0:40–1:05 | Unwrap | Employee decrypts balance, unwraps with ~15s real TEE decryption |
| 1:05–1:35 | Audit | Employer grants auditor → auditor decrypts both salaries (selective disclosure) |
| 1:35–2:00 | Close | Summary + repo link |

---

## Project Structure

```
AVApulse/
├── code/
│   ├── contracts/          # Solidity smart contracts
│   │   ├── ConfPayToken.sol
│   │   ├── PayrollManager.sol
│   │   └── MockERC20.sol
│   ├── scripts/            # Hardhat deploy scripts
│   ├── frontend/           # Vite + React frontend
│   │   └── src/
│   │       ├── pages/      # Employer, Employee, Auditor, Home
│   │       ├── components/ # Navbar, shared UI
│   │       ├── config/     # Contract ABIs + addresses
│   │       └── context/    # WalletContext (MetaMask integration)
│   ├── hardhat.config.js
│   └── package.json
├── deployments/            # Contract addresses per network
│   └── avalanche-fuji.json
└── README.md
```

---

## Known Limitations

- **ACL Revocation**: Nox does not support retroactive ACL revocation. Previously-granted handles remain accessible even after auditor removal from the roster.
- **TEE Latency**: The unwrap flow requires ~15 seconds for Intel TDX TEE decryption. This is inherent to the Nox protocol, not a bug.
- **Local Testing**: Encrypted operations (`euint256`, `Nox.fromExternal()`) require the live Nox Handle Gateway. Unit tests cover only non-encrypted logic paths.

---

## Author

**ElonCoding**

Built with [iExec Nox Protocol](https://protocol.iex.ec/) and [ERC-7984 Confidential Tokens](https://eips.ethereum.org/EIPS/eip-7984)

---

## License

MIT
