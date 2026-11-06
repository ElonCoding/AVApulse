import { ethers } from 'ethers';

/**
 * Validates a batch salary transfer payload
 * @param {Array<string>} addresses 
 * @param {Object} amountsMap 
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateBatchTransfer(addresses, amountsMap) {
  if (!addresses || addresses.length === 0) {
    return { valid: false, error: 'Roster is empty. Add at least one employee.' };
  }

  for (const addr of addresses) {
    if (!ethers.isAddress(addr)) {
      return { valid: false, error: `Invalid recipient address: ${addr}` };
    }
    const amount = amountsMap[addr];
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return { valid: false, error: `Invalid salary amount specified for ${addr.slice(0, 6)}...` };
    }
  }

  return { valid: true, error: null };
}

/**
 * Calculates total batch payroll sum
 * @param {Array<string>} addresses 
 * @param {Object} amountsMap 
 * @returns {bigint}
 */
export function calculateBatchTotalWei(addresses, amountsMap) {
  let total = 0n;
  for (const addr of addresses) {
    const amount = amountsMap[addr];
    if (amount && !isNaN(Number(amount))) {
      total += ethers.parseEther(amount.toString());
    }
  }
  return total;
}
