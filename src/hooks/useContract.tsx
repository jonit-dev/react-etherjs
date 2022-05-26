import { Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useEthers } from './useEthers';
export const useContract = (address: string, ABI: ethers.ContractInterface) => {
  const [contract, setContract] = useState<Contract>();

  const ethersProvider = useEthers();

  useEffect(() => {
    const readContract = async () => {
      try {
        if (ethersProvider) {
          const output = new ethers.Contract(
            address,
            ABI,
            ethersProvider.getSigner()!
          );
          setContract(output);
        }
      } catch (error) {
        console.error(error);
      }
    };
    readContract();
  }, [ethersProvider]);

  return contract;
};
