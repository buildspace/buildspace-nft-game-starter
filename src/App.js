import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import openseaLogo from './assets/Opensea-Logo.svg';
import nftLogo from './assets/chaos.png';
import './App.css';

// Constants
const TWITTER_HANDLE = 'web3blackguy';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_HANDLE = 'web3blackguy';
const OPENSEA_LINK = `https://opensea.io/${OPENSEA_HANDLE}`;
const NFT_MINT_LINK = 'https://nft-starter-repo-final.richardbankole.repl.co'
// const CONTRACT_ADDRESS = '0xcDcB91296a20cCda566624A3901cdC2F99D584e7'
// const CONTRACT_ABI = abi.abi

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);

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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ CryptoBoondocks ⚔️</p>
          <p className="sub-text">Team up to protect the hood!</p>
          <div className="connect-wallet-container">
            <img
              src="https://i.giphy.com/media/qNtqBSTTwXyuI/giphy.webp"
              alt="CryptoBoondocks - Huey backhand chop gif"
            />
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
            </button>
            <img
              src="https://i.giphy.com/media/v4HcIvPtxhbQk/giphy.webp"
              alt="CryptoBoondocks - Riley & Huey at gunpoint gif" />
          </div>
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
