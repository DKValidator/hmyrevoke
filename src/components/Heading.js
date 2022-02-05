import React from 'react';
import logo from "../assets/dkv cropped.png";
import { getShortAddress } from '../utils/shortaddress';


const Heading = ({ addr, walletBtnOnClick, disconnect }) => {
    let addressTxt = getShortAddress(addr);
    
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
