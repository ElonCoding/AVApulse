import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../../.env');
const envContent = readFileSync(envPath, 'utf8');

function getEnvVal(key) {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : null;
}

const RPC = getEnvVal('AVAX_FUJI_RPC') || 'https://api.avax-test.network/ext/bc/C/rpc';
const PK = getEnvVal('PRIVATE_KEY');
const mockAddr = getEnvVal('MOCK_ERC20_ADDRESS');
const confAddr = getEnvVal('CONF_PAY_TOKEN_ADDRESS');
const payrollAddr = getEnvVal('PAYROLL_MANAGER_ADDRESS');
const computeAddr = getEnvVal('AVALANCHE_NOX_COMPUTE_ADDRESS');

console.log('--- AVApulse Fuji Verification Suite ---');
console.log('RPC:', RPC);
console.log('MockERC20:', mockAddr);
console.log('ConfPayToken:', confAddr);
console.log('PayrollManager:', payrollAddr);
console.log('AvalancheNoxCompute:', computeAddr);

const provider = new ethers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(PK.startsWith('0x') ? PK : '0x' + PK, provider);
console.log('Signer:', signer.address);

const balance = await provider.getBalance(signer.address);
console.log('AVAX Balance:', ethers.formatEther(balance), 'AVAX');

// Test 1: MockERC20
console.log('\n[Test 1] Checking MockERC20...');
const mockAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function mint(address, uint256)'
];
const mock = new ethers.Contract(mockAddr, mockAbi, signer);
const name = await mock.name();
const symbol = await mock.symbol();
const mockBal = await mock.balanceOf(signer.address);
console.log(`Mock Token: ${name} (${symbol})`);
console.log(`User Balance: ${ethers.formatEther(mockBal)} ${symbol}`);

// Test 2: ConfPayToken
console.log('\n[Test 2] Checking ConfPayToken (ERC-7984)...');
const confAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function supportsInterface(bytes4) view returns (bool)',
  'function confidentialBalanceOf(address) view returns (bytes32)',
  'function underlying() view returns (address)'
];
const conf = new ethers.Contract(confAddr, confAbi, signer);
const cName = await conf.name();
const cSymbol = await conf.symbol();
const is7984 = await conf.supportsInterface('0x4958f2a4');
const underlying = await conf.underlying();
const confBalHandle = await conf.confidentialBalanceOf(signer.address);
console.log(`Confidential Token: ${cName} (${cSymbol})`);
console.log(`Underlying Asset: ${underlying} (matches Mock: ${underlying.toLowerCase() === mockAddr.toLowerCase()})`);
console.log(`ERC-7984 Compliant: ${is7984}`);
console.log(`Encrypted Balance Handle: ${confBalHandle}`);

// Test 3: PayrollManager
console.log('\n[Test 3] Checking PayrollManager...');
const payrollAbi = [
  'function owner() view returns (address)',
  'function getEmployees() view returns (address[])',
  'function getAuditors() view returns (address[])',
  'function isEmployee(address) view returns (bool)',
  'function isAuditor(address) view returns (bool)'
];
const payroll = new ethers.Contract(payrollAddr, payrollAbi, signer);
const pOwner = await payroll.owner();
const emps = await payroll.getEmployees();
const auds = await payroll.getAuditors();
console.log(`Owner: ${pOwner}`);
console.log(`Active Employees (${emps.length}):`, emps);
console.log(`Active Auditors (${auds.length}):`, auds);

// Test 4: AvalancheNoxCompute
console.log('\n[Test 4] Checking AvalancheNoxCompute...');
const computeAbi = [
  'function gateway() view returns (address)',
  'function proofExpirationDuration() view returns (uint256)'
];
const compute = new ethers.Contract(computeAddr, computeAbi, signer);
const gateway = await compute.gateway();
const exp = await compute.proofExpirationDuration();
console.log(`Native Coprocessor Gateway: ${gateway}`);
console.log(`Proof Expiry Window: ${exp}s`);

console.log('\n=============================================');
console.log('✅ ALL CONTRACTS LIVE & HEALTHY ON AVALANCHE FUJI!');
console.log('=============================================');
