import { ethers } from 'ethers';
import { IWalletProvider } from '../types/ProviderTypes';
export class Ethers implements IWalletProvider {
  public static provider: ethers.providers.Web3Provider | null = null;
  public accounts: string[] = [];

  public init(): Ethers | undefined {
    try {
      if (this.isInstalled()) {
        Ethers.provider = new ethers.providers.Web3Provider(window.ethereum);

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

  public async isConnected(): Promise<boolean> {
    if (!this.isInitialized() || !this.isInstalled()) {
      return false;
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (!accounts) {
      return false;
    }

    return accounts.length > 0;
  }

  public async connect(): Promise<void> {
    if (this.isInitialized()) {
      await this.getAccounts();
    }
  }

  public async disconnect(): Promise<void> {}

  public async getAccounts(): Promise<string[] | undefined> {
    const accounts = await Ethers.provider?.send('eth_requestAccounts', []);

    if (!accounts) {
      throw new Error(
        'Oops! Failed to load your Metamask accounts. Please, try again.'
      );
    }

    return accounts;
  }
}

const ethersProvider = new Ethers();

export { ethersProvider };
