const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfPayToken", function () {
  let mockERC20, confPayToken;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy AvalancheNoxCompute to hardhat dev address 0x44C00793aD4975617b3B5Fc27D4FB78E772c8236
    const AvalancheNoxCompute = await ethers.getContractFactory("AvalancheNoxCompute");
    const compute = await AvalancheNoxCompute.deploy();
    await compute.waitForDeployment();

    const devComputeAddr = "0x44C00793aD4975617b3B5Fc27D4FB78E772c8236";
    const code = await ethers.provider.getCode(await compute.getAddress());
    await ethers.provider.send("hardhat_setCode", [devComputeAddr, code]);

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock USDC", "mUSDC");
    await mockERC20.waitForDeployment();

    const ConfPayToken = await ethers.getContractFactory("ConfPayToken");
    confPayToken = await ConfPayToken.deploy(await mockERC20.getAddress());
    await confPayToken.waitForDeployment();
  });

  it("should deploy with correct ERC-20 underlying link", async function () {
    expect(await confPayToken.underlying()).to.equal(await mockERC20.getAddress());
    expect(await confPayToken.name()).to.equal("ConfPayToken");
    expect(await confPayToken.symbol()).to.equal("CPAY");
  });

  it("should support ERC-7984 and ERC-165 interfaces", async function () {
    const ERC7984_INTERFACE_ID = "0x4958f2a4";
    expect(await confPayToken.supportsInterface(ERC7984_INTERFACE_ID)).to.be.true;
    expect(await confPayToken.supportsInterface("0x01ffc9a7")).to.be.true; // ERC165
  });

  it("should wrap underlying tokens into confidential balance handle", async function () {
    const wrapAmount = ethers.parseEther("500");
    await mockERC20.mint(user1.address, wrapAmount);
    await mockERC20.connect(user1).approve(await confPayToken.getAddress(), wrapAmount);

    const tx = await confPayToken.connect(user1).wrap(user1.address, wrapAmount);
    await tx.wait();

    expect(await mockERC20.balanceOf(user1.address)).to.equal(0);
    expect(await mockERC20.balanceOf(await confPayToken.getAddress())).to.equal(wrapAmount);

    const confHandle = await confPayToken.confidentialBalanceOf(user1.address);
    expect(confHandle).to.not.equal(ethers.ZeroHash);
  });

  it("should support setting operators", async function () {
    const until = 1893456000;
    await confPayToken.connect(user1).setOperator(user2.address, until);
    expect(await confPayToken.isOperator(user1.address, user2.address)).to.be.true;
  });
});
