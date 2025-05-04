const hre = require("hardhat");

async function main() {
  // Replace these with your actual token and treasury addresses
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const treasuryWallet = process.env.TREASURY_WALLET;

  if (!tokenAddress || !treasuryWallet) {
    throw new Error("Please set TOKEN_ADDRESS and TREASURY_WALLET in .env");
  }

  const MiniStaking = await hre.ethers.getContractFactory("MiniStaking");
  const staking = await MiniStaking.deploy(tokenAddress, treasuryWallet);

  await staking.waitForDeployment();

  console.log("MiniStaking deployed to:", await staking.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 