const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AvalancheNoxCompute", function () {
  let compute;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const AvalancheNoxCompute = await ethers.getContractFactory("AvalancheNoxCompute");
    compute = await AvalancheNoxCompute.deploy();
    await compute.waitForDeployment();
  });

  describe("Initialization & Configurations", function () {
    it("should set deployer as initial gateway", async function () {
      expect(await compute.gateway()).to.equal(owner.address);
    });

    it("should return valid KMS public key", async function () {
      const key = await compute.kmsPublicKey();
      expect(key).to.not.equal("0x");
      expect(key.length).to.be.greaterThan(2);
    });

    it("should allow gateway update", async function () {
      await compute.setGateway(user1.address);
      expect(await compute.gateway()).to.equal(user1.address);
    });

    it("should allow proof expiration window update", async function () {
      await compute.setProofExpirationDuration(7200);
      expect(await compute.proofExpirationDuration()).to.equal(7200);
    });
  });

  describe("Access Control Lists (ACL)", function () {
    const handle = ethers.keccak256(ethers.toUtf8Bytes("test_handle_1"));

    it("should grant persistent allow permissions", async function () {
      expect(await compute.isAllowed(handle, user1.address)).to.be.false;
      await compute.allow(handle, user1.address);
      expect(await compute.isAllowed(handle, user1.address)).to.be.true;
    });

    it("should manage transient permissions correctly", async function () {
      await compute.allowTransient(handle, user2.address);
      expect(await compute.isAllowed(handle, user2.address)).to.be.true;

      await compute.disallowTransient(handle, user2.address);
      expect(await compute.isAllowed(handle, user2.address)).to.be.false;
    });

    it("should grant viewer permissions", async function () {
      expect(await compute.isViewer(handle, user1.address)).to.be.false;
      await compute.addViewer(handle, user1.address);
      expect(await compute.isViewer(handle, user1.address)).to.be.true;
    });

    it("should support public decryption flag", async function () {
      expect(await compute.isPubliclyDecryptable(handle)).to.be.false;
      await compute.allowPublicDecryption(handle);
      expect(await compute.isPubliclyDecryptable(handle)).to.be.true;
      expect(await compute.isViewer(handle, user2.address)).to.be.true;
    });

    it("should validate allowed state for all handles in batch", async function () {
      const h2 = ethers.keccak256(ethers.toUtf8Bytes("test_handle_2"));
      await compute.allow(handle, user1.address);
      await compute.allow(h2, user1.address);

      await expect(compute.validateAllowedForAll(user1.address, [handle, h2])).to.not.be.reverted;
      await expect(compute.validateAllowedForAll(user2.address, [handle, h2])).to.be.reverted;
    });
  });

  describe("Confidential Arithmetic & Operator Computation", function () {
    const left = ethers.keccak256(ethers.toUtf8Bytes("val_left"));
    const right = ethers.keccak256(ethers.toUtf8Bytes("val_right"));

    it("should compute safeAdd without reverting", async function () {
      const res = await compute.safeAdd.staticCall(left, right);
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
      expect(res.result).to.not.equal(ethers.ZeroHash);
    });

    it("should compute safeSub without reverting", async function () {
      const res = await compute.safeSub.staticCall(left, right);
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
    });

    it("should compute safeMul without reverting", async function () {
      const res = await compute.safeMul.staticCall(left, right);
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
    });

    it("should compute safeDiv without reverting", async function () {
      const res = await compute.safeDiv.staticCall(left, right);
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
    });

    it("should execute transfer operation producing valid updated balance handles", async function () {
      const res = await compute.transfer.staticCall(left, right, ethers.keccak256(ethers.toUtf8Bytes("amount")));
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
      expect(res.newFrom).to.not.equal(ethers.ZeroHash);
      expect(res.newTo).to.not.equal(ethers.ZeroHash);
    });

    it("should execute mint operation successfully", async function () {
      const res = await compute.mint.staticCall(left, right, ethers.keccak256(ethers.toUtf8Bytes("supply")));
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
    });

    it("should execute burn operation successfully", async function () {
      const res = await compute.burn.staticCall(left, right, ethers.keccak256(ethers.toUtf8Bytes("supply")));
      expect(res.success).to.equal(ethers.zeroPadValue("0x01", 32));
    });

    it("should evaluate comparisons correctly", async function () {
      const eqRes = await compute.eq.staticCall(left, left);
      expect(eqRes).to.equal(ethers.zeroPadValue("0x01", 32));

      const neRes = await compute.ne.staticCall(left, right);
      expect(neRes).to.equal(ethers.zeroPadValue("0x01", 32));
    });
  });
});
