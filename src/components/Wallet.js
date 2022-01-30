import React from 'react';

const Wallet = ({ walletConnect, walletDisconnect, isHarmony, isTestnet, isConnected, address }) => {
  return <div className='wallet-banner'>
    {!isConnected &&
      <div className='connect-wallet'>
        <p><a onClick={() => walletConnect()}>Connect your MetaMask wallet.</a></p>
      </div>
    }
    {isConnected && isHarmony &&
      <div className='wallet-connected'>
        <p>Connected: {address} {isTestnet && <b>TESTNET</b>}</p>
      </div>
    }
    {isConnected && !isHarmony &&
      <div className='wrong-network'>
        <p>Wrong network detected switch to Harmony.</p>
      </div>
    }
  </div>;
};

export default Wallet;
