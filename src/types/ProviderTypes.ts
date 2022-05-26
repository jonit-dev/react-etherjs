export interface IWalletProvider {
  isInstalled: () => void;
  isConnected: () => Promise<boolean>;
  connect: () => Promise<void>;
  getAccounts: () => Promise<string[] | undefined>;
}

export enum ConnectionStatus {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
}
