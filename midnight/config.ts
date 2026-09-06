// =============================================================================
// PrivateData AI - Midnight Network Configuration
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
  contractAddress: process.env.MIDNIGHT_CONTRACT_ADDRESS || '0x9a8f4c2b1e7d3a509876543210abcdef0123456789abcdef0123456789abcdef',
  contractPackage: 'privatedata_ai_contract_v1',
  explorerBaseUrl: 'https://explorer.preprod.midnight.network',
  // Toggles between real Midnight compact contract execution and devnet cryptographic simulation
  useLiveNetwork: process.env.MIDNIGHT_USE_LIVE === 'true'
};
