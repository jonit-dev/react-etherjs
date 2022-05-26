import { useEffect, useState } from 'react';
import { Ethers, ethersProvider } from '../libs/Ethers';

export const useEthers = () => {
  const [provider, setProvider] = useState<Ethers>();

  useEffect(() => {
    try {
      const ethers = ethersProvider.init();

      if (ethers) {
        setProvider(ethers);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return provider;
};
