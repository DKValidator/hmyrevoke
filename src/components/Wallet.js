import React from 'react';
import { getShortAddress } from '../utils/shortaddress';

const Wallet = ({ walletConnect, walletDisconnect, isHarmony, isTestnet, isConnected, address }) => {

  const smallScreen = window.screen.availWidth < 700;
  let addrText = address;
  if (smallScreen)
    addrText = getShortAddress(address);

  return <div className='wallet-banner'>
    {/*
    {!isConnected &&
      <div className='connect-wallet'>
        <p><a onClick={() => walletConnect()}>Connect your MetaMask wallet.</a></p>
      </div>
    }
    {(isConnected && isHarmony) &&
      <div className='wallet-connected'>
        <p>Connected {isTestnet && <b>(TESTNET)</b>}: {addrText}</p>
      </div>
    }
  */}
    {(isConnected && !isHarmony) &&
      <div className='wrong-network'>
        <p>Wrong network detected switch to Harmony.</p>
      </div>
    }
  </div>;
};

export default Wallet;
