import React from 'react';
import { formatEther } from 'ethers';

interface Stake {
  amount: bigint;
  startTime: number;
  endTime: number;
  lockPeriod: number;
  rewardMultiplier: bigint;
  active: boolean;
}

interface StakeCardProps {
  stake: Stake;
  index: number;
  isExpanded: boolean;
  onExpand: () => void;
  onWithdraw: () => void;
  onEmergencyWithdraw: () => void;
  isWithdrawing: boolean;
  isEmergencyWithdrawing: boolean;
  isReadyForWithdrawal: boolean;
  status: string;
  reward: string;
}

export const StakeCard: React.FC<StakeCardProps> = ({
  stake,
  index,
  isExpanded,
  onExpand,
  onWithdraw,
  onEmergencyWithdraw,
  isWithdrawing,
  isEmergencyWithdrawing,
  isReadyForWithdrawal,
  status,
  reward,
}) => {
  const startTime = new Date(Number(stake.startTime) * 1000);
  const endTime = new Date(Number(stake.endTime) * 1000);
  const amount = Number(formatEther(stake.amount)).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={onExpand}
        className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {amount} MINI
            </span>
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">
              {stake.lockPeriod === 0 ? '1 Minute' : stake.lockPeriod === 1 ? '2 Minutes' : '3 Minutes'} Lock
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {status}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isReadyForWithdrawal ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWithdraw();
              }}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isWithdrawing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Withdrawing...
                </>
              ) : (
                'Withdraw'
              )}
            </button>
          ) : stake.active ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmergencyWithdraw();
              }}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isEmergencyWithdrawing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } transition-colors`}
              disabled={isEmergencyWithdrawing}
            >
              {isEmergencyWithdrawing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Emergency Withdraw'
              )}
            </button>
          ) : null}
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isExpanded && (
        <div className="p-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-medium">{startTime.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Time</p>
              <p className="font-medium">{endTime.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Staked Amount</p>
              <p className="font-medium text-gray-900">{amount} MINI</p>
            </div>
            {stake.active && (
              <div>
                <p className="text-sm text-gray-500">Reward</p>
                <p className="font-medium text-green-600">{Number(reward).toFixed(2)} MINI</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 