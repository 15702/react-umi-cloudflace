export enum CaptchaType  {
  ADMIN_ADD = 1,
  ADMIN_UPDATE_SELF = 2,
  ADMIN_UPDATE_OTHERS = 3,
}

export enum PermissionType {
  API = 'API',
  MENU = 'MENU',
  BUTTON = 'BUTTON',
}

export enum PlatformType {
  OFFICIAL_WEB = 'OFFICIAL_WEB',
  DAPP = 'DAPP',
}

export enum Env {
  TESTINNER = 'testInner',
  TESTNET = 'testNet',
  PROD = 'prod',
}

export const currentEnv = Env.TESTINNER

export enum TYPE_CHAIN {
  BTCTestnet = -1,
  BTC = 0,
  ETH = 1,
  Sepolia = 11155111,
  Botanix = 3637,
  BotanixTestnet = 3636,
  Arbitrum = 42161,
  ArbitrumSepolia = 421614,
  Inner = 1337
}

export const ChainList = [
  {
    chainId: TYPE_CHAIN.ETH,
    chainName: 'Ethereum Mainnet',
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  {
    chainId: TYPE_CHAIN.Sepolia,
    chainName: 'Sepolia',
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: { name: 'SepoliaETH', symbol: 'SepoliaETH', decimals: 18 },
  },
];

export function getChainId() {
  switch (currentEnv) {
    // @ts-ignore
    case Env.LIVE:
      return TYPE_CHAIN.ETH;
    // @ts-ignore
    case Env.TESTINNER:
      return TYPE_CHAIN.Sepolia;
    // @ts-ignore
    case Env.TESTNET:
      return TYPE_CHAIN.Sepolia;
    default: {
      return TYPE_CHAIN.Sepolia;
    }
  }
}

export function chain(chainId: TYPE_CHAIN) {
  const list = ChainList;
  for (let index in list) {
    const item = list[index];
    if (item.chainId === chainId) {
      return item;
    }
  }
}