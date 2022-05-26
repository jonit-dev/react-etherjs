import React, { useState } from 'react';

import { EthersProvider } from '../../src/components/EthersProvider';
import { useEthers } from '../../src/hooks/useEthers';
import { ConnectionStatus } from '../../src/types/ProviderTypes';

export const App: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.Disconnected
  );

  const ethers = useEthers();

  const onProviderConnect = async () => {
    await ethers?.connect();
  };

  return (
    <EthersProvider
      onChangeConnectionStatus={status => {
        setConnectionStatus(status);
      }}
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
        Connection status: <strong>{JSON.stringify(connectionStatus)}</strong>
      </p>
    </EthersProvider>
  );
};
