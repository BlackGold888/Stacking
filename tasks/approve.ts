import { task } from "hardhat/config";
import { Contract, ContractFactory, ContractReceipt } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import "@nomiclabs/hardhat-waffle";
import { HardhatRuntimeEnvironment } from "hardhat/types";

async function getContractInstance(hre: HardhatRuntimeEnvironment) : Promise<Contract>{
    const [addr1, addr2] = await hre.ethers.getSigners();
    let Token: ContractFactory;
    let hardhatToken: Contract;
    Token = await hre.ethers.getContractFactory("ERC20");
    hardhatToken = await Token.deploy("ERC20", "ERC20");
    return hardhatToken;
}

task("approve", "Approve an account's balance")
  .addParam("to", "Approve an account's balance")
  .addParam("amount", "The amount")
  .setAction(async (taskArgs, hre) => {
    const [addr1] = await hre.ethers.getSigners();
        const hardhatToken = await getContractInstance(hre);
        await hardhatToken.mint(addr1.address, taskArgs.amount);
        const res = await hardhatToken.approve(taskArgs.to, taskArgs.amount);
        if(res){
            console.log(`Allowance added from ${addr1.address} for ${taskArgs.to}`);
            console.log(`Account allowance is: ${await hardhatToken.allowance(addr1.address, taskArgs.to)}`);
        }
});
