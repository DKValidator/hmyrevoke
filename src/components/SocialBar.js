import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { brands, solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const SocialBar = () => {
    const socialBarStyle = {

    };

    const socialIconStyle = {
        display: "inline-block",
        margin: "10px",
        marginTop: "5px",
        marginBottom: "5px",
        cursor: "pointer"
    };
    return (
        <div style={socialBarStyle}>
            <div style={socialIconStyle}><a className='social-link' href="mailto:info@dkvalidator.one"><FontAwesomeIcon size={"2x"} icon={solid('envelope')} /></a></div>
            <div style={socialIconStyle}><a className='social-link' href="https://twitter.com/dkvalidator" target='_blank' rel="noreferrer"><FontAwesomeIcon size={"2x"} icon={brands('twitter')} /></a></div>
            <div style={socialIconStyle}><a className='social-link' href="https://discord.gg/wZRC2TZXd2" target='_blank' rel="noreferrer"><FontAwesomeIcon size={"2x"} icon={brands('discord')} /></a></div>
            <div style={socialIconStyle}><a className='social-link' href="https://t.me/DKValidatorChat" target='_blank' rel="noreferrer"><FontAwesomeIcon size={"2x"} icon={brands('telegram')} /></a></div>
            <div style={socialIconStyle}><a className='social-link' href="https://blog.dkvalidator.one/" target='_blank' rel="noreferrer"><FontAwesomeIcon size={"2x"} icon={brands('medium')} /></a></div>
            {/*<div style={socialIconStyle}><a href=""><FontAwesomeIcon size={"2x"} icon={brands('youtube')} /></a></div>*/}
        </div >
    )
}

export default SocialBar