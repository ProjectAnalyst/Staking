import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useContractEvent } from 'wagmi';
import { stakingABI } from '../abi/stakingABI';
import { miniTokenABI } from '../abi/miniTokenABI';
import { useState, useEffect, useRef } from 'react';
import { formatEther } from 'ethers';

const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;
const MINI_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_MINI_TOKEN_ADDRESS;

if (!STAKING_CONTRACT_ADDRESS || !MINI_TOKEN_ADDRESS) {
  throw new Error('Missing required environment variables');
}

interface UseStakingProps {
  amount?: string;
  lockPeriod?: string;
}

export function useStaking({ amount, lockPeriod }: UseStakingProps = {}) {
  const { address } = useAccount();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const withdrawIndexRef = useRef<number | null>(null);
  const emergencyWithdrawIndexRef = useRef<number | null>(null);
  const [withdrawingIndex, setWithdrawingIndex] = useState<number | null>(null);
  const [emergencyWithdrawingIndex, setEmergencyWithdrawingIndex] = useState<number | null>(null);
  const [shouldWithdraw, setShouldWithdraw] = useState(false);
  const [shouldEmergencyWithdraw, setShouldEmergencyWithdraw] = useState(false);
  const [activeWithdrawal, setActiveWithdrawal] = useState<{
    type: 'normal' | 'emergency';
    index: number;
  } | null>(null);

  // Convert amount to BigInt if valid
  const amountInWei = amount && !isNaN(Number(amount))
    ? BigInt(Math.floor(Number(amount) * 10 ** 18))
    : undefined;
  
  // Convert lock period to number if valid
  const lockPeriodNum = lockPeriod ? Number(lockPeriod) : undefined;
  if (lockPeriodNum !== undefined && (lockPeriodNum < 0 || lockPeriodNum > 2)) {
    console.error('Invalid lock period:', lockPeriodNum);
    return;
  }

  // Read user's token balance
  const { data: tokenBalance, refetch: refetchTokenBalance } = useContractRead({
    address: MINI_TOKEN_ADDRESS as `0x${string}`,
    abi: miniTokenABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    onSuccess: (data) => {
      // Only log on initial load or when balance changes
      if (!tokenBalance || tokenBalance !== data) {
        console.log('Token balance updated:', {
          timestamp: new Date().toISOString(),
          balance: formatEther(data)
        });
      }
    }
  });

  // Read user's stakes
  const { data: userStakes, refetch: refetchStakes } = useContractRead({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: stakingABI,
    functionName: 'getUserStakingInfo',
    args: [address],
    watch: true,
    onSuccess: (data) => {
      // Only log on initial load or when stakes change
      const stakesChanged = !userStakes || 
        userStakes.length !== data.length ||
        userStakes.some((stake, index) => {
          const newStake = data[index];
          return (
            stake.amount !== newStake.amount ||
            stake.active !== newStake.active ||
            stake.endTime !== newStake.endTime ||
            stake.lockPeriod !== newStake.lockPeriod
          );
        });

      if (stakesChanged) {
        console.log('User stakes updated:', {
          timestamp: new Date().toISOString(),
          stakeCount: data.length,
          stakes: data.map(stake => ({
            amount: formatEther(stake.amount),
            active: stake.active,
            endTime: new Date(Number(stake.endTime) * 1000).toISOString(),
            lockPeriod: stake.lockPeriod
          }))
        });
      }
    }
  });

  // Read current allowance
  const { data: allowance } = useContractRead({
    address: MINI_TOKEN_ADDRESS as `0x${string}`,
    abi: miniTokenABI,
    functionName: 'allowance',
    args: [address, STAKING_CONTRACT_ADDRESS as `0x${string}`],
    watch: true,
    onSuccess: (data) => {
      // Only log on initial load or when allowance changes
      if (!allowance || allowance !== data) {
        console.log('Allowance updated:', {
          timestamp: new Date().toISOString(),
          allowance: formatEther(data)
        });
      }
    }
  });

  // Calculate total staked amount
  const totalStaked = userStakes?.reduce((acc, stake) => acc + stake.amount, BigInt(0)) || BigInt(0);

  // Read contract's token balance with error handling
  const { data: contractTokenBalance, error: contractBalanceError } = useContractRead({
    address: MINI_TOKEN_ADDRESS as `0x${string}`,
    abi: miniTokenABI,
    functionName: 'balanceOf',
    args: [STAKING_CONTRACT_ADDRESS as `0x${string}`],
    watch: true,
    onSuccess: (data) => {
      // Only log on initial load or when contract balance changes
      if (!contractTokenBalance || contractTokenBalance !== data) {
        console.log('Contract balance updated:', {
          timestamp: new Date().toISOString(),
          balance: formatEther(data)
        });
      }
    },
    onError: (error) => {
      console.error('Error reading contract balance:', error);
    }
  });

  // Prepare approve function with exact amount
  const { config: approveConfig } = usePrepareContractWrite({
    address: MINI_TOKEN_ADDRESS as `0x${string}`,
    abi: miniTokenABI,
    functionName: 'approve',
    args: [STAKING_CONTRACT_ADDRESS as `0x${string}`, amountInWei || BigInt(0)],
    enabled: !!address && !!amountInWei && Number(amount) > 0,
  });

  const { write: approve, isLoading: isApproving } = useContractWrite({
    ...approveConfig,
    onSuccess: (data) => {
      console.log('Approve successful:', data);
      setTxHash(data.hash);
      setTxStatus('success');
    },
    onError: (error) => {
      console.error('Approve error:', error);
      setTxStatus('error');
    },
  });

  // Prepare stake function with user input
  const { config: stakeConfig } = usePrepareContractWrite({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: stakingABI,
    functionName: 'stake',
    args: [amountInWei || BigInt(0), lockPeriodNum !== undefined ? BigInt(lockPeriodNum) : BigInt(0)],
    enabled: !!address && !!amountInWei && lockPeriodNum !== undefined && Number(amount) > 0 && allowance >= (amountInWei || BigInt(0)),
    onError: (error) => {
      console.error('Stake preparation error:', error);
    },
  });

  const { write: stake, isLoading: isStaking } = useContractWrite({
    ...stakeConfig,
    onSuccess: (data) => {
      console.log('Stake successful:', data);
      setTxHash(data.hash);
      setTxStatus('success');
      refetchStakes();
      refetchTokenBalance();
    },
    onError: (error) => {
      console.error('Stake error:', error);
      setTxStatus('error');
    },
  });

  // Update the contract write configs
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: stakingABI,
    functionName: 'withdraw',
    args: [BigInt(activeWithdrawal?.type === 'normal' ? activeWithdrawal.index : 0)],
    enabled: activeWithdrawal?.type === 'normal'
  });

  const { config: emergencyWithdrawConfig } = usePrepareContractWrite({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: stakingABI,
    functionName: 'emergencyWithdraw',
    args: [BigInt(activeWithdrawal?.type === 'emergency' ? activeWithdrawal.index : 0)],
    enabled: activeWithdrawal?.type === 'emergency'
  });

  // Update the success handlers
  const { write: withdraw, isLoading: isWithdrawing } = useContractWrite({
    ...withdrawConfig,
    onSuccess: (data) => {
      console.log('Withdraw Success:', {
        hash: data.hash,
        index: withdrawIndexRef.current
      });
      setTxHash(data.hash);
      setTxStatus('success');
      refetchStakes();
      refetchTokenBalance();
      withdrawIndexRef.current = null;
      setWithdrawingIndex(null);
      setActiveWithdrawal(null);
    },
    onError: (error) => {
      console.error('Withdraw Error:', error);
      setTxStatus('error');
      withdrawIndexRef.current = null;
      setWithdrawingIndex(null);
      setActiveWithdrawal(null);
    },
  });

  const { write: emergencyWithdraw, isLoading: isEmergencyWithdrawing } = useContractWrite({
    ...emergencyWithdrawConfig,
    onSuccess: (data) => {
      console.log('Emergency withdrawal successful:', data);
      setTxHash(data.hash);
      setTxStatus('success');
      refetchStakes();
      refetchTokenBalance();
      emergencyWithdrawIndexRef.current = null;
      setEmergencyWithdrawingIndex(null);
      setActiveWithdrawal(null);
    },
    onError: (error) => {
      console.error('Emergency withdrawal error:', error);
      setTxStatus('error');
      emergencyWithdrawIndexRef.current = null;
      setEmergencyWithdrawingIndex(null);
      setActiveWithdrawal(null);
    },
  });

  // Single effect to handle both types of withdrawals
  useEffect(() => {
    if (!activeWithdrawal) return;

    const { type, index } = activeWithdrawal;
    if (type === 'normal' && withdraw) {
      withdrawIndexRef.current = index;
      withdraw();
    } else if (type === 'emergency' && emergencyWithdraw) {
      emergencyWithdrawIndexRef.current = index;
      emergencyWithdraw();
    }
  }, [activeWithdrawal, withdraw, emergencyWithdraw]);

  const emergencyWithdrawStake = async (stakeIndex: number) => {
    if (!address) {
      console.error('No address available');
      return;
    }

    const stake = userStakes?.[stakeIndex];
    if (!stake) {
      console.error('Invalid stake for emergency withdrawal:', { stakeIndex, exists: !!stake, active: stake?.active });
      return;
    }

    setEmergencyWithdrawingIndex(stakeIndex);
    setActiveWithdrawal({ type: 'emergency', index: stakeIndex });
  };

  const withdrawStake = async (stakeIndex: number) => {
    if (!address) {
      console.error('No address available');
      return;
    }

    setWithdrawingIndex(stakeIndex);
    setActiveWithdrawal({ type: 'normal', index: stakeIndex });
  };

  // Add function to check if a stake is ready for withdrawal
  const isStakeReadyForWithdrawal = (stake: any) => {
    if (!stake || !stake.active) return false;
    const endTime = Number(stake.endTime) * 1000;
    return endTime <= Date.now();
  };

  // Add function to get stake status
  const getStakeStatus = (stake: any) => {
    if (!stake) return 'Unknown';
    if (!stake.active) return 'Withdrawn';
    const endTime = Number(stake.endTime) * 1000;
    if (endTime > Date.now()) return 'Locked';
    return 'Ready to Withdraw';
  };

  // Add function to get stake reward
  const getStakeReward = (stake: any) => {
    if (!stake) return BigInt(0);
    const rewardMultiplier = getRewardMultiplier(stake.lockPeriod);
    const reward = (stake.amount * BigInt(Math.floor((rewardMultiplier - 1) * 1e18))) / BigInt(1e18);
    return reward;
  };

  // Add function to calculate total amount with rewards
  const calculateStakeTotal = (stake: any) => {
    if (!stake) return { originalAmount: 0, rewardAmount: 0, totalAmount: 0 };
    
    const originalAmount = Number(formatEther(stake.amount));
    const rewardMultiplier = getRewardMultiplier(stake.lockPeriod);
    const rewardAmount = originalAmount * (rewardMultiplier - 1); // Subtract 1 because we want just the reward
    const totalAmount = originalAmount + rewardAmount;
    
    return {
      originalAmount,
      rewardAmount,
      totalAmount
    };
  };

  // Helper function to get reward multiplier based on lock period
  const getRewardMultiplier = (lockPeriod: number) => {
    switch (lockPeriod) {
      case 0: // 1 minute
        return 1.1; // 10% reward
      case 1: // 2 minutes
        return 1.25; // 25% reward
      case 2: // 3 minutes
        return 1.5; // 50% reward
      default:
        return 1;
    }
  };

  // Add event listener for stake completion
  useEffect(() => {
    if (!address) return;

    const checkStakes = () => {
      if (userStakes) {
        userStakes.forEach((stake, index) => {
          if (stake.active && Number(stake.endTime) * 1000 <= Date.now()) {
            console.log(`Stake ${index} is ready for withdrawal`, {
              stake,
              currentTime: Date.now(),
              endTime: Number(stake.endTime) * 1000,
              amount: formatEther(stake.amount),
              lockPeriod: stake.lockPeriod
            });
          }
        });
      }
    };

    // Check stakes every 30 seconds
    const interval = setInterval(checkStakes, 30000);
    checkStakes(); // Initial check

    return () => clearInterval(interval);
  }, [address, userStakes]);

  // Wrapper functions for contract calls
  const approveTokens = async () => {
    if (!approve) {
      console.error('Approve function not available');
      return;
    }

    try {
      console.log('Attempting to approve tokens:', amountInWei?.toString());
      setTxStatus('pending');
      const result = await approve();
      console.log('Approve result:', result);
      return result;
    } catch (error) {
      console.error('Error approving tokens:', error);
      setTxStatus('error');
      throw error;
    }
  };

  const stakeTokens = async () => {
    if (!stake) {
      console.error('Stake function not available', {
        hasAddress: !!address,
        hasAmount: !!amountInWei,
        hasLockPeriod: lockPeriodNum !== undefined,
        validAmount: Number(amount) > 0,
        hasEnoughAllowance: allowance >= (amountInWei || BigInt(0)),
        stakeConfig: !!stakeConfig
      });
      return;
    }

    try {
      console.log('Attempting to stake:', { amountInWei: amountInWei?.toString(), lockPeriodNum });
      setTxStatus('pending');
      const result = await stake();
      console.log('Stake result:', result);
      return result;
    } catch (error) {
      console.error('Error staking tokens:', error);
      setTxStatus('error');
      throw error;
    }
  };

  // Add function to check contract balance and total rewards needed
  const checkContractBalance = () => {
    if (!userStakes || !contractTokenBalance) return null;

    const totalRewardsNeeded = userStakes.reduce((acc, stake) => {
      if (!stake.active) return acc;
      const rewardMultiplier = getRewardMultiplier(stake.lockPeriod);
      const rewardAmount = (stake.amount * BigInt(Math.floor((rewardMultiplier - 1) * 1e18))) / BigInt(1e18);
      return acc + rewardAmount;
    }, BigInt(0));

    const totalStaked = userStakes.reduce((acc, stake) => {
      if (!stake.active) return acc;
      return acc + stake.amount;
    }, BigInt(0));

    const totalPayoutNeeded = totalStaked + totalRewardsNeeded;

    return {
      contractBalance: contractTokenBalance,
      totalStaked,
      totalRewardsNeeded,
      totalPayoutNeeded,
      hasEnoughBalance: contractTokenBalance >= totalPayoutNeeded,
      readable: {
        contractBalance: formatEther(contractTokenBalance),
        totalStaked: formatEther(totalStaked),
        totalRewardsNeeded: formatEther(totalRewardsNeeded),
        totalPayoutNeeded: formatEther(totalPayoutNeeded)
      }
    };
  };

  // Add contract event listener for WithdrawDebug
  useContractEvent({
    address: STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: stakingABI,
    eventName: 'WithdrawDebug',
    listener: (logs) => {
      logs.forEach((log) => {
        const { user, stakeId, stakeAmount, rewardMultiplier, calculatedReward, totalPayout, contractBalance } = log.args;
        console.log('Withdraw Debug Event:', {
          user,
          stakeId: stakeId.toString(),
          stakeAmount: stakeAmount.toString(),
          rewardMultiplier: rewardMultiplier.toString(),
          calculatedReward: calculatedReward.toString(),
          totalPayout: totalPayout.toString(),
          contractBalance: contractBalance.toString(),
          readable: {
            stakeAmount: formatEther(stakeAmount),
            rewardMultiplier: formatEther(rewardMultiplier),
            calculatedReward: formatEther(calculatedReward),
            totalPayout: formatEther(totalPayout),
            contractBalance: formatEther(contractBalance)
          }
        });
      });
    }
  });

  return {
    tokenBalance,
    userStakes,
    totalStaked,
    allowance,
    approveTokens,
    stakeTokens,
    withdrawStake,
    emergencyWithdrawStake,
    calculateStakeTotal,
    checkContractBalance,
    isApproving,
    isStaking,
    isWithdrawing,
    isEmergencyWithdrawing,
    withdrawingIndex,
    emergencyWithdrawingIndex,
    txHash,
    txStatus,
    isStakeReadyForWithdrawal,
    getStakeStatus,
    getStakeReward,
  };
} 