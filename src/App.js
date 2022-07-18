import './App.css';
import Allowances from './components/Allowances';
import Heading from './components/Heading';
import detectEthereumProvider from "@metamask/detect-provider";
import { useState, useEffect } from 'react'
import Web3 from "web3";
import Wallet from './components/Wallet';
import Footer from './components/Footer';



function App() {

  const [isAuthorized, setIsAuthorised] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [isHarmony, setIsHarmony] = useState(false);
  const [isTestnet, setIsTestnet] = useState(false);
  const [currentChainId, setChainId] = useState(0);

  useEffect(() => {
    if (isAuthorized && !web3) {
      setWeb3(new Web3(window.ethereum));
    }
  }, [isAuthorized, web3])

  useEffect(() => {
    if (web3) {
      const getChain = async () => {
        setChainId(await web3.eth.getChainId());
      }

      getChain();
    }
  }, [web3, currentChainId]);

  useEffect(() => {
    console.log('ChainId ' + currentChainId)
    const hChain = (currentChainId === 1666600000 || currentChainId === 1666700000);

    if (hChain !== isHarmony)
      setIsHarmony(hChain);

    const testChain = (currentChainId === 1666700000);
    if (testChain !== isTestnet)
      setIsTestnet(testChain);
  }, [currentChainId, isHarmony, isTestnet])

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      console.error("Not found accounts");
    } else {
      setAddress(accounts[0]);
  
      console.log("Your address: ", accounts[0]);
    }
  };
  
  const signInMetamask = async () => {
    const provider = await detectEthereumProvider();
  
    // @ts-ignore
    if (provider !== window.ethereum) {
      console.error("Do you have multiple wallets installed?");
    }
  
    if (!provider) {
      console.error("Metamask not found");
      return;
    }
  
    // MetaMask events
    provider.on("accountsChanged", handleAccountsChanged);
  
    provider.on("disconnect", () => {
      console.log("disconnect");
      window.location.reload(false);
    });
  
    provider.on("chainIdChanged", (chainId) => {
      console.log("chainIdChanged", chainId);
      // TODO - handle chainId change.. reload page for now
      window.location.reload(false);
    }
    );
  
    provider
      .request({ method: "eth_requestAccounts" })
      .then(async (params) => {
        handleAccountsChanged(params, setAddress);
        console.log('Set authorised..')
        setIsAuthorised(true);
      })
      .catch((err) => {
        setIsAuthorised(false);
  
        if (err.code === 4001) {
          console.error("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
  };

  const connectWallet = () => {
    console.log('Connect wallet')
    signInMetamask(setIsAuthorised, setAddress);
  };

  const disconnectWallet = () => {
    console.log('Disconnect wallet')
    window.location.reload(false);
  }

  return (
    <div className="App">
      <Heading addr={address} walletBtnOnClick={() => connectWallet()} disconnect={() => disconnectWallet()} />
      <p style={{textAlign: "center"}}>Revoke smart contract token spend allowances.</p>
      <Wallet walletConnect={() => connectWallet()} walletDisconnect={() => disconnectWallet()} isHarmony={isHarmony} isTestnet={isTestnet} isConnected={isAuthorized} address={address} />
      {address && web3 &&
        <Allowances addr={address} web3={web3} />
      }
      <div style={{height: "60px"}}></div>
      <Footer />
    </div>
  );
}

export default App;
