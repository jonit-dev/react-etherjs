import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { EthersProvider } from '../../src/components/EthersProvider';
import { CHAIN_INFO } from '../../src/constants/networkConstants';
import { useContract } from '../../src/hooks/useContract';
import { useEthers } from '../../src/hooks/useEthers';
import { ConnectionStatus } from '../../src/types/ProviderTypes';
import storageABI from './contracts/storage.json';

export const App: React.FC = () => {
  const ethersProvider = useEthers();
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.Disconnected
  );
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [numberToStore, setNumberToStore] = useState<number>(0);
  const [retrievedNumber, setRetrievedNumber] = useState<number>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const storageContract = useContract(
    '0xd5A00b125b4edA2159874738f1be086ee56f5645',
    storageABI
  );

  const checkConnectionStatus = async () => {
    if (ethersProvider) {
      setConnectionStatus(await ethersProvider.getConnectionStatus());
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, [ethersProvider]);

  const onProviderConnect = async () => {
    await ethersProvider?.connect();
    await checkConnectionStatus();
  };

  const onChangeNetwork = async () => {
    await ethersProvider?.changeNetwork(ethers.utils.hexlify(137), [
      {
        chainId: ethers.utils.hexlify(137),
        chainName: 'Matic(Polygon) Mainnet',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://www.polygonscan.com/'],
      },
    ]);
  };

  const onStoreContractNumber = async () => {
    try {
      if (storageContract) {
        setIsLoading(true);
        const tx = await storageContract.store(numberToStore);
        await tx.wait();
        setIsLoading(false);
      } else {
        throw new Error('Contract is not loaded!');
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const onRetrieveNumber = async () => {
    if (storageContract) {
      setIsLoading(true);
      const tx = await storageContract.retrieve();

      setRetrievedNumber(Number(tx));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Contract is not loaded!');
    }
  };

  return (
    <EthersProvider
      onChangeAccount={newAcc => setCurrentAccount(newAcc)}
      onNetworkChanged={id => {
        const networkId = parseInt(id);
        console.log(
          'network changed',
          networkId,
          //@ts-ignore
          `(${CHAIN_INFO[networkId] || 'Unknown'})`
        );
      }}
      onChangeConnectionStatus={status => setConnectionStatus(status)}
      options={{ showDebug: true }}
    >
      <h1>EtherJS lib</h1>

      <ul>
        <li>
          <a href="#" onClick={onProviderConnect}>
            Connect EtherJS
          </a>
        </li>
        <li>
          <a href="#" onClick={onChangeNetwork}>
            Change Network
          </a>
        </li>
      </ul>

      <h3>Environment</h3>

      <ul>
        <li>
          <b>Metamask installed?</b>{' '}
          {JSON.stringify(ethersProvider?.isInstalled() || false)}
        </li>
        <li>
          <b>EtherJS initialized:</b>{' '}
          {JSON.stringify(ethersProvider?.isInitialized() || false)}
        </li>
        <li>
          <b>Connection status:</b> {connectionStatus}
        </li>
        <li>
          <b>Current account:</b> {currentAccount}
        </li>
      </ul>

      <h3>Contract Example</h3>

      {storageContract ? (
        <>
          <ul>
            <li>
              <strong>Address</strong>: {storageContract.address}
            </li>
            <li>
              {isLoading ? (
                'Processing transaction...'
              ) : (
                <>
                  <input
                    type="number"
                    placeholder="Store a number"
                    value={numberToStore}
                    onChange={e => setNumberToStore(Number(e.target.value))}
                  />
                  <button onClick={onStoreContractNumber}>Store</button>
                </>
              )}
            </li>
            <br />
            <li>
              {isLoading ? (
                'Processing transaction...'
              ) : (
                <>
                  <strong>Retrieved number:</strong> {retrievedNumber}
                  <br />
                  <button onClick={onRetrieveNumber}>Retrieve</button>
                </>
              )}
            </li>
          </ul>
        </>
      ) : (
        <p>Loading contract...</p>
      )}
    </EthersProvider>
  );
};
