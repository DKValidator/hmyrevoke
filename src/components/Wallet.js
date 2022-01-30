import React from 'react';

const Wallet = ({ walletConnect, walletDisconnect, isHarmony, isTestnet, isConnected, address }) => {
  return <div className='wallet-banner'>
    <div>
      {!isConnected && <p>Connect your MetaMask wallet.</p>}
    </div>
    <div>
      {isConnected && isHarmony && <p>Connected: {address} {isTestnet && <b>TESTNET</b>}</p>}
    </div>
    <div>
      {isConnected && !isHarmony && <p>Wrong network detected switch to Harmony.</p>}
    </div>
  </div>;
};

export default Wallet;
