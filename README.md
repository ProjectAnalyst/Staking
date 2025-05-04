# MINI Token Staking Platform

A decentralized staking platform for MINI tokens that allows users to stake their tokens for different lock periods and earn rewards.

## Overview

This project consists of:
- Smart Contract: `MiniStaking.sol` - Handles token staking, rewards, and withdrawals
- Frontend: React/NextJS application - Provides user interface for staking operations
- Deployment Scripts: For deploying and verifying contracts

## Smart Contract Features

### Staking
- Users can stake MINI tokens for different lock periods:
  - 1 minute (1x multiplier)
  - 2 minutes (1.25x multiplier)
  - 3 minutes (1.5x multiplier)
- Staked tokens are locked for the chosen period
- Rewards are calculated based on the lock period multiplier

### Withdrawals
- Normal Withdrawal: Users can withdraw their staked tokens plus rewards after the lock period ends
- Emergency Withdrawal: Users can withdraw before the lock period ends, with a 30% penalty
  - 70% of staked amount returned to user
  - 30% penalty sent to treasury wallet

### Security Features
- Reentrancy protection using OpenZeppelin's ReentrancyGuard
- SafeERC20 for secure token transfers
- Owner-controlled treasury wallet for penalty collection

## Frontend Features

- Connect wallet using RainbowKit
- View token balance and staking positions
- Stake tokens with different lock periods
- Withdraw staked tokens and rewards
- Emergency withdrawal option
- Transaction status tracking

## Flow of Funds

1. **Staking**
   - User approves token spending
   - User stakes tokens to contract
   - Contract holds tokens until withdrawal

2. **Normal Withdrawal**
   - User receives original stake + rewards
   - No penalty applied

3. **Emergency Withdrawal**
   - User receives 70% of staked amount
   - 30% penalty sent to treasury wallet

## Security Considerations

### Current Security Measures
- Reentrancy protection
- Safe token transfers
- Owner-controlled treasury wallet

### Potential Improvements (TODO)
1. **High Priority - Contract Security**
   - Add Circuit Breaker / Pausable functionality
     - Add ability to pause contract in case of emergency
     - Only owner can pause/unpause
     - Prevents new stakes/withdrawals when paused
   - Implement stake index bounds checking
     - Add check to prevent invalid stake index access
     - Show clear error message if index doesn't exist
   - Evaluate treasury wallet usage and withdrawal functions
     - Decide if treasury wallet is needed
     - Consider alternatives like burning penalties

2. **Medium Priority - Contract Features**
   - Add reward cap calculations
     - Check if contract has enough tokens for all potential rewards
     - Prevent staking if rewards would exceed contract balance
     - Formula: (staked amount * multiplier) must be <= contract balance
   - Implement rate limiting
     - Add minimum time between stakes/withdrawals
     - Prevent spam transactions
   - Add input validation for all user inputs
     - Check amounts are positive
     - Validate lock periods
     - Prevent invalid values

3. **Low Priority - Frontend & UX**
   - Clean up console logs in frontend
     - Remove sensitive data from browser console
     - Keep only essential logs
   - Add error boundaries
     - Prevent app crashes from React errors
     - Show user-friendly error messages
   - Improve error messages
     - Make messages clearer for users
     - Add helpful suggestions

## Development

### Prerequisites
- Node.js
- Hardhat
- MetaMask or other Web3 wallet

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Deploy contracts: `npx hardhat run scripts/deploy.js`

### Environment Variables
- `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_MINI_TOKEN_ADDRESS`

## Security Notes

- The contract is non-upgradeable
- Owner can only set treasury wallet address
- No direct owner withdrawal function
- All contract code is public and verifiable

## Future Considerations

- Implement reward cap calculations
- Add circuit breaker functionality
- Consider upgradeability options
- Evaluate treasury wallet usage
- Add stake index validation 