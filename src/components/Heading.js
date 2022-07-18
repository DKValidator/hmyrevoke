import React from 'react';
import logo from "../assets/DK Validator Transparent Logo.png";
import { getShortAddress } from '../utils/shortaddress';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Heading = ({ addr, walletBtnOnClick, disconnect }) => {
    let addressTxt = getShortAddress(addr);
    
    let addrLen = 0;

    if (addr)
        addrLen = addr.length;
    if (addr && addrLen > 10) {
        addressTxt = addr.substring(0, 6) + '...' + addr.substring(addrLen - 5, addrLen);
    }

    return (
        <div className="header">
            <div>
                <a href="https://dkvalidator.one" target='_blank' rel="noreferrer">
                    <img className="logo" src={logo} alt="DK Validator Logo" width="300px" />
                </a>
                <div>
                    {addr &&
                        <button className="walletbutton">
                            <FontAwesomeIcon icon={solid('wallet')} /> {addressTxt}
                        </button>
                    }
                    {!addr && <button className="walletbutton" onClick={walletBtnOnClick} style={{ color: "black", backgroundColor: "#FF6F00", fontWeight: "bold" }}>{'Connect MetaMask'}</button>}
                </div>
            </div>
        </div>
    )
}

export default Heading
