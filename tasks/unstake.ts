import { task } from "hardhat/config";
import { BigNumber, Contract, ContractFactory, ContractReceipt } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import "@nomiclabs/hardhat-waffle";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function getContractInstance(hre: HardhatRuntimeEnvironment) : Promise<Contract[]>{
    let StakingContract: ContractFactory;
    let ERCToken: ContractFactory;
    let blackgoldToken: Contract;
    let paradoxToken: Contract;
    let stakingInstance: Contract;
    StakingContract = await hre.ethers.getContractFactory("Staking");
    ERCToken = await hre.ethers.getContractFactory("ERC20");
    stakingInstance = await StakingContract.attach('0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0');
    blackgoldToken = await ERCToken.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    paradoxToken = await ERCToken.attach('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
    return [stakingInstance, blackgoldToken, paradoxToken];
}

task("unstake", "unstake an account's balance")
.addParam("amount", "The amount")
  .setAction(async (taskArgs, hre) => {
    const [addr1, addr2] = await hre.ethers.getSigners();
    const [stakingInstance, blackgoldToken, paradoxTokend] = await getContractInstance(hre);

    await blackgoldToken.connect(addr1).mint(addr1.address, taskArgs.amount);
    await blackgoldToken.connect(addr1).approve(stakingInstance.address, taskArgs.amount);
    await stakingInstance.connect(addr1).stake(taskArgs.amount);
    await hre.network.provider.send("evm_increaseTime", [300]);
    await stakingInstance.connect(addr1).unstake(50);
    console.log(await stakingInstance.totalSupply());
});
