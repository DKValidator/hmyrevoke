import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import Allowance from './Allowance';
import { useState, useEffect } from 'react';
import { HarmonyAddress } from '@harmony-js/crypto';
import { getShortAddress } from '../utils/shortaddress';
import Notification from './Notification';
import { getTokenNames } from '../utils/contract';

async function sendHmyRequest(request) {

    let url = 'https://rpc.s0.t.hmny.io'

    if (window.ethereum.networkVersion === 1666700000)
        url = 'https://api.s0.b.hmny.io'

    console.log('request url: ' + url)
    const resp = await fetch(url, request);
    //const resp = await window.ethereum.request(request);
    const responseJson = await resp.json();

    return responseJson;
}

async function getTransactionData(addr, setData, web3) {
    console.log('Getting transaction for ' + addr)

    const message = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "hmyv2_getTransactionsHistory",
        "params": [
            {
                "address": addr,
                "pageIndex": 0,
                "pageSize": 1000,
                "fullTx": true,
                "txType": "ALL",
                "order": "ASC"
            }
        ]

    };

    const request = {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
            'content-type': 'application/json'
        }
    };

    const response = await sendHmyRequest(request);

    console.log('Got response..');
    console.log(response);


    const approvalHash = "0x095ea7b3";
    const unlimitedAllowance = "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    let approveTransactions = [];
    console.dir(response.result)
    let dataObj = response.result.transactions;
    console.log('dataObj')
    console.dir(dataObj);

    if (!dataObj)
        return;

    for (let tx of dataObj) {

        if (tx.input.includes(approvalHash)) {
            console.log('Got approval')
            let approveObj = {};
            approveObj.txhash = tx.hash;
            const toAddr = new HarmonyAddress(tx.to);
            //console.log(toAddr.basicHex)
            approveObj.txHash = tx.hash;
            approveObj.contract = web3.utils.toChecksumAddress(toAddr.basicHex);
            approveObj.approved = web3.utils.toChecksumAddress("0x" + tx.input.substring(34, 74));

            let allowance = tx.input.substring(74);
            if (allowance.includes(unlimitedAllowance)) {
                approveObj.allowance = "Unlimited";
            } else {
                approveObj.allowance = "Limited";
            }

            if (parseInt(allowance, 16) !== 0) {
                // First remove any previous entries for the same contract and approved address
                approveTransactions = approveTransactions.filter((val) => {
                    return !(val.approved === approveObj.approved && approveObj.contract === val.contract);
                });
                

                approveObj.shortContract = getShortAddress(approveObj.contract);
                


                approveObj.shortApproved = getShortAddress(approveObj.approved);
                approveTransactions.push(approveObj);
            } else {
                // Allowance == 0 so no need to display this
                approveTransactions = approveTransactions.filter((val) => {
                    return !(val.approved === approveObj.approved && val.contract === approveObj.contract);
                });
            }

        }
    }
    console.log('Got data:')
    console.log(approveTransactions)
    setData(approveTransactions);

}

const Allowances = ({ addr, web3 }) => {
    const [address, setAddress] = useState(null);
    const [data, setData] = useState(null);
    const [revokeProcessing, setRevokeProcessing] = useState(false);
    const [revokeError, setRevokeError] = useState(null);
    const [revokeSuccess, setRevokeSuccess] = useState(null);
    const [notification, setNotification] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [gotTokens, setGotTokens] = useState(false)
    const approvalABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokens",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    useEffect(() => {
        if (addr && addr !== address) {
            setAddress(addr);
            setData(null);
        }

    }, [address, addr]);

    useEffect(() => {
        if (address && !data) {
            getTransactionData(address, setData, web3);
        }
    }, [address, data, web3])

    useEffect(() => {
        if (data && !gotTokens)
            getTokenNames(web3, data, setData, setGotTokens)
    }, [data, web3, gotTokens])

    const revokeOnClick = (tx) => {
        setRevokeError(null);
        setRevokeSuccess(null);
        setRevokeProcessing('Please wait.. Revoking ' + tx.contractSymbol + ' allowance for contract ' + tx.approved);
        let contract = new web3.eth.Contract(approvalABI, tx.contract);
        contract.methods.approve(tx.approved, 0).send({ from: addr }).then((receipt) => {
            console.log("revoked: " + JSON.stringify(receipt));
            setData(data.filter((val) => {
                return !(val.approved === tx.approved && tx.contract === val.contract);
            }))
            setRevokeSuccess(tx.contractSymbol + ' allowance revoked for contract ' + tx.approved);
            setNotification({
                text: tx.contractSymbol + ' allowance revoked for contract ' + tx.approved
            });
            setShowNotification(true);
            setRevokeProcessing(null);
        }).catch((err) => {
            console.log("failed: " + JSON.stringify(err));
            setRevokeError(JSON.stringify(err));
            setRevokeProcessing(null);
            setNotification({
                text: "failed: " + JSON.stringify(err)
            });
        });
    }

    return <>
        {notification && <Notification show={showNotification} data={notification} setShow={(show) => setShowNotification(show)} />}
        <div className='allowances'>
            {!data &&
                <p className='loading-text'><FontAwesomeIcon spin={true} icon={solid('spinner')} /> Loading data...</p>
            }
            {revokeError &&
                <p className='loading-text'>Error processing revoke. See console for details.</p>
            }
            {revokeSuccess &&
                <p className='loading-text'>{revokeSuccess}</p>
            }
            {revokeProcessing &&
                <p className='loading-text'><FontAwesomeIcon spin={true} icon={solid('spinner')} /> {revokeProcessing}</p>
            }
            {data &&
                <div className='grid-container'>
                    <div className='grid-item' style={{color: "#00AEE9"}}><b>Token</b></div>
                    <div className='grid-item' style={{color: "#00AEE9"}}><b>Approved Contract</b></div>
                    <div className='grid-item' style={{color: "#00AEE9"}}><b>Allowance</b></div>
                    <div className='grid-item'></div>
                    {data.map((allowance) =>
                        <Allowance key={allowance.contract + '|' + allowance.approved} allowance={allowance} revoke={(data) => revokeOnClick(data)} />
                    )}
                </div>
            }
        </div>
    </>
};

export default Allowances;
