import React, { useEffect, useState } from 'react';
import { useEthers } from '../hooks/useEthers';
import { ConnectionStatus } from '../types/ProviderTypes';

interface IProps {
  children: React.ReactNode;
  onChangeConnectionStatus: (status: ConnectionStatus) => void;
  onError?: (message: string) => void;
}

export const EthersProvider: React.FC<IProps> = ({
  children,
  onChangeConnectionStatus,
  onError,
}) => {
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.Disconnected
  );
  const ethersProvider = useEthers();

  useEffect(() => {
    onChangeConnectionStatus(connectionStatus);
  }, [connectionStatus]);

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      checkConnection();
    });
    window.ethereum.on('connect', () => {
      setConnectionStatus(ConnectionStatus.Connected);
    });
    window.ethereum.on('disconnect', () => {
      setConnectionStatus(ConnectionStatus.Disconnected);
    });
  }, []);

  useEffect(() => {
    if (ethersProvider) {
      checkConnection();
    }
  }, [ethersProvider]);

  const checkConnection = async () => {
    if (ethersProvider) {
      const connectionStatus = await ethersProvider.isConnected();

      setConnectionStatus(
        connectionStatus === true
          ? ConnectionStatus.Connected
          : ConnectionStatus.Disconnected
      );
    }
  };

  return <>{children}</>;
};
