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

task("transferFrom", "Approve an account's balance")
.addParam("from", "The from account's address")
.addParam("to", "Approve an account's balance")
.addParam("amount", "The amount")
.setAction(async (taskArgs, hre) => {
  const wallets = await hre.ethers.getSigners();
  for (const account of wallets) {
      console.log(await account.address);
    }
  let addrFrom : SignerWithAddress | undefined;
  let addrTo : SignerWithAddress | undefined;
  addrFrom = wallets.find(wallet => wallet.address === taskArgs.from);
  addrTo = wallets.find(wallet => wallet.address === taskArgs.to);
  if(addrFrom === undefined){
      [addrFrom] = await hre.ethers.getSigners();
  }

  if(addrTo === undefined){
      [addrFrom, addrTo] = await hre.ethers.getSigners();
  }
  
  if(addrTo && addrFrom) {
      const hardhatToken = await getContractInstance(hre);
      await hardhatToken.mint(addrFrom.address, taskArgs.amount);
      console.log('=== Before transfer ===');
      console.log(`Account from balance ${hre.ethers.utils.formatEther(await hardhatToken.balanceOf(addrFrom.address))}`);
      console.log(`Account to ${hre.ethers.utils.formatEther(await hardhatToken.balanceOf(addrTo.address))}`);

      await hardhatToken.connect(addrFrom).approve(addrTo.address, taskArgs.amount);
      await hardhatToken.connect(addrTo).transferFrom(addrFrom.address, addrTo.address, taskArgs.amount);
      const total = hre.ethers.utils.formatEther(await hardhatToken.totalSupply());

      console.log('=== After transfer ===');
      console.log(`Account from balance ${hre.ethers.utils.formatEther(await hardhatToken.balanceOf(addrFrom.address))}`);
      console.log(`Account to ${hre.ethers.utils.formatEther(await hardhatToken.balanceOf(addrTo.address))}`);

      console.log('=== Total supply ===');
      console.log(`Total supply ${total}`);
  }
});



module.exports = {};