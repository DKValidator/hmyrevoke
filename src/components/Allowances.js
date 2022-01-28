import React from 'react';
import Allowance from './Allowance';
import { useState, useEffect } from 'react';
/*
import moment from 'moment';
import web3 from 'web3'
*/
export async function sendHmyRequest(request) {
    const resp = await fetch('https://api.harmony.one', request);

    const responseJson = await resp.json();

    return responseJson;
}

export async function getTransactionData(addr, setData) {
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
            approveObj.contract = tx.to // web3.utils.toChecksumAddress(tx.to);
            approveObj.approved = "0x" + tx.input.substring(34, 74) //web3.utils.toChecksumAddress("0x" + tx.input.substring(34, 74));

            let allowance = tx.input.substring(74);
            if (allowance.includes(unlimitedAllowance)) {
                approveObj.allowance = "unlimited";
            } else {
                approveObj.allowance = "limited";
            }

            if (parseInt(allowance, 16) !== 0) {
                // First remove any previous entries for the same contract and approved address
                approveTransactions = approveTransactions.filter((val) => {
                    return !(val.approved === approveObj.approved && val.contract === val.contract);
                });

                approveTransactions.push(approveObj);
            } else {
                // Allowance == 0 so no need to display this
                approveTransactions = approveTransactions.filter((val) => {
                    return !(val.approved === approveObj.approved && val.contract === val.contract);
                });
            }

        }
    }

    setData(approveTransactions);

}

const revoke = (allowance) => {
    alert('revoke')
}

const Allowances = ({ addr }) => {
    const [address, setAddress] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (addr && addr !== address) {
            setAddress(addr);
            setData(null);
        }

    }, [address, addr]);

    useEffect(() => {
        if (address && !data) {
            getTransactionData(address, setData);
        }
    }, [address, data])

    return <>
        {data &&
            <div className='grid-container'>
                <div className='grid-item'><b>Contract</b></div>
                <div className='grid-item'><b>Approved</b></div>
                <div className='grid-item'><b>Allowance</b></div>
                <div className='grid-item'></div>
                {data.map((allowance) =>
                    <Allowance key={allowance.contract + '|' + allowance.approved} allowance={allowance} revoke={(data) => revoke(data)} />
                )}
            </div>
        };
    </>
};

export default Allowances;
