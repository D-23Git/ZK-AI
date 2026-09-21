import { createProviders } from './providers';
import { PrivateDataProof } from '../contracts/managed/PrivateDataProof';
import { deployContract } from '@midnight-ntwrk/midnight-js';
import * as Rx from 'rxjs';

async function main() {
  console.log('🔗 Connecting to Midnight Preprod Network...');
  
  // Create providers (DApp connector, indexer, proof server)
  const providers = await createProviders();
  
  const walletCtx = providers.walletProvider;
  if (!walletCtx) {
    throw new Error('Wallet not connected. Make sure 1AM wallet is available.');
  }

  // 1. Wait for wallet to sync
  console.log('🔄 Syncing wallet state...');
  const state = await Rx.firstValueFrom(walletCtx.state().pipe(Rx.filter(s => s.isSynced)));
  console.log(`✅ Wallet synced! Address: ${state.address}`);

  // 2. Check DUST balance
  console.log('💰 Checking DUST token balance...');
  const dustBalance = state.dust.balance(new Date());
  if (dustBalance === 0n) {
    console.log('⚠️ DUST balance is 0. Registering unshielded UTXOs to generate DUST...');
    
    // In a real scenario, we would register night UTXOs for DUST generation here
    // But since this is a preprod wallet, we assume DUST is already available or will be funded
    console.log('⏳ Please fund your wallet with tNIGHT and generate DUST using the 1AM wallet UI.');
    process.exit(1);
  }
  
  console.log(`✅ DUST balance sufficient: ${dustBalance.toLocaleString()}`);

  // 3. Deploy the Smart Contract
  console.log('🚀 Deploying PrivateDataProof.compact to Preprod...');
  
  try {
    // This requires the compiled PrivateDataProof.ts to exist in contracts/managed
    const deployed = await deployContract(providers, {
      compiledContract: PrivateDataProof,
      args: [], // No constructor arguments needed for PrivateDataProof based on the compact code
      initialPrivateState: {},
    });

    const contractAddress = deployed.deployTxData.public.contractAddress;
    console.log('\n🎉 ==================================== 🎉');
    console.log('✅ Contract Deployed Successfully!');
    console.log(`📜 Contract Address: ${contractAddress}`);
    console.log(`🔗 Tx Hash: ${deployed.deployTxData.txHash}`);
    console.log('🎉 ==================================== 🎉\n');

  } catch (error: any) {
    console.error('\n❌ Deployment Failed!');
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
      console.error('ERROR: Could not find the compiled contract file.');
      console.error('Please make sure you have placed the compiled PrivateDataProof.ts file inside the "contracts/managed/" folder.');
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main().catch(console.error);
