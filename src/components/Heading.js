import React from 'react';
import logo from "../assets/dkv cropped.png";


const Heading = ({ addr, walletBtnOnClick, disconnect }) => {
    let addressTxt = '';
    let addrLen = 0;
    if (addr)
        addrLen = addr.length;
    if (addr && addrLen > 10) {
        addressTxt = addr.substring(0, 6) + '...' + addr.substring(addrLen - 4, addrLen);
    }
    return (
        <>
            <div className="top-header">
                <a href="https://dkvalidator.one" title="Stake Harmony ONE with DK Validator"><img className="logo" src={logo} alt="DK Validator - Harmony ONE Staking" width="300px" /></a>
                <div className='header-left'>
                    <button className="walletbutton" onClick={!addr ? () => walletBtnOnClick() : () => disconnect() }>{addr ? addressTxt : 'Connect Wallet'}</button>
                </div>
            </div>
        </>
    )
}

export default Heading
