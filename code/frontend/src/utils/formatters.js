import { ethers } from 'ethers';

/**
 * Truncates an EVM hex address to format 0x1234...5678
 */
export function formatAddress(address, prefix = 6, suffix = 4) {
  if (!address || typeof address !== 'string') return '';
  if (address.length <= prefix + suffix) return address;
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`;
}

/**
 * Formats a raw Wei bigint or numeric string into decimal string representation
 */
export function formatTokenAmount(amountWei, decimals = 18, maxFractionDigits = 4) {
  if (amountWei === null || amountWei === undefined) return '0.0';
  try {
    const formatted = ethers.formatUnits(amountWei, decimals);
    const parts = formatted.split('.');
    if (parts.length < 2) return formatted;
    return `${parts[0]}.${parts[1].slice(0, maxFractionDigits)}`;
  } catch {
    return '0.0';
  }
}

/**
 * Validates whether a string is a well-formed 20-byte EVM address
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') return false;
  return ethers.isAddress(address);
}
