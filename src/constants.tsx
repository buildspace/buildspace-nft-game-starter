const CONTRACT_ADDRESS = '0xd123d730128798E0465F6DBFC14288533bcb37Ea'

const ipfs = (cid: string | number) => {
    return `https://cloudflare-ipfs.com/ipfs/${cid}`
};

type Character = {
    name: string,
    imageURI: string,
    hp: number,
    maxHp: number,
    attackDamage: number,
    niggatry: number,
    lastAttack: number
}

const transformCharacterData = (characterData: any, player = true) => {
    let character: Character = {
        name: characterData.name,
        imageURI: ipfs(characterData.imageURI),
        hp: characterData.hp.toNumber(),
        maxHp: characterData.maxHp.toNumber(),
        attackDamage: characterData.attackDamage.toNumber(),
        niggatry: characterData.niggatry.toNumber(),
        lastAttack: (!player) ? 0 : characterData.lastAttack.toNumber()
    }
    return character
}

export { CONTRACT_ADDRESS, transformCharacterData };