// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const BlackGoldContract = await ethers.getContractFactory("Staking");
  const blackgoldInstance = await BlackGoldContract.deploy(process.env.LP_TOKEN, process.env.REWARD_TOKEN, 600, 2000, 600);// Name symbo
  await blackgoldInstance.deployed();
  console.log("BlackGold deployed to:", blackgoldInstance.address);

  // const paradoxInstance = await BlackGoldContract.deploy("PARADOX", "PR");
  // await paradoxInstance.deployed();
  // console.log("Paradox deployed to:", paradoxInstance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
