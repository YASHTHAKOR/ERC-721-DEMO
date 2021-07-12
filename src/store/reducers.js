import {combineReducers} from "redux";

function web3(state = {}, action) {
    switch (action.type) {
        case 'WEB3_LOADED':
            return {
                ...state,
                connection: action.connection
            }
        case 'WEB3_ACCOUNT_LOADED':
            return {
                ...state,
                account: action.account
            }
        case 'WEB3_NETWORK_LOADED':
            return {
                ...state,
                network: action.network
            }
        case 'ETHER_BALANCE_LOADED':
            return {...state, balance: action.balance}
        default:
            return state;
    }
}

function nft(state = [], action) {
    switch (action.type) {
        case 'NFT_LOADED':
            return {
                ...state,
                contract: action.contract,
                loaded: true
            }
        case 'TOTAL_NFT_MINTED':
            return {...state, totalSupply: action.totalSupply, totalSupplyLoaded: true}
        case 'STARTED_MINTING_TOKEN':
            return {...state, mintingToken: true}
        case 'ENDED_MINTING_TOKEN':
            return {...state, mintingToken: false}
        default:
            return state;
    }
}

const rootReduces = combineReducers({
    web3,
    nft
})

export default rootReduces;