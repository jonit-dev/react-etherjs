# React-EthersJS

### Getting Started

- Setting up Remix with Ganache for local testing
  - Check this article: https://medium.com/@kacharlabhargav21/using-ganache-with-remix-and-metamask-446fe5748ccf
- If you want just to test the lib, my advice is deploying the "Storage" smart contract to Ganache local client (you have to [download](https://trufflesuite.com/ganache/) it).

### Detailed example

Check our example folder for an in-depth usage.

## Main elements

### EthersProvider.tsx

- Wrapper component that provides useful information about your connection status, network changes, etc.
- Usage example:

```
<EthersProvider
      onChangeAccount={newAcc => setCurrentAccount(newAcc)}
      onNetworkChanged={id => {
        const networkId = parseInt(id);
        console.log(
          'network changed',
          networkId`
        );
      }}
      onChangeConnectionStatus={status => setConnectionStatus(status)}
      options={{ showDebug: true }}
    >
       ...Your app code here
</EthersProvider>
```

### useEthers

- That's a hook that you can call to have easy access to the Ethers.JS official provider.
- Usage example:

```
const ethersProvider = useEthers();
```

- **Available public methods (ethersProvider):**
  - **init()**
    - This is triggered automatically once you call useEthers.
  - **isInitialized(): boolean**
    - Check if Ethers.JS provider is initialized or not.
  - **isInstalled(): boolean**
    - Use this method to verify metamask installation.
  - **getSigner(): ethers.Signer | null**
    - This will return your provider signer.
  - **getProvider(): ethers.providers.Web3Provider | null**
    - Get your current EthersJS provider. Useful if you want to call a method that wasn't implemented by our lib.
  - **getCurrentAccount(): string**
    - Get the user's current metamask account.
  - **async getConnectionStatus(): Promise<ConnectionStatus>**
    - Get the user's metamask connection status (Connected | Disconnected);
  - **async isConnected(): Promise<boolean>**
    - Check if metamask is properly connected.
  - **async connect(): Promise<void>**
    - Trigger a metamask connect request.
  - **async getAccounts(): Promise<string[] | undefined>**
    - Get all user's account public addresses.
  - **public async changeNetwork( chainId: string, createParams: IChangeNetworkParam[])**
    - Programmatically change the user's metamask network. Initially, it tries to switch for a existing network by using the chainId. If not found, it prompts the user to create it by using the createParams.
  - **async getNetwork(): Promise<number>**
    - Get your networkId.

### useContract

- Hook to easily load your contract data.
- Note that you should first import your [ABI](https://docs.ethers.io/v5/api/utils/abi/)
- Types:
  - **useContract (address: string, ABI: ethers.ContractInterface)**
- Usage example:

```
import storageABI from './contracts/storage.json';

...

  const storageContract = useContract(
    '0xd5A00b125b4edA2159874738f1be086ee56f5645',
    storageABI
  );
```

### FAQ

#### How do I wait for a transaction to be mined (completed)?

- You should use the tx.wait() method to wait for it to be mined. Note that this only works for transactions that performs a write operation. For read-only operation, you just use a regular async await syntax.

```
 setIsLoading(true);
 const tx = await storageContract.store(numberToStore);
 await tx.wait();
 setIsLoading(false);
```

#### "call revert exception" when calling contract method

- The error call revert exception means that:
  - Method reverts during its execution.
  - Method is not present in your contract.
  - **Contract not deployed on the network you're connected to (or address put is incorrect).** - most common reason.
  - Your network has some temporary outages.

#### How do I disconnect from metamask?

- There's no way to achieve it programmatically. You have to inform your users to [disconnect manually](https://stackoverflow.com/questions/70378789/how-to-logout-from-metamask-account-in-reactjs-using-ethereum) or just simulate it for UX purposes.
