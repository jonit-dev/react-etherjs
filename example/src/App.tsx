import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { EthersProvider } from '../../src/components/EthersProvider';
import { CHAIN_INFO } from '../../src/constants/networkConstants';
import { useEthers } from '../../src/hooks/useEthers';
import { ConnectionStatus } from '../../src/types/ProviderTypes';

export const App: React.FC = () => {
  const ethersProvider = useEthers();
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.Disconnected
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

  return (
    <EthersProvider
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
      <p>
        EtherJS initialized?{' '}
        <strong>{ethersProvider?.isInitialized() ? 'true' : 'false'}</strong>
      </p>
      <p>
        Connection status: <strong>{connectionStatus}</strong>
      </p>
    </EthersProvider>
  );
};
