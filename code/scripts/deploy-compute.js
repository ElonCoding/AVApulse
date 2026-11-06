const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Avalanche Native NoxCompute...");
  console.log("Deployer:", deployer.address);

  const AvalancheNoxCompute = await hre.ethers.getContractFactory("AvalancheNoxCompute");
  const compute = await AvalancheNoxCompute.deploy();
  await compute.waitForDeployment();
  const computeAddr = await compute.getAddress();
  console.log("AvalancheNoxCompute deployed to:", computeAddr);
}

main().catch(console.error);

