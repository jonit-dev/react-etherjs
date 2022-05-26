import React, { useEffect, useState } from 'react';

import { EthersProvider } from '../../src/components/EthersProvider';
import { useEthers } from '../../src/hooks/useEthers';
import { ConnectionStatus } from '../../src/types/ProviderTypes';

export const App: React.FC = () => {
  const ethers = useEthers();
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.Disconnected
  );

  const checkConnectionStatus = async () => {
    if (ethers) {
      setConnectionStatus(await ethers.getConnectionStatus());
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, [ethers]);

  const onProviderConnect = async () => {
    await ethers?.connect();
    await checkConnectionStatus();
  };

  return (
    <EthersProvider
      onNetworkChanged={id => console.log('network changed ', id)}
      onChangeConnectionStatus={status => setConnectionStatus(status)}
    >
      <p>EtherJS lib</p>
      <a href="#" onClick={onProviderConnect}>
        Connect EtherJS
      </a>
      <p>
        EtherJS initialized?{' '}
        <strong>{ethers?.isInitialized() ? 'true' : 'false'}</strong>
      </p>
      <p>
        Connection status: <strong>{connectionStatus}</strong>
      </p>
    </EthersProvider>
  );
};
