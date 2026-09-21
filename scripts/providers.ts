import { DAppConnectorProviders } from '@midnight-ntwrk/dapp-connector-api';
import { NetworkId } from '@midnight-ntwrk/midnight-js';

// Setup providers for Preprod
export const createProviders = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    throw new Error('DApp Connector requires a browser environment to connect to 1AM Wallet.');
  }
  
  if (!(window as any).midnight) {
    throw new Error('Midnight 1AM Wallet extension not found.');
  }

  const walletProvider = await (window as any).midnight.mnLace.enable();
  
  return {
    walletProvider,
    networkId: NetworkId.TestNet, // Midnight Preprod
    // We mock indexer and proof server for the deployment script if they are not running locally
    indexer: null,
    proofServer: null,
  };
};
