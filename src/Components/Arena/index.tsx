import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import cryptoBoondocks from '../../utils/CryptoBoondocks.json';
import LoadingIndicator from '../LoadingIndicator';
import './Arena.css';

const Arena = ({ characterNFT, setCharacterNFT }: any) => {
    const [gameContract, setGameContract] = useState<any | null>(null);
    const [boss, setBoss] = useState<any | null>(null);
    const [attackState, setAttackState] = useState('');
    const [lastAttack, setLastAttack] = useState('');
    const [showToast, setShowToast] = useState(false);

    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setAttackState('attacking');
                console.log('Attacking boss...');
                const attackTxn = await gameContract.attackBoss();
                await attackTxn.wait();
                console.log('attackTxn: ', attackTxn);
                setAttackState('hit')

                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 5000)
            }
        } catch (error) {
            console.error('Error attacking boss:', error);
            setAttackState('');
        }
    };

    const renderLastAttack = (player = characterNFT) => {
        const lastDmg = characterNFT.lastAttack
        if (lastDmg > player.attackDamage) {
            return (
                <h4>Last attack dealt <span title="Critical Damage - 5x modifier">{lastDmg}</span> damage</h4>
            )
        } else {
            return <h4>Last attack dealt {lastDmg} damage</h4>
        }
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

            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found!')
        }
    }, [])

    useEffect(() => {
        const fetchBoss = async () => {
            if (gameContract) {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss:', bossTxn);
            setBoss(transformCharacterData(bossTxn, false));
        }
    };

        const onAttackComplete = (newBossHp: any, newPlayerHp: any, critical: any, selfDmg: any, shield: any, finalDmg: any) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();
            const attackType =
                (critical) ? "critical" : "normal";
            const finalDmgValue = finalDmg.toNumber();

            // add in Critical Damage, Self Damage & Shield alerts here

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            if (attackType === 'critical') {
                console.log('Critical hit - total damage:', finalDmg)
                console.log(((selfDmg) ? `Move resulted in self-inflicted damage(${(characterNFT.attackDamage) / 2})` : "No self-inflicted damage."))
            }

            if (shield) {
                console.log('Shield activated - no player damage taken.')
            }

            setBoss((prevState: any | null) => {
                return { ...prevState, hp: bossHp };
            })

            setCharacterNFT((prevState: any | null) => {
                return { ...prevState, hp: playerHp, lastAttack: finalDmgValue };
            })

            setLastAttack(finalDmg)
        }

        if (gameContract) {
            fetchBoss();
            gameContract.on('AttackComplete', onAttackComplete);
        }

        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete);
            }
        }
    }, [gameContract]);

    return (
        <div className="arena-container">
            {showToast && (
                <div id="toast" className="show">
                    <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.lastAttack}!`}</div>
                </div>
            )}

            {boss && (
                <div className="boss-container">
                    <div className={`boss-content ${attackState}`}>
                        <h2>🔥 {boss.name} 🔥</h2>
                        <div className="image-content">
                            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                            <div className="health-bar">
                                <progress value={boss.hp} max={boss.maxHp} />
                                <p>{`${boss.hp} / ${boss.maxHp}`}</p>
                            </div>
                        </div>
                    </div>

                    <div className="attack-container">
                        <button className="cta-button" onClick={runAttackAction}>
                            {`💥 Attack ${boss.name}`}
                        </button>
                    </div>
                    {attackState === 'attacking' && (
                        <div className="loading-indicator">
                            <LoadingIndicator />
                            <p>Attacking ⚔</p>
                        </div>
                    )}
                </div>
            )}

            {characterNFT && (
                <div className="players-container">
                    <div className={`player-container`}>
                        <h2>Your Character</h2>
                        <div className="player">
                            <div className="image-content">
                                <h2>{characterNFT.name}</h2>
                                <img src={characterNFT.imageURI} alt={`Character ${characterNFT.name}`} />
                                <div className="health-bar">
                                    <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                                    <p>{`${characterNFT.hp} / ${characterNFT.maxHp}`}</p>
                                </div>
                            </div>
                            <div className="stats">
                                <h4>{`⚔ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                                {renderLastAttack()}
                            </div>
                        </div>
                    </div>
                    {/* <div className="active-players">
                    <h2>Active Players</h2>
                    <div className="players-list">{renderActivePlayersList()}</div>
                    </div> */}
                </div>
            )}
        </div>

    );
};

export default Arena;