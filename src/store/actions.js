export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3NetworkLoaded(network) {
    return {
        type: 'WEB3_NETWORK_LOADED',
        network
    }
}

export function web3AccountLoaded(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

export function web3BalanceLoaded(balance) {
    return {
        type: 'WEB3_BALANCE_LOADED',
        balance
    }
}

export function contractLoaded(contract) {
    return {
        type: 'NFT_LOADED',
        contract
    }
}

export function tokenSupplyLoaded(totalSupply) {
    return {
        type: 'TOTAL_NFT_MINTED',
        totalSupply
    }
}

export function startedMintingToken() {
    return {
        type: 'STARTED_MINTING_TOKEN'
    }
}

export function endedMintingToken() {
    return {
        type: 'ENDED_MINTING_TOKEN'
    }
}