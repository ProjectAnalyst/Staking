# MINI Staking dApp

A decentralized application for staking MINI tokens with different lock periods and reward multipliers.

## Features

- Stake MINI tokens with 1, 2, or 3-minute lock periods
- Different reward multipliers based on lock period
- Emergency withdrawal with 30% penalty
- Admin functions for funding the reward pool
- Modern UI with RainbowKit wallet connection

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```bash
# Contract Addresses
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=
NEXT_PUBLIC_MINI_TOKEN_ADDRESS=

# Wallet Configuration
TREASURY_WALLET=

# Network Configuration
SEPOLIA_RPC_URL=
PRIVATE_KEY=

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

3. Deploy the contract to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Start the development server:
```bash
npm run dev
```

## Contract Details

The staking contract supports:
- Three lock periods: 1, 2, and 3 minutes
- Reward multipliers: 1x, 1.25x, and 1.5x respectively
- Emergency withdrawal with 30% penalty
- Admin-only reward pool funding

## Testing

### Smart Contract Tests

The contract has been thoroughly tested with the following test cases:

#### Deployment Tests
- ✓ Correct deployment
- ✓ Token address set correctly
- ✓ Treasury wallet set correctly
- ✓ Initial unpaused state

#### Staking Tests
- ✓ Users can stake tokens
- ✓ Cannot stake 0 tokens
- ✓ Cannot stake when contract is paused
- ✓ Cannot stake with invalid lock period

#### Withdrawal Tests
- ✓ Users can withdraw after lock period
- ✓ Cannot withdraw before lock period ends
- ✓ Cannot withdraw inactive stakes

#### Emergency Withdrawal Tests
- ✓ Users can emergency withdraw with penalty
- ✓ Cannot emergency withdraw inactive stakes

#### Pause/Unpause Tests
- ✓ Owner can pause/unpause contract
- ✓ Non-owners cannot pause
- ✓ Cannot unpause when not paused

#### Treasury Management Tests
- ✓ Owner can change treasury wallet
- ✓ Non-owners cannot change treasury
- ✓ Cannot set zero address as treasury

### Frontend Testing
1. Connect your wallet using RainbowKit
2. Stake MINI tokens with different lock periods
3. Wait for the lock period to expire
4. Withdraw your staked tokens and rewards
5. Test emergency withdrawal (30% penalty)
6. As admin, test funding the reward pool

## Security Notes

- The contract uses OpenZeppelin's ReentrancyGuard and Ownable2Step
- All user funds are protected by non-reentrant functions
- Emergency withdrawal has a 30% penalty to discourage early withdrawals
- Admin functions are protected by the onlyOwner modifier 