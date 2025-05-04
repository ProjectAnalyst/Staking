export const stakingABI = [
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "period", type: "uint8" }
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "stakeIndex", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "stakeIndex", type: "uint256" }],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserStakingInfo",
    outputs: [
      {
        components: [
          { name: "amount", type: "uint128" },
          { name: "startTime", type: "uint48" },
          { name: "endTime", type: "uint48" },
          { name: "lockPeriod", type: "uint8" },
          { name: "rewardMultiplier", type: "uint256" },
          { name: "active", type: "bool" }
        ],
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stakeId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stakeAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rewardMultiplier",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "calculatedReward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalPayout",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contractBalance",
        "type": "uint256"
      }
    ],
    "name": "WithdrawDebug",
    "type": "event"
  }
] as const; 