import React, { useEffect, useState } from 'react';
import { useEthers } from '../hooks/useEthers';
import { ConnectionStatus } from '../types/ProviderTypes';
interface IProps {
  children: React.ReactNode;
  onChangeConnectionStatus?: (status: ConnectionStatus) => void;
  onNetworkChanged?: (networkId: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  options?: {
    showDebug?: boolean;
  };
}

export const EthersProvider: React.FC<IProps> = ({
  children,
  onChangeConnectionStatus,
  onNetworkChanged,
  onConnect,
  onDisconnect,
  options = {
    showDebug: true,
  },
}) => {
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.Disconnected
  );
  const ethersProvider = useEthers();

  useEffect(() => {
    if (onChangeConnectionStatus) {
      onChangeConnectionStatus(connectionStatus);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (ethersProvider) {
      try {
        window.ethereum.on('chainChanged', (networkId: string) => {
          if (onNetworkChanged) {
            onNetworkChanged(networkId);
          }
        });

        window.ethereum.on('accountsChanged', async (accounts: string[]) => {
          options.showDebug && console.log('accountsChanged', accounts);

          await checkConnection(true);
        });
      } catch (error) {
        console.error(error);
      }

      checkConnection(false);
    }
  }, [ethersProvider]);

  const checkConnection = async (propagateEvents: boolean) => {
    if (ethersProvider) {
      const connectionStatus = await ethersProvider.isConnected();

      if (connectionStatus) {
        setConnectionStatus(ConnectionStatus.Connected);
        if (onConnect && propagateEvents) {
          onConnect();
        }
      } else {
        setConnectionStatus(ConnectionStatus.Disconnected);
        if (onDisconnect && propagateEvents) {
          onDisconnect();
        }
      }
    }
  };

  return <>{children}</>;
};
