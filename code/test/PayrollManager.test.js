const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PayrollManager", function () {
  let payroll, mockERC20, confPayToken;
  let employer, employee1, employee2, auditor, nonAuthorized;

  beforeEach(async function () {
    [employer, employee1, employee2, auditor, nonAuthorized] = await ethers.getSigners();

    // Mock Compute
    const AvalancheNoxCompute = await ethers.getContractFactory("AvalancheNoxCompute");
    const compute = await AvalancheNoxCompute.deploy();
    await compute.waitForDeployment();

    const devComputeAddr = "0x44C00793aD4975617b3B5Fc27D4FB78E772c8236";
    const code = await ethers.provider.getCode(await compute.getAddress());
    await ethers.provider.send("hardhat_setCode", [devComputeAddr, code]);

    // Mock ERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock USDC", "mUSDC");
    await mockERC20.waitForDeployment();

    // ConfPayToken
    const ConfPayToken = await ethers.getContractFactory("ConfPayToken");
    confPayToken = await ConfPayToken.deploy(await mockERC20.getAddress());
    await confPayToken.waitForDeployment();

    // PayrollManager
    const PayrollManager = await ethers.getContractFactory("PayrollManager");
    payroll = await PayrollManager.deploy(await confPayToken.getAddress(), employer.address);
    await payroll.waitForDeployment();
  });

  describe("Ownership & Deployment", function () {
    it("should set deployer as owner", async function () {
      expect(await payroll.owner()).to.equal(employer.address);
    });

    it("should link payToken address accurately", async function () {
      expect(await payroll.payToken()).to.equal(await confPayToken.getAddress());
    });
  });

  describe("Employee Roster Management", function () {
    it("should allow employer to add employees", async function () {
      await payroll.connect(employer).addEmployee(employee1.address);
      expect(await payroll.isEmployee(employee1.address)).to.be.true;
      expect(await payroll.getEmployeeCount()).to.equal(1);

      const emps = await payroll.getEmployees();
      expect(emps[0]).to.equal(employee1.address);
    });

    it("should reject duplicate employee enrollment", async function () {
      await payroll.connect(employer).addEmployee(employee1.address);
      await expect(payroll.connect(employer).addEmployee(employee1.address))
        .to.be.revertedWithCustomError(payroll, "EmployeeAlreadyExists");
    });

    it("should allow employer to remove an existing employee", async function () {
      await payroll.connect(employer).addEmployee(employee1.address);
      await payroll.connect(employer).addEmployee(employee2.address);
      expect(await payroll.getEmployeeCount()).to.equal(2);

      await payroll.connect(employer).removeEmployee(employee1.address);
      expect(await payroll.isEmployee(employee1.address)).to.be.false;
      expect(await payroll.getEmployeeCount()).to.equal(1);
    });

    it("should reject non-owners from modifying roster", async function () {
      await expect(payroll.connect(nonAuthorized).addEmployee(employee1.address))
        .to.be.revertedWithCustomError(payroll, "OwnableUnauthorizedAccount");
    });
  });

  describe("Auditor Delegation & Payment Bookkeeping", function () {
    it("should allow employer to grant and revoke auditor privileges", async function () {
      await payroll.connect(employer).grantAuditorAccess(auditor.address);
      expect(await payroll.isAuditor(auditor.address)).to.be.true;

      const auditors = await payroll.getAuditors();
      expect(auditors.length).to.equal(1);
      expect(auditors[0]).to.equal(auditor.address);

      await payroll.connect(employer).revokeAuditorAccess(auditor.address);
      expect(await payroll.isAuditor(auditor.address)).to.be.false;
      expect((await payroll.getAuditors()).length).to.equal(0);
    });

    it("should accurately record batch payment handles", async function () {
      const handle1 = ethers.keccak256(ethers.toUtf8Bytes("payment_1"));
      const handle2 = ethers.keccak256(ethers.toUtf8Bytes("payment_2"));

      await payroll.connect(employer).recordPayments(
        [employee1.address, employee2.address],
        [handle1, handle2]
      );

      expect(await payroll.getPaymentCount(employee1.address)).to.equal(1);
      expect(await payroll.getPaymentHandle(employee1.address, 0)).to.equal(handle1);

      expect(await payroll.getPaymentCount(employee2.address)).to.equal(1);
      expect(await payroll.getPaymentHandle(employee2.address, 0)).to.equal(handle2);

      const paidList = await payroll.getPaidEmployees();
      expect(paidList.length).to.equal(2);
      expect(paidList).to.include(employee1.address);
      expect(paidList).to.include(employee2.address);
    });

    it("should revert if batch arrays have mismatched lengths", async function () {
      const handle1 = ethers.keccak256(ethers.toUtf8Bytes("payment_1"));
      await expect(
        payroll.connect(employer).recordPayments([employee1.address, employee2.address], [handle1])
      ).to.be.revertedWithCustomError(payroll, "ArrayLengthMismatch");
    });
  });
});
