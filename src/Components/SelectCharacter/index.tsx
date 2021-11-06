import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import cryptoBoondocks from '../../utils/CryptoBoondocks.json'
import LoadingIndicator from '../LoadingIndicator';


const ipfs = (cid: string) => {
    return `https://cloudflare-ipfs.com/ipfs/${cid}`
};

const loadingGif = ipfs('QmWpA8TPSBFmX5MxTvDwdN72n6qzR2xXQQeGSFiov5c27d');

const SelectCharacter = ({ setCharacterNFT }: null | any) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState<any | null>(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);

    const mintCharacterNFTAction = (characterId: number) => async () => {
        try {
            if (gameContract) {
                setMintingCharacter(true);
                console.log("Minting character in progress...");
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log("Character minted!\n mintTxn:", mintTxn)
                let returnedTokenUri = await gameContract.tokenURI(1);
                console.log("Token URI:", returnedTokenUri);
                setMintingCharacter(false);
            }
        } catch (error) {
            console.warn('MintCharacterAction Error:', error);
            setMintingCharacter(false);
        }
    };



    const renderCharacters = () => {
        console.log("Rendering character grid... %d choices", characters.length)

        return characters.map((character: any, index) => (
            <div className="character-item" key={character.name}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={mintCharacterNFTAction(index)}
                >{`Mint ${character.name}`}</button>
            </div>
        ))
    }

    useEffect(() => {
        const { ethereum } = window as any;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                cryptoBoondocks.abi,
                signer
            );

            setGameContract(gameContract)
        } else {
            console.log('Ethereum object not found!')
        }
    }, []);

    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log('Getting contract characters to mint');

                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('charactersTxn:', charactersTxn);

                const characters = charactersTxn.map((characterData: any) => transformCharacterData(characterData));

                setCharacters(characters);
            } catch (error) {
                console.error('Something went wrong with fetching characters:', error)
            }
        };

        const onCharacterMint = async (sender: any, tokenId: any, characterIndex: any) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            if (gameContract) {
                const characterNFT = characters[characterIndex];
                console.log('CharacterNFT: ', characterNFT);
                setCharacterNFT(characterNFT);
            }
        };

        if (gameContract) {
            getCharacters();

            gameContract.on('CharacterNFTMinted', onCharacterMint);
        }

        return () => {
            if (gameContract) {
                gameContract.off('CharacterNFTMinted', onCharacterMint);
            }
        };
    }, [gameContract]);

    return (
        <div className="select-character-container">
            <h2>Mint Your Hero. Choose wisely.</h2>
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
            {mintingCharacter && (
                <div className="loading">
                    <div className="indicator">
                        <LoadingIndicator />
                        <p>Minting In Progress...</p>
                    </div>
                    <img
                        src={loadingGif}
                        alt="Minting loading indicator"
                    />
                </div>
            )}
        </div>
    );
};

export default SelectCharacter;