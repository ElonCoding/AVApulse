# AVApulse Security & Cryptographic Model

## Threat Model & Access Control

1. **Collateral Segregation**: The wrapper holds 1:1 backing of the underlying ERC-20 tokens in escrow.
2. **Handle Isolation**: Plaintext salary numbers are never logged or stored in storage variables. All balance operations reference random scalar points (`bytes32`).
3. **Auditor Sandboxing**: Auditors receive read-only authorization keys. They cannot initiate or reroute transfers.
4. **Transient ACL Lifecycles**: Approvals for batch transfers execute within the single transaction frame using `allowTransient`, preventing stale authorization exploits.

