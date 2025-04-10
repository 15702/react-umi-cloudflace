import Onboard, { OnboardAPI } from '@web3-onboard/core'; 
import { ethers } from 'ethers';
import injectedModule from '@web3-onboard/injected-wallets';
import { chain, getChainId } from './deploy';
import { URL } from '@/utils/constants';

const injected = injectedModule();
const chainInfo = chain(getChainId() as any);

let onboard: OnboardAPI | null = null;

export function getOnboardInstance(): OnboardAPI | null {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!onboard) {
    onboard = Onboard({
      wallets: [injected],
      chains: [
        {
          id: ethers.utils.hexlify(chainInfo!.chainId),
          token: chainInfo!.nativeCurrency.symbol,
          label: chainInfo!.chainName,
          rpcUrl: chainInfo!.rpcUrls[0],
        },
      ],
      appMetadata: {
        name: 'Yala',
        icon: `/assets/yala_logo.svg`,
        logo: `/assets/logo.svg`,
        description: URL.BROWSER_TITLE,
      },
    });
  }

  return onboard;
}
