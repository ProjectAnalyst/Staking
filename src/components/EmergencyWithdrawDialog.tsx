import React from 'react';

interface EmergencyWithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stakeAmount: number;
  isLoading: boolean;
  error?: string;
}

export const EmergencyWithdrawDialog: React.FC<EmergencyWithdrawDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  stakeAmount,
  isLoading,
  error,
}) => {
  if (!isOpen) return null;

  const withdrawalAmount = stakeAmount * 0.7; // 70% of original amount
  const penaltyAmount = stakeAmount * 0.3; // 30% penalty

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-xl max-w-md w-full border border-[#2A2A2A]">
        <h2 className="text-xl font-semibold text-white mb-4">Emergency Withdraw</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg border border-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Original Amount:</span>
            <span className="font-medium text-white">{stakeAmount.toFixed(2)} MINI</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Withdrawal Amount (70%):</span>
            <span className="font-medium text-green-400">{withdrawalAmount.toFixed(2)} MINI</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Penalty (30%):</span>
            <span className="font-medium text-red-400">{penaltyAmount.toFixed(2)} MINI</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          ⚠️ You are attempting to withdraw your stake before the required staking period has completed. 
          Please note that this will result in a 30% penalty of your staked amount. 
          This action is irreversible.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300 disabled:opacity-50 border border-[#3A3A3A]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              'Confirm Emergency Withdraw'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 