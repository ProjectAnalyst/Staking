const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

    // Get contract factory
    const MiniStaking = await hre.ethers.getContractFactory("MiniStaking");
    
    // Deploy contract
    console.log("\nDeploying MiniStaking contract...");
    const staking = await MiniStaking.deploy(
        process.env.MINI_TOKEN_ADDRESS,  // Token address
        process.env.TREASURY_WALLET      // Treasury wallet
    );

    // Wait for deployment
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();

    console.log("\nDeployment successful!");
    console.log("MiniStaking deployed to:", stakingAddress);
    console.log("Token address:", process.env.MINI_TOKEN_ADDRESS);
    console.log("Treasury wallet:", process.env.TREASURY_WALLET);

    // Verify contract on Etherscan
    console.log("\nTo verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network sepolia ${stakingAddress} ${process.env.MINI_TOKEN_ADDRESS} ${process.env.TREASURY_WALLET}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 