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

let knownTokens = [

    {
        address: '0x5B0C920D78838d7f29e3972c885C4065aB9ECCb2',
        tokenSymbol: 'VENOM-LP'
    },
    {
        address: '0x72Cb10C6bfA5624dD07Ef608027E366bd690048F',
        tokenSymbol: 'JEWEL'
    },
    {
        address: '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f',
        tokenSymbol: '1USDT'
    },
    {
        address: '0x985458E523dB3d53125813eD68c274899e9DfAb4',
        tokenSymbol: '1USDC'
    },
    {
        address: '0x224e64ec1BDce3870a6a6c777eDd450454068FEC',
        tokenSymbol: 'UST'
    },
    {
        address: '0x772b8B924d197108c5cc9483DC7bFd7A15a0a513',
        tokenSymbol: 'JEWEL-LP'
    }

]

export async function getTokenNames(web3, approvals, setApprovals, gotTokens) {
    let found = false;
    //let approvalsCopy = approvals;
    for (let x = 0; x < approvals.length; x++) {
        found = false;
        for (let i = 0; i < knownTokens.length; i++) {
            if (String(knownTokens[i].address).toUpperCase() === String(approvals[x].contract).toUpperCase()) {
                approvals[x].contractSymbol = knownTokens[i].tokenSymbol;
                found = true;
                console.log('Found: ' + approvals[x].contractSymbol)
                if (found)
                    i = knownTokens.length
            }
        };

        if (!found) {
            try {
                console.log('Getting data for: ' + approvals[x].contract)
                let contract = new web3.eth.Contract(abi, approvals[x].contract);
                let symbol = await contract.methods.symbol().call();
                approvals[x].contractSymbol = symbol
                knownTokens.push({
                    address: approvals[x].contract,
                    tokenSymbol: symbol
                })

            } catch (error) {
                console.log(error)
            }
        }
        setApprovals(approvals)
    }
    setApprovals(approvals)
    gotTokens(true)
}