import { task } from "hardhat/config";
import { BigNumber, Contract, ContractFactory, ContractReceipt } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import "@nomiclabs/hardhat-waffle";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function getContractInstance(hre: HardhatRuntimeEnvironment) : Promise<Contract>{
    let RewardToken: ContractFactory;
    let rewardToken: Contract;
    RewardToken = await hre.ethers.getContractFactory("ERC20");
    rewardToken = await RewardToken.attach('0x049A8c2d7B3994F0242A6d84b6b2a2F06661C182');
    return rewardToken;
}

task("mint", "Approve an account's balance")
  .addParam("amount", "The amount")
  .setAction(async (taskArgs, hre) => {
    const [addr1, addr2] = await hre.ethers.getSigners();
        const hardhatToken = await getContractInstance(hre);
        await hardhatToken.mint(addr1.address, BigNumber.from(10).pow(18).mul(taskArgs.amount));
});
