export interface IWalletProvider {
  isInstalled: () => void;
  isConnected: () => Promise<boolean>;
  connect: () => Promise<void>;
  getAccounts: () => Promise<string[] | undefined>;
  changeNetwork: (
    chainId: string,
    createParams: IChangeNetworkParams[]
  ) => Promise<void>;
}

export enum ConnectionStatus {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}

export interface IChangeNetworkParams {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}
