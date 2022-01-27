import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract, ContractFactory, ContractReceipt } from "ethers";
import { ethers } from "hardhat";

describe("ERC20", function () {
  let Token: ContractFactory;
  let hardhatToken: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("ERC20");
    [owner, addr1, addr2] = await ethers.getSigners();
    hardhatToken = await Token.deploy("ERC20", "ERC20");
  });

  describe("name", function () {
    it("Should return the contract name created in constructor", async function () {
      expect(await hardhatToken.name()).to.equal("ERC20");
    });
  });

  describe("symbol", function () {
    it("Should return the contract symbol created in constructor", async function () {
      expect(await hardhatToken.symbol()).to.equal("ERC20");
    });
  });

  describe("balanceOf", function () {
    it("Should return the address balance", async function () {
      await hardhatToken.mint(owner.address, 100);
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(100);
    });
  });

  describe("totalSupply", function () {
    it("Should return the contract totalSupply", async function () {
      await hardhatToken.mint(owner.address, 100);
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.mint(addr2.address, 100);
      expect(await hardhatToken.totalSupply()).to.equal(300);
    });
  });

  describe("Decimals", function () {
    it("Should return the dechimals once it's changed", async function () {
      expect(await hardhatToken.decimals()).to.equal(18);
    });
  });

  describe("Mint token", function () {
    it("Mint token for address", async function () {
      await hardhatToken.mint(addr1.address, 50);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    });
  });

  describe("Burn token", function () {
    it("Burn token for address", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.burn(addr1.address, 45);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(55);
    });
  });

  describe("Transfer token", function () {
    it("Transfer token for address", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.connect(addr1).transfer(addr2.address, 10);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(90);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(10);
    });
  });

  describe("Allowance token with approve", function () {
    it("Allowance token for address", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.connect(addr1).approve(addr2.address, 20);
      expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(20);
    });
  });

  describe("Increase Allowance token", function () {
    it("Increase Allowance token", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.connect(addr1).approve(addr2.address, 20);
      await hardhatToken.connect(addr1).increaseAllowance(addr2.address, 10);
      expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(30);
    });
  });

  describe("Decrease Allowance token", function () {
    it("Decrease Allowance token", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.connect(addr1).approve(addr2.address, 20);
      await hardhatToken.connect(addr1).decreaseAllowance(addr2.address, 10);
      expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(10);
    });
  });

  describe("Transfer From token", function () {
    it("Transfer From token", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.connect(addr1).approve(addr2.address, 50);
      await hardhatToken.connect(addr2).transferFrom(addr1.address, addr2.address, 20);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(20);
      expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(30);
    });
  });

  describe("Approve token", function () {
    it("Approve token", async function () {
      await hardhatToken.mint(addr1.address, 100);
      await hardhatToken.connect(addr1).approve(addr2.address, 50);
      expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(50);
    });
  });

});