# React-EthersJS

WIP Docs...

Check our example folder for a detailed usage.

### Setting up Remix with Ganache for local testing

- Check this article: https://medium.com/@kacharlabhargav21/using-ganache-with-remix-and-metamask-446fe5748ccf

### useEthers

### useContract

### FAQ

#### How do I wait for a transaction to be mined (completed)?

- You should use the tx.wait() method to wait for it to be mined. Note that this only works for transactions that performs a write operation. For read only operation, you just use the regular async await syntax.

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

### How do I disconnect from metamask?

- There's no way to achieve it programatically. You have to inform your users to [disconnect manually](https://stackoverflow.com/questions/70378789/how-to-logout-from-metamask-account-in-reactjs-using-ethereum) or just simulate it for UX purposes.
