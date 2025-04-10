import { chain, getChainId } from '@/eth/deploy';
import { eventBus, timeoutPromise } from '@/utils';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { getOnboardInstance } from './onboard';

export const getEthWalletAddress = async () => {
  const wallets = await getOnboardInstance()?.connectWallet();
  if (wallets && wallets.length > 0) {
    const walletProvider = wallets[0].provider;
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = ethersProvider.getSigner();
    console.log(ethersProvider);
    window.ethereumYala = walletProvider;
    window.YalaEthProvider = ethersProvider;
    localStorage.setItem('connectedWalletLabel', wallets[0].label);
    await checkNetworkVersion();
    const address = await signer.getAddress();
    console.log(address);
    return address;
  }
  return '';
};

export const signMessage = async (message: string) => {
  console.log(window.YalaEthProvider);
  if (!window.YalaEthProvider) {
    return;
  }
  const signer = window.YalaEthProvider.getSigner();

  const res = await signer.signMessage(message);
  return res;
};

export const getWeb3Eth = async () => {
  const savedWalletLabel = localStorage.getItem('connectedWalletLabel');
  console.log(savedWalletLabel);
  try {
    if (savedWalletLabel && localStorage.getItem('Authorization')) {
      const connected = await getOnboardInstance()?.connectWallet({
        autoSelect: { label: savedWalletLabel, disableModals: true },
      });
      console.log(connected);
      if (connected && connected.length > 0) {
        const walletProvider = connected[0].provider;
        const ethersProvider = new ethers.providers.Web3Provider(
          walletProvider
        );
        window.ethereumYala = walletProvider;
        window.YalaEthProvider = ethersProvider;
        console.log(window.YalaEthProvider);
        console.log(ethersProvider);
        await checkNetworkVersion();
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        if (address) {
          return address;
        } else {
          return '';
        }
      }
      return '';
    } else {
      return '';
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem('connectedWalletLabel');
    return '';
  }
};

export const disconnectWallet = async () => {
  const wallets = getOnboardInstance()?.state.get().wallets;
  if (wallets && wallets.length > 0 && wallets[0]) {
    const walletProvider = wallets[0].provider;
    // @ts-ignore
    await walletProvider.off('accountsChanged', accountChanged);
    await getOnboardInstance()?.disconnectWallet({ label: wallets[0].label });
    // @ts-ignore
    if (walletProvider.removeAllListeners) {
      console.log(walletProvider);
      // @ts-ignore
      walletProvider.removeAllListeners();
    }

    console.log(`Disconnected from wallet: ${wallets[0].label}`);
  }
};

const accountChanged = () => {
  eventBus.emit('emitAdderss', 'ETH');
  disconnectWallet();
};

export async function checkNetworkVersion(type?: boolean) {
  console.log(window.location.pathname);
  try {
    window.ethereumYala.on('chainChanged', (chainId: any) => {
      console.log(ethers.BigNumber.from(chainId).toString());
      if (chainId !== ethers.utils.hexValue(getChainId() as any)) {
        window.location.reload();
      }
    });
    window.ethereumYala.on('accountsChanged', async (accounts: Array<string>) => {
        console.log(accounts);
        accountChanged();
      }
    );
    console.log(window.ethereumYala);
    const netVersion = await Promise.race([
      window.ethereumYala.request({ method: 'net_version' }),
      timeoutPromise(),
    ]);
    console.log(netVersion);
    if (netVersion != getChainId()) {
      console.log(netVersion);
      try {
        await window.ethereumYala.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(getChainId()) }],
        });
        console.log('ID:', getChainId());
        await getWeb3Eth();
        // window.location.reload()
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await addNetwork();
        }
      }
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export const addNetwork = async () => {
  let item = chain(getChainId() as any);
  if (!window.ethereumYala) {
    return;
  }
  await window.ethereumYala.request({
    method: 'wallet_addEthereumChain', // Metamask api
    params: [
      {
        chainId: ethers.utils.hexlify(item!.chainId), // hex16
        chainName: item!.chainName, // name
        rpcUrls: item!.rpcUrls, // rpc addr
        blockExplorerUrls: item!.blockExplorerUrls,
        nativeCurrency: item!.nativeCurrency,
      },
    ],
  });
};


export const getProvider = (provider: ethers.providers.Web3Provider) => {
  const wallets = getOnboardInstance()?.state.get().wallets;
  if (wallets && wallets.length > 0) {
    wallets[0].provider.removeListener('connect', (error: any) => {
      console.log('Disconnected:', error);
    });
    wallets[0].provider.removeListener('disconnect', (error: any) => {
      console.log('Disconnected:', error);
    });
    wallets[0].provider.removeListener('message', (error: any) => {
      console.log('Disconnected:', error);
    });
    provider = new Web3Provider(wallets[0].provider, provider.network);
  }
  return provider;
};