// =============================================================================
// AURA ZK-AI - Midnight Network Configuration
// Preprod / Testnet / Local Simulator Configuration
// =============================================================================

export interface MidnightConfig {
  networkId: 'preprod' | 'testnet' | 'devnet-simulator';
  indexerUrl: string;
  nodeUrl: string;
  proofServerUrl: string;
  contractAddress: string;
  contractPackage: string;
  explorerBaseUrl: string;
  useLiveNetwork: boolean;
}

export const MIDNIGHT_CONFIG: MidnightConfig = {
  networkId: (process.env.MIDNIGHT_NETWORK as any) || 'preprod',
  indexerUrl: process.env.MIDNIGHT_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v1/graphql',
  nodeUrl: process.env.MIDNIGHT_NODE_URL || 'https://rpc.preprod.midnight.network',
  proofServerUrl: process.env.MIDNIGHT_PROOF_SERVER_URL || 'http://localhost:6300',
  contractAddress: process.env.MIDNIGHT_CONTRACT_ADDRESS || '82f0731b0b4c5c81c44e0c14b21a2c1ee930a13109df422cf8b60bf954ee0c0b',
  contractPackage: 'aura_zk_ai_contract_v1',
  explorerBaseUrl: 'https://preprod.midnightexplorer.com/contracts',
  useLiveNetwork: process.env.MIDNIGHT_USE_LIVE === 'true'
};
