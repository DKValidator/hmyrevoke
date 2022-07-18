import React from 'react';

const Allowance = ( {allowance, revoke} ) => {
    const smallScreen = window.screen.availWidth < 700;
  return <>
      <div className='grid-item'><a href={'https://explorer.harmony.one/address/' + allowance.contract} target='_blank' rel='noreferrer'>{allowance.contractSymbol ? allowance.contractSymbol : allowance.shortContract}</a></div>
      <div className='grid-item'><a href={'https://explorer.harmony.one/address/' + allowance.approved} target='_blank' rel='noreferrer'>{smallScreen ? allowance.shortApproved : allowance.approved}</a></div>
      <div className='grid-item'><a href={'https://explorer.harmony.one/tx/' + allowance.txHash} target='_blank' rel='noreferrer'>{allowance.allowance}</a></div>
      <div className='grid-item'><button className='btn' onClick={() => revoke(allowance)}>Revoke</button></div>
  </>;
};

export default Allowance;
