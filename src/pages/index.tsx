'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useStaking } from '../hooks/useStaking';
import { formatEther } from 'ethers';
import { stakingABI } from '../abi/stakingABI';
import { EmergencyWithdrawDialog } from '../components/EmergencyWithdrawDialog';
import { StakeCard } from '../components/StakeCard';

const STAKING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS;

if (!STAKING_CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS is not set in environment variables');
}

export default function Home() {
  const { address, isConnecting } = useAccount();
  const [amount, setAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('0');
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emergencyWithdrawStakeIndex, setEmergencyWithdrawStakeIndex] = useState<number | null>(null);
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false);
  const [expandedStakeIndex, setExpandedStakeIndex] = useState<number | null>(null);
  const [showCompletedStakes, setShowCompletedStakes] = useState(false);
  const [emergencyWithdrawError, setEmergencyWithdrawError] = useState<string | null>(null);

  const {
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
  } = useStaking({ amount, lockPeriod });

  // Convert amount to BigInt for comparison
  const amountInWei = amount && !isNaN(Number(amount))
    ? BigInt(Math.floor(Number(amount) * 10 ** 18))
    : BigInt(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (txStatus === 'error') {
      setError('Transaction failed. Please try again.');
    } else if (txStatus === 'success') {
      setError(null);
    }
  }, [txStatus]);

  const handleApprove = async () => {
    console.log('Starting approval process...');
    try {
      setError(null);
      await approveTokens();
      console.log('Approval transaction sent');
    } catch (error) {
      console.error('Approval failed:', error);
      if (error.message.includes('user rejected')) {
        setError('Transaction was rejected by MetaMask. Please try again.');
      } else {
        setError('Approval failed. Please try again.');
      }
    }
  };

  const handleStake = async () => {
    console.log('Starting stake process...');
    if (!stakeTokens) {
      console.error('Stake function not available');
      setError('Staking is not available at this time. Please make sure you are connected to MetaMask.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      console.error('Invalid amount:', amount);
      setError('Please enter a valid amount greater than 0');
      return;
    }
    try {
      console.log('Attempting to stake:', { amount, lockPeriod });
      setError(null);
      await stakeTokens();
      console.log('Stake transaction sent');
    } catch (error) {
      console.error('Staking failed:', error);
      if (error.message.includes('user rejected')) {
        setError('Transaction was rejected by MetaMask. Please try again.');
      } else {
        setError('Staking failed. Please make sure you have enough tokens and have approved the contract.');
      }
    }
  };

  const handleEmergencyWithdraw = (stakeIndex: number) => {
    setEmergencyWithdrawStakeIndex(stakeIndex);
    setIsEmergencyDialogOpen(true);
    setEmergencyWithdrawError(null);
  };

  const confirmEmergencyWithdraw = async () => {
    if (emergencyWithdrawStakeIndex === null) return;

    try {
      await emergencyWithdrawStake(emergencyWithdrawStakeIndex);
      setIsEmergencyDialogOpen(false);
      setEmergencyWithdrawStakeIndex(null);
    } catch (error) {
      console.error('Emergency withdrawal failed:', error);
      setEmergencyWithdrawError(error.message || 'Emergency withdrawal failed. Please try again.');
    }
  };

  const renderUserStakes = () => {
    if (!userStakes || userStakes.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500">No stakes found</p>
        </div>
      );
    }

    const activeStakes = userStakes
      .map((stake, index) => ({ stake, originalIndex: index }))
      .filter(({ stake }) => stake.active);

    const completedStakes = userStakes
      .map((stake, index) => ({ stake, originalIndex: index }))
      .filter(({ stake }) => !stake.active);

    return (
      <div className="space-y-8">
        {/* Active Stakes Section */}
        {activeStakes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">Active Stakes</h3>
              <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                {activeStakes.length} Active
              </span>
            </div>
            <div className="grid gap-4">
              {activeStakes.map(({ stake, originalIndex }) => (
                <StakeCard
                  key={originalIndex}
                  stake={stake}
                  index={originalIndex}
                  isExpanded={expandedStakeIndex === originalIndex}
                  onExpand={() => setExpandedStakeIndex(expandedStakeIndex === originalIndex ? null : originalIndex)}
                  onWithdraw={() => withdrawStake(originalIndex)}
                  onEmergencyWithdraw={() => handleEmergencyWithdraw(originalIndex)}
                  isWithdrawing={withdrawingIndex === originalIndex}
                  isEmergencyWithdrawing={emergencyWithdrawingIndex === originalIndex}
                  isReadyForWithdrawal={isStakeReadyForWithdrawal(stake)}
                  status={getStakeStatus(stake)}
                  reward={Math.round(Number(formatEther(getStakeReward(stake)))).toString()}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Stakes Section */}
        {completedStakes.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">Completed Stakes</h3>
              <button
                onClick={() => setShowCompletedStakes(!showCompletedStakes)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <span>{showCompletedStakes ? 'Hide' : 'Show'} Completed</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showCompletedStakes ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            {showCompletedStakes && (
              <div className="grid gap-4">
                {completedStakes.map(({ stake, originalIndex }) => (
                  <StakeCard
                    key={originalIndex}
                    stake={stake}
                    index={originalIndex}
                    isExpanded={expandedStakeIndex === originalIndex}
                    onExpand={() => setExpandedStakeIndex(expandedStakeIndex === originalIndex ? null : originalIndex)}
                    onWithdraw={() => withdrawStake(originalIndex)}
                    onEmergencyWithdraw={() => handleEmergencyWithdraw(originalIndex)}
                    isWithdrawing={withdrawingIndex === originalIndex}
                    isEmergencyWithdrawing={emergencyWithdrawingIndex === originalIndex}
                    isReadyForWithdrawal={isStakeReadyForWithdrawal(stake)}
                    status={getStakeStatus(stake)}
                    reward={Math.round(Number(formatEther(getStakeReward(stake)))).toString()}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">MINI Token Staking</h1>
            <p className="text-xl text-gray-400">Stake your MINI tokens and earn rewards</p>
          </div>
          <ConnectButton />
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-8 mb-8 border border-[#2A2A2A] shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Stake</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 sm:text-sm">MINI</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lock Period</label>
                <select
                  value={lockPeriod}
                  onChange={(e) => setLockPeriod(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg py-3 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="0">1 Minute</option>
                  <option value="1">2 Minutes</option>
                  <option value="2">3 Minutes</option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg bg-red-900/50 p-4 border border-red-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                {allowance < amountInWei ? (
                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className={`w-full px-4 py-3 rounded-lg text-white font-medium ${
                      isApproving 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } transition-colors flex items-center justify-center`}
                  >
                    {isApproving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Approving...
                      </>
                    ) : 'Approve'}
                  </button>
                ) : (
                  <button
                    onClick={handleStake}
                    disabled={isStaking}
                    className={`w-full px-4 py-3 rounded-lg text-white font-medium ${
                      isStaking 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } transition-colors flex items-center justify-center`}
                  >
                    {isStaking ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Staking...
                      </>
                    ) : 'Stake'}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-lg p-6 border border-[#3A3A3A] shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Token Balance</span>
                  <span className="font-medium text-white">{tokenBalance} MINI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Staked</span>
                  <span className="font-medium text-white">{totalStaked} MINI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Contract Balance</span>
                  <span className="font-medium text-white">
                    {checkContractBalance()?.contractBalance ? Math.round(Number(formatEther(checkContractBalance().contractBalance))) : 0} MINI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isClient && address ? (
          renderUserStakes()
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2A2A2A] flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">Please connect your wallet to view your stakes</p>
          </div>
        )}
      </div>

      {isEmergencyDialogOpen && emergencyWithdrawStakeIndex !== null && (
        <EmergencyWithdrawDialog
          isOpen={isEmergencyDialogOpen}
          onClose={() => {
            setIsEmergencyDialogOpen(false);
            setEmergencyWithdrawStakeIndex(null);
            setEmergencyWithdrawError(null);
          }}
          onConfirm={confirmEmergencyWithdraw}
          stakeAmount={Number(formatEther(userStakes[emergencyWithdrawStakeIndex].amount))}
          isLoading={isEmergencyWithdrawing}
          error={emergencyWithdrawError}
        />
      )}
    </div>
  );
} 