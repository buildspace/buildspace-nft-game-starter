import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [walletConnect, setWalletConnect] = useState(false);

  // Checkin if wallet is connected or not
  const checkIfWalletIsConnected = async() => {
    try{
      // First make sure we have access to window.ethereum
      // MetaMask automatically injects an special object named ethereum
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if user is connected to rinkeby test network
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4"; 
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      // Checking if we're authorized to acess the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts'});
      if (accounts.length !== 0){
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setWalletConnect(true);
      }else{
        console.log("No authorized account found!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Connects my wallet to this site
  const connectWallet = async() => {
    try{
      // Looking for ethereum object
      const {ethereum} = window;
      if (!ethereum) {
        alert("Get MetaMask");
        return;
      }
      // If we find MetaMask, ask MetaMask to give access to user's wallet
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected : ",accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch(error){
      console.log(error);
    }
  }

  // Render Methods
  const renderContent = () => {
    // If wallet is connected
    if (!currentAccount) {
      const buttonText = walletConnect ? "Play" : "Connect Wallet To Play";
      return (
        <div className="connect-wallet-container">
          <img
            src="https://i.imgur.com/d4VT4dn.gif"
            alt="Hora Hora Gif"
          />
          {/* Button that trigger wallet connect */}
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
          >
            {buttonText}
          </button>
        </div>
      );
    } 
    // If wallet is connected but player has no character NFT
    else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Sorcerers ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse from Cursed Spirits!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
