// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MiniStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Constants
    uint256 private constant BP_DENOMINATOR = 10000;
    uint256 private constant MULTIPLIER_BASE = 1e18;
    uint256 public constant MAX_LOCK_PERIOD = 365 days;

    // Lock period configuration (short times for testing)
    enum LockPeriod {
        ONE_MINUTE,
        TWO_MINUTES,
        THREE_MINUTES
    }
    uint256[3] public lockPeriods = [60, 120, 180];
    uint256[3] public multipliers = [1e18, 1.25e18, 1.5e18]; // 1x, 1.25x, 1.5x

    IERC20 public immutable rewardToken;
    address public treasuryWallet;

    struct Stake {
        uint128 amount;
        uint48 startTime;
        uint48 endTime;
        LockPeriod lockPeriod;
        uint256 rewardMultiplier;
        bool active;
    }

    // Only track total distributed for info
    uint256 public totalDistributed;

    mapping(address => Stake[]) public userStakes;

    event Staked(address indexed user, uint256 indexed stakeId, uint256 amount);
    event Withdrawn(address indexed user, uint256 indexed stakeId, uint256 reward);
    event EmergencyWithdraw(address indexed user, uint256 indexed stakeId, uint256 penalty);
    event WithdrawDebug(
        address indexed user,
        uint256 indexed stakeId,
        uint256 stakeAmount,
        uint256 rewardMultiplier,
        uint256 calculatedReward,
        uint256 totalPayout,
        uint256 contractBalance
    );

    constructor(address _token, address _treasuryWallet) Ownable(msg.sender) {
        rewardToken = IERC20(_token);
        treasuryWallet = _treasuryWallet;
    }

    function stake(uint256 amount, LockPeriod period) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(uint8(period) < lockPeriods.length, "Invalid lock period");

        rewardToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 multiplier = multipliers[uint8(period)];
        uint256 duration = lockPeriods[uint8(period)];

        userStakes[msg.sender].push(Stake({
            amount: uint128(amount),
            startTime: uint48(block.timestamp),
            endTime: uint48(block.timestamp + duration),
            lockPeriod: period,
            rewardMultiplier: multiplier,
            active: true
        }));

        emit Staked(msg.sender, userStakes[msg.sender].length - 1, amount);
    }

    function withdraw(uint256 stakeIndex) external nonReentrant {
        Stake storage s = userStakes[msg.sender][stakeIndex];
        require(s.active, "Stake inactive");
        require(block.timestamp >= s.endTime, "Lock period not over");

        // Calculate reward based on the multiplier
        uint256 reward = (uint256(s.amount) * (s.rewardMultiplier - MULTIPLIER_BASE)) / MULTIPLIER_BASE;
        uint256 totalPayout = uint256(s.amount) + reward;
        
        // Emit debug information before the balance check
        emit WithdrawDebug(
            msg.sender,
            stakeIndex,
            s.amount,
            s.rewardMultiplier,
            reward,
            totalPayout,
            rewardToken.balanceOf(address(this))
        );

        require(rewardToken.balanceOf(address(this)) >= totalPayout, "Insufficient contract balance");

        s.active = false;
        totalDistributed += reward;

        rewardToken.safeTransfer(msg.sender, totalPayout);
        emit Withdrawn(msg.sender, stakeIndex, reward);
    }

    function emergencyWithdraw(uint256 stakeIndex) external nonReentrant {
        Stake storage s = userStakes[msg.sender][stakeIndex];
        require(s.active, "Stake inactive");

        uint256 penalty = (uint256(s.amount) * 3000) / BP_DENOMINATOR; // 30%
        uint256 payout = s.amount - penalty;

        s.active = false;
        rewardToken.safeTransfer(treasuryWallet, penalty);
        rewardToken.safeTransfer(msg.sender, payout);

        emit EmergencyWithdraw(msg.sender, stakeIndex, penalty);
    }

    function getUserStakingInfo(address user) external view returns (Stake[] memory) {
        return userStakes[user];
    }

    function setTreasuryWallet(address newWallet) external onlyOwner {
        treasuryWallet = newWallet;
    }
} 
