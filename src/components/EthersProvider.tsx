import React, { useEffect, useState } from 'react';
import { useEthers } from '../hooks/useEthers';
import { Ethers } from '../libs/Ethers';
import { ConnectionStatus } from '../types/ProviderTypes';
interface IProps {
  children: React.ReactNode;
  onChangeConnectionStatus?: (status: ConnectionStatus) => void;
  onNetworkChanged?: (networkId: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onChangeAccount?: (newAddress: string) => void;
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
  onChangeAccount,
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
    if (onChangeAccount) {
      onChangeAccount(Ethers.accounts[0]);
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
          if (options.showDebug) {
            console.log('accountsChanged', accounts);
          }
          Ethers.accounts = accounts;

          if (onChangeAccount) {
            onChangeAccount(accounts[0]);
          }

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
