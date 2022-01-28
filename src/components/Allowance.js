import React from 'react';

const Allowance = ( {allowance, revoke} ) => {
  return <>
      <div className='grid-item'><a href={'https://explorer.harmony.one/address/' + allowance.contract} target='_blank'>{allowance.contract}</a></div>
      <div className='grid-item'><a href={'https://explorer.harmony.one/address/' + allowance.approved} target='_blank'>{allowance.approved}</a></div>
      <div className='grid-item'>{allowance.allowance}</div>
      <div className='grid-item'><button onClick={() => revoke(allowance)}>Revoke</button></div>
  </>;
};

export default Allowance;
