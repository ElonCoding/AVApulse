# AVApulse Smart Contract API Reference

## 1. ConfPayToken (ERC-7984)

### `wrap(address to, uint256 amount) -> (bytes32)`
Locks `amount` of underlying ERC-20 from caller and mints confidential `CPAY` to `to`. Returns the encrypted balance handle.

### `unwrap(address from, address to, bytes32 amount) -> (bytes32)`
Initiates unwrap process for an encrypted balance handle.

### `finalizeUnwrap(bytes32 unwrapRequestId, bytes calldata proof)`
Submits verification proof for `unwrapRequestId` to release underlying ERC-20 tokens to recipient.

---

## 2. PayrollManager

### `addEmployee(address employee)`
Restricted to owner. Adds address to active payroll roster.

### `recordPayments(address[] calldata employees, bytes32[] calldata handles)`
Records confidential transaction handles emitted during employer direct transfers.

### `grantAuditorAccess(address auditor)`
Authorizes an auditor address to inspect employee payment history on-chain.
