const CONTRACT_ADDRESS = '0xd123d730128798E0465F6DBFC14288533bcb37Ea'

const ipfs = (cid) => {
    return `https://cloudflare-ipfs.com/ipfs/${cid}`
};

const transformCharacterData = (characterData, player = true) => {
    return {
        name: characterData.name,
        imageURI: ipfs(characterData.imageURI),
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
        niggatry: characterData.niggatry.toNumber(),
        lastAttack: (!player) ? 0 : characterData.lastAttack.toNumber()
    }
}

export { CONTRACT_ADDRESS, transformCharacterData };