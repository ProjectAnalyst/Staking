import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { http } from 'viem';

const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: { name: 'Base Sepolia ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
  // Disable ENS resolution on Base Sepolia
  ens: {
    address: '0x0000000000000000000000000000000000000000',
  },
};

const { publicClient } = configureChains(
  [baseSepolia],
  [publicProvider()]
);

export { publicClient }; 