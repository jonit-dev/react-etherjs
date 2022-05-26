import { ethers } from 'ethers';
import {
  ConnectionStatus,
  IChangeNetworkParams,
  IWalletProvider,
} from '../types/ProviderTypes';
export class Ethers implements IWalletProvider {
  public static provider: ethers.providers.Web3Provider | null = null;
  public static accounts: string[] = [];
  public static signer: ethers.Signer | null = null;

  public init(): Ethers | undefined {
    try {
      if (this.isInstalled()) {
        Ethers.provider = new ethers.providers.Web3Provider(window.ethereum);
        Ethers.signer = Ethers.provider?.getSigner();
        return this;
      } else {
        throw new Error(
          'Failed to initialize EtherJS Provider: Metamask is not installed.'
        );
      }
    } catch (error) {
      console.error(error);
    }

    return undefined;
  }

  public isInitialized(): boolean {
    return Ethers.provider !== null;
  }

  public isInstalled(): boolean {
    if (window.ethereum && window.ethereum.isMetaMask) {
      return true;
    }

    return false;
  }

  public getSigner(): ethers.Signer | null {
    return Ethers.provider?.getSigner()!;
  }

  public getProvider(): ethers.providers.Web3Provider | null {
    return Ethers.provider;
  }

  public getCurrentAccount(): string {
    return Ethers.accounts?.[0];
  }

  public async getConnectionStatus(): Promise<ConnectionStatus> {
    return (await this.isConnected())
      ? ConnectionStatus.Connected
      : ConnectionStatus.Disconnected;
  }

  public async isConnected(): Promise<boolean> {
    if (!this.isInitialized() || !this.isInstalled()) {
      return false;
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (!accounts || accounts.length === 0) {
      return false;
    }

    Ethers.accounts = accounts;

    return accounts.length > 0;
  }

  public async connect(): Promise<void> {
    if (this.isInitialized()) {
      await this.getAccounts();
    }
  }

  public async getAccounts(): Promise<string[] | undefined> {
    const accounts = await Ethers.provider?.send('eth_requestAccounts', []);

    if (!accounts) {
      throw new Error(
        'Oops! Failed to load your Metamask accounts. Please, try again.'
      );
    }

    Ethers.accounts = accounts;

    return accounts;
  }

  public async changeNetwork(
    chainId: string,
    createParams: IChangeNetworkParams[]
  ) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      //@ts-ignore
      if (switchError.code === 4902) {
        try {
          // then lets add it
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [...createParams],
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError);
        }
      }
    }
  }

  public async getNetwork(): Promise<number> {
    const { chainId } = await Ethers.provider?.getNetwork()!;
    return chainId;
  }
}

const ethersProvider = new Ethers();

export { ethersProvider };
