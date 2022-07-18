import React from 'react';

const Wallet = ({ isHarmony, isConnected }) => {
  return <div className='wallet-banner'>
    {(isConnected && !isHarmony) &&
      <div className='wrong-network'>
        <p>Wrong network detected switch to Harmony.</p>
      </div>
    }
  </div>;
};

export default Wallet;
