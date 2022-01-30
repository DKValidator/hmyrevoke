import React from 'react';
import Allowance from './Allowance';
import { useState, useEffect } from 'react';
import { HarmonyAddress } from '@harmony-js/crypto'

async function sendHmyRequest(request) {

    let url = 'https://api.harmony.one'

    if (window.ethereum.networkVersion == 1666700000)
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
    console.dir(dataObj);

    if (!dataObj)
        return;

    for (let tx of dataObj) {

        if (tx.input.includes(approvalHash)) {
            let approveObj = {};
            approveObj.txhash = tx.hash;
            const toAddr = new HarmonyAddress(tx.to);
            //console.log(toAddr.basicHex)
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
                const abi = [
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "name",
                        "outputs": [
                            {
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "symbol",
                        "outputs": [
                            {
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    }
                ];
                const getShortAddress = (addr) => {
                    let addressTxt = '';
                    let addrLen = 0;
                    if (addr)
                        addrLen = addr.length;
                    if (addr && addrLen > 10) {
                        addressTxt = addr.substring(0, 6) + '...' + addr.substring(addrLen - 4, addrLen);
                    }

                    return addressTxt;
                }
                approveObj.shortContract = getShortAddress(approveObj.contract);
                try {

                    let contract = new web3.eth.Contract(abi, approveObj.contract);
                    let symbol = await contract.methods.symbol().call();
                    //console.log('got symnol?')
                    //console.log(symbol)
                    approveObj.contractSymbol = symbol

                } catch (error) {
                    console.log(error)
                }

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

    setData(approveTransactions);

}

const Allowances = ({ addr, web3 }) => {
    const [address, setAddress] = useState(null);
    const [data, setData] = useState(null);
    const [revokeProcessing, setRevokeProcessing] = useState(false);
    const [revokeError, setRevokeError] = useState(null);
    const [revokeSuccess, setRevokeSuccess] = useState(null);
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
            setRevokeSuccess(tx.contractSymbol + ' allowance revoked for contract ' + tx.approved)
            setRevokeProcessing(null);
        }).catch((err) => {
            console.log("failed: " + JSON.stringify(err));
            setRevokeError(JSON.stringify(err));
            setRevokeProcessing(null);
        });
    }

    return <>
        {!data &&
            <p className='loading-text'>Loading data...</p>
        }
        {revokeError &&
            <p className='loading-text'>Error processing revoke. See console for details.</p>
        }
        {revokeSuccess &&
            <p className='loading-text'>{revokeSuccess}</p>
        }
        {revokeProcessing &&
            <p className='loading-text'>{revokeProcessing}</p>
        }
        {data &&
            <div className='grid-container'>
                <div className='grid-item'><b>Token</b></div>
                <div className='grid-item'><b>Approved</b></div>
                <div className='grid-item'><b>Allowance</b></div>
                <div className='grid-item'></div>
                {data.map((allowance) =>
                    <Allowance key={allowance.contract + '|' + allowance.approved} allowance={allowance} revoke={(data) => revokeOnClick(data)} />
                )}
            </div>
        }
    </>
};

export default Allowances;
