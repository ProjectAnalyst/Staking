const hre = require("hardhat");

async function main() {
  const MiniToken = await hre.ethers.getContractFactory("MiniToken");
  const token = await MiniToken.deploy();
  
  await token.waitForDeployment();

  console.log("MINI Token deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 