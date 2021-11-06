import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import openseaLogo from './assets/Opensea-Logo.svg';
import nftLogo from './assets/chaos.png';
import cbTitleLogo from './assets/huey-gun-logo.png';
import './App.css';
import { ethers } from 'ethers';
import Axios from 'axios';

import cryptoBoondocks from './utils/CryptoBoondocks.json'
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';

// Constants
const TWITTER_HANDLE = 'web3blackguy';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_HANDLE = 'web3blackguy';
const OPENSEA_LINK = `https://opensea.io/${OPENSEA_HANDLE}`;
const NFT_MINT_LINK = 'https://nft-starter-repo-final.richardbankole.repl.co'
const ipfs = (cid) => {
  return `https://cloudflare-ipfs.com/ipfs/${cid}`
};

const App = () => {

  // eslint-disable-next-line no-unused-vars
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error)
    }
  };

  // Render Methods
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    // Scenario 1
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src={ipfs('QmPVP2sA9iTfo2KWgH2wvFGVBMUuWQvK55VxDrxSJvrmyc')}
            alt="CryptoBoondocks - Huey backhand chop gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      // Scenario 2
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts', });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const cbLogo = () => {
    return (
      <img src={cbTitleLogo} alt="CryptoBoondocks logo" className="cbLogo" />
    )
  }

  useEffect(() => {
    setIsLoading(true)
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {

    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        cryptoBoondocks.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(characterNFT));
      } else {
        console.log('No character NFT found')
      }

      setIsLoading(false);
    }

    if (currentAccount) {
      console.log('Current Account:', currentAccount);
      fetchNFTMetadata();
      generateCompany();
    }
  }, [currentAccount]);

  let to = []
  const getCompanyName = async () => {
    let name_data = await Axios.get("https://random-data-api.com/api/company/random_company");
    let cName = name_data.data.business_name
    return cName;}

  const generateCompany = async () => {for (let i=0; i < 20; i++) {
    function randInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    let cName = await getCompanyName()
    let startVal = randInt(1990, 2003);
    let endVal = startVal + randInt(1, 18)

    if (endVal > 2021) {
      endVal = 2021
    } 
    
    let company = {name: cName, start: startVal.toString(), end: endVal.toString()}

    to = [...to, company]
}

let failures = to.filter(company => (company.end - company.start <= 3))
    console.table(to)
    console.log("%c Failures:", "color: orange; font-weight:bold;", failures)

}



  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text" id='title'>{cbLogo()} CryptoBoondocks {cbLogo()}</p>
          <p className="sub-text">Team up to protect the hood!</p>
          {renderContent()}
          <img
            src={ipfs('QmVHMNDzXBkHG3pop2hZcS8PoNWKBonC5zX2dAXAsmsAy2')}
            alt="CryptoBoondocks - Riley & Huey at gunpoint gif" />
        </div>
        <div className="footer-container">
          <div className="footer-container-twit">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <br />
            <a
              className="footer-text-twit"
              href={TWITTER_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a></div>

          <div className="footer-container-nft" id="opensea">
            <img alt="Opensea Logo" className="footer-logo" src={openseaLogo} />
            <br />
            <a
              className="footer-text"
              href={OPENSEA_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >{"Check out my NFTs!"}</a>

          </div>

          <div className="footer-container-nft" id="CME">
            <img alt="CME Logo" className="footer-logo" src={nftLogo} id="CMElogo" />
            <br />
            <a
              className="footer-text"
              href={NFT_MINT_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >{"..or mint one instead 😉"}</a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
