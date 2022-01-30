import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, ContractReceipt } from "ethers";
import { ethers, network } from "hardhat";

describe("STAKING", function () {
  let Staking: ContractFactory;
  let staking: Contract;
  let stakingToken: Contract;
  let rewardToken: Contract;
  let StakingToken: ContractFactory;
  let RewardToken: ContractFactory;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  const rewardTime = 600;
  const rewardPercent = 20; // To sign after point ex. 13.33 % => 1333
  const unstackDelay = 300;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Staking = await ethers.getContractFactory("Staking");
    StakingToken = await ethers.getContractFactory("ERC20");
    RewardToken = await ethers.getContractFactory("ERC20");
    [owner, addr1, addr2] = await ethers.getSigners();

    stakingToken = await StakingToken.deploy("BLACGOLD", "BG");
    rewardToken = await RewardToken.deploy("PARADOX", "PD");
    
    staking = await Staking.deploy(stakingToken.address, rewardToken.address, rewardTime, rewardPercent, unstackDelay);

    await rewardToken.mint(staking.address, 10000000);
    console.log('Balance of' + await rewardToken.balanceOf(staking.address));
  

    console.log('owner ' + await staking.owner());
    console.log('===> ' + owner.address);
    console.log('===> ' + addr1.address);
    console.log('===> ' + addr2.address);
    
  });

  describe("Staking process", function () {
    it("Should return the contract _totalSupply stack", async function () {
        await stakingToken.connect(addr1).mint(addr1.address, 100);
        await stakingToken.connect(addr1).approve(staking.address, 10);
        await staking.connect(addr1).stake(10);
        expect(await staking.totalStaks()).to.equal(10);
    });

    it("Should return the contract _totalSupply after unstake unstack", async function () {
        await stakingToken.connect(addr1).mint(addr1.address, 100);
        await stakingToken.connect(addr1).approve(staking.address, 10);
        await staking.connect(addr1).stake(10);

        if(rewardTime > unstackDelay) {
          await network.provider.send("evm_increaseTime", [rewardTime]);
        }else{
          await network.provider.send("evm_increaseTime", [unstackDelay]);
        }

        await staking.connect(addr1).unstake(10);
        expect(await staking.totalStaks()).to.equal(0);
    });

    it("Should return the contract after claim", async function () {
        await stakingToken.connect(addr1).mint(addr1.address, 100);
        await stakingToken.connect(addr1).approve(staking.address, 100);
        await staking.connect(addr1).stake(100);

        if(rewardTime > unstackDelay) {
         await network.provider.send("evm_increaseTime", [rewardTime * 2]);
        }else{
         await network.provider.send("evm_increaseTime", [unstackDelay]);
        }

        await staking.connect(addr1).claim();
        expect(await rewardToken.balanceOf(addr1.address)).to.equal(40);
    });

    it.only("Should return the contract stack", async function () {
      await stakingToken.connect(addr1).mint(addr1.address, 100);
      await stakingToken.connect(addr1).approve(staking.address, 10);
      await staking.connect(addr1).stake(10);      
      await expect(staking.connect(addr1).unstake(10)).to.be.revertedWith("Withdraw available after 10 min");
    });
  });
 
});