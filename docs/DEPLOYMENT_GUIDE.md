# AVApulse Deployment & Configuration Handbook

## 1. Network Setup: Avalanche Fuji Testnet
- **Network Name**: Avalanche Fuji C-Chain
- **Chain ID**: `43113`
- **RPC URL**: `https://api.avax-test.network/ext/bc/C/rpc`
- **Currency Symbol**: `AVAX`
- **Block Explorer**: `https://testnet.snowtrace.io`

## 2. Hardhat Deployment Sequence

Deployments must be executed in exact dependency order:

1. **Deploy Compute Layer**:
   ```bash
   npx hardhat run scripts/deploy-compute.js --network avalancheFuji
   ```
2. **Deploy Collateral & Confidential Wrapper**:
   ```bash
   npx hardhat run scripts/deploy.js --network avalancheFuji
   ```
3. **Deploy Payroll Manager & Seed Roles**:
   ```bash
   npx hardhat run scripts/deploy-payroll.js --network avalancheFuji
   ```

