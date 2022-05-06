import React from 'react'
import Overlay from "react-overlay-component";

const Notification = ({show, data, setShow}) => {
    const closeOverlay = () => setShow(false);
    const configs = {
        animate: true,
        clickDismiss: true,
        escapeDismiss: true,
        focusOutline: true,
    };

    return (
        <Overlay configs={configs} isOpen={show} closeOverlay={closeOverlay}>
            <p>{data.text}</p>
            {data.showSpinner && <div>to-do: spinner</div>}
        </Overlay>
    )
}

export default Notification