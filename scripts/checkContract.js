const { ethers } = require('ethers');
require('dotenv').config();

// Contract addresses and ABI
const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
const MINI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MINI_TOKEN_ADDRESS;

// Staking Contract ABI (minimal version for our checks)
const stakingABI = [
    "function rewardToken() view returns (address)",
    "function treasuryWallet() view returns (address)",
    "function totalDistributed() view returns (uint256)",
    "function getUserStakingInfo(address) view returns ((uint128,uint48,uint48,uint8,uint256,bool)[])",
    "function lockPeriods(uint256) view returns (uint256)",
    "function multipliers(uint256) view returns (uint256)"
];

// Token Contract ABI (minimal version for our checks)
const tokenABI = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function main() {
    try {
        console.log('Initializing provider...');
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        
        // Check network
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.name, network.chainId);

        console.log('\nInitializing contracts...');
        console.log('Staking Contract:', STAKING_CONTRACT_ADDRESS);
        console.log('Token Contract:', MINI_TOKEN_ADDRESS);

        const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, provider);
        const tokenContract = new ethers.Contract(MINI_TOKEN_ADDRESS, tokenABI, provider);

        // Get token decimals and symbol
        console.log('\nFetching token info...');
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        console.log('Token Symbol:', symbol);
        console.log('Token Decimals:', decimals);

        // Format function for readability
        const formatAmount = (amount) => {
            return ethers.formatUnits(amount, decimals);
        };

        console.log('\n=== Contract Status Check ===\n');

        // 1. Check contract token balances
        console.log('Checking contract token balance...');
        const contractTokenBalance = await tokenContract.balanceOf(STAKING_CONTRACT_ADDRESS);
        console.log(`Contract Token Balance: ${formatAmount(contractTokenBalance)} ${symbol}`);

        // 2. Check total distributed rewards
        console.log('\nChecking total distributed rewards...');
        try {
            const totalDistributed = await stakingContract.totalDistributed();
            console.log(`Total Distributed Rewards: ${formatAmount(totalDistributed)} ${symbol}`);
        } catch (error) {
            console.error('Error fetching total distributed:', error.message);
        }

        // 3. Check lock periods and multipliers
        console.log('\nChecking lock periods and multipliers...');
        try {
            for (let i = 0; i < 3; i++) {
                const lockPeriod = await stakingContract.lockPeriods(i);
                const multiplier = await stakingContract.multipliers(i);
                console.log(`Period ${i}: ${lockPeriod} seconds, Multiplier: ${formatAmount(multiplier)}x`);
            }
        } catch (error) {
            console.error('Error fetching lock periods:', error.message);
        }

        // 4. Check treasury wallet
        console.log('\nChecking treasury wallet...');
        try {
            const treasuryWallet = await stakingContract.treasuryWallet();
            const treasuryBalance = await tokenContract.balanceOf(treasuryWallet);
            console.log(`Treasury Wallet: ${treasuryWallet}`);
            console.log(`Treasury Balance: ${formatAmount(treasuryBalance)} ${symbol}`);
        } catch (error) {
            console.error('Error fetching treasury info:', error.message);
        }

        // 5. Check specific user stakes (if provided)
        if (process.argv[2]) {
            const userAddress = process.argv[2];
            console.log(`\nChecking stakes for user: ${userAddress}`);
            
            try {
                const userStakes = await stakingContract.getUserStakingInfo(userAddress);
                console.log(`Number of stakes: ${userStakes.length}`);

                userStakes.forEach((stake, index) => {
                    const [amount, startTime, endTime, lockPeriod, rewardMultiplier, active] = stake;
                    console.log(`\nStake #${index}:`);
                    console.log(`Amount: ${formatAmount(amount)} ${symbol}`);
                    console.log(`Start Time: ${new Date(Number(startTime) * 1000).toISOString()}`);
                    console.log(`End Time: ${new Date(Number(endTime) * 1000).toISOString()}`);
                    console.log(`Lock Period: ${lockPeriod}`);
                    console.log(`Reward Multiplier: ${formatAmount(rewardMultiplier)}x`);
                    console.log(`Active: ${active}`);
                    
                    // Calculate potential reward
                    const potentialReward = (amount * rewardMultiplier) / ethers.parseUnits("1", decimals);
                    console.log(`Potential Reward: ${formatAmount(potentialReward)} ${symbol}`);
                });
            } catch (error) {
                console.error('Error fetching user stakes:', error.message);
            }
        }

        // 6. Check if contract has enough balance for all potential rewards
        const allUsers = process.argv.slice(2);
        if (allUsers.length > 0) {
            try {
                let totalPotentialPayout = ethers.parseUnits("0", decimals);
                
                for (const user of allUsers) {
                    const userStakes = await stakingContract.getUserStakingInfo(user);
                    for (const stake of userStakes) {
                        const [amount, , , , rewardMultiplier, active] = stake;
                        if (active) {
                            const potentialPayout = (amount * rewardMultiplier) / ethers.parseUnits("1", decimals);
                            totalPotentialPayout += potentialPayout;
                        }
                    }
                }

                console.log(`\nTotal Potential Payout for all active stakes: ${formatAmount(totalPotentialPayout)} ${symbol}`);
                console.log(`Contract Balance: ${formatAmount(contractTokenBalance)} ${symbol}`);
                console.log(`Difference: ${formatAmount(contractTokenBalance - totalPotentialPayout)} ${symbol}`);
                console.log(`Has enough balance: ${contractTokenBalance >= totalPotentialPayout}`);
            } catch (error) {
                console.error('Error calculating potential payouts:', error.message);
            }
        }
    } catch (error) {
        console.error('Main error:', error);
        if (error.info) {
            console.error('Error details:', error.info);
        }
    }
}

main().catch((error) => {
    console.error('Script error:', error);
    process.exit(1);
}); 