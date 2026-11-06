const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockERC20", function () {
  let mockERC20;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock USDC", "mUSDC");
    await mockERC20.waitForDeployment();
  });

  it("should deploy with correct name and symbol", async function () {
    expect(await mockERC20.name()).to.equal("Mock USDC");
    expect(await mockERC20.symbol()).to.equal("mUSDC");
    expect(await mockERC20.decimals()).to.equal(18);
  });

  it("should allow any user to mint tokens", async function () {
    const mintAmount = ethers.parseEther("1000");
    await mockERC20.connect(user1).mint(user1.address, mintAmount);
    expect(await mockERC20.balanceOf(user1.address)).to.equal(mintAmount);
  });

  it("should transfer tokens accurately between accounts", async function () {
    const mintAmount = ethers.parseEther("500");
    const sendAmount = ethers.parseEther("200");
    await mockERC20.connect(user1).mint(user1.address, mintAmount);
    await mockERC20.connect(user1).transfer(user2.address, sendAmount);

    expect(await mockERC20.balanceOf(user1.address)).to.equal(mintAmount - sendAmount);
    expect(await mockERC20.balanceOf(user2.address)).to.equal(sendAmount);
  });

  it("should update allowance on approval", async function () {
    const approveAmount = ethers.parseEther("300");
    await mockERC20.connect(user1).approve(user2.address, approveAmount);
    expect(await mockERC20.allowance(user1.address, user2.address)).to.equal(approveAmount);
  });
});
