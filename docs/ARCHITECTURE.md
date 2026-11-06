# AVApulse Architecture & Protocol Specification

## 1. System Components

The AVApulse confidential payroll system is structured into four distinct layers:

### 1.1 Collateral Layer (`MockERC20`)
Standard ERC-20 token serving as the underlying asset for confidential payroll. In production deployments, this can be swapped with USDC or any standard ERC-20 on Avalanche C-Chain.

### 1.2 Confidential Wrapping Layer (`ConfPayToken`)
Inherits from `ERC20ToERC7984Wrapper` and implements the ERC-7984 confidential token standard.
- **Wrap**: Transfers standard ERC-20 tokens to the wrapper contract and generates an encrypted balance handle (`euint256`).
- **Unwrap**: Burns the wrapped tokens, authorizes public decryption on-chain, and issues underlying ERC-20 assets upon verification.

### 1.3 Payroll Management Layer (`PayrollManager`)
Maintains employee roster states and historical transaction records.
- Records encrypted payment handles mapped per employee.
- Manages auditor authorization lists without custodial control over payroll funds.

### 1.4 Native Compute & Access Control Layer (`AvalancheNoxCompute`)
Native compute engine deployed directly to Avalanche Fuji (`0xe0493eE9fE6513e5ddc3aa3Cc50845FD0591D428`).
- Validates transient (`allowTransient`) and persistent (`allow`) permissions.
- Implements deterministic handle arithmetic (`add`, `sub`, `safeAdd`, etc.).
- Verifies unwrap decryption proofs.

