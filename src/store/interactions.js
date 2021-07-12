import Web3 from 'web3';
import NFT from "../backEnd/abis/NFT.json";

import {
    web3Loaded,
    web3NetworkLoaded,
    web3AccountLoaded,
    web3BalanceLoaded,
    contractLoaded,
    tokenSupplyLoaded,
    startedMintingToken,
    endedMintingToken
} from './actions';


export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(window.ethereum || 'http://localhost:8545');
    dispatch(web3Loaded(web3));
    return web3;
}

export const loadNetwork = async (dispatch, web3) => {
    try{
        let network = await web3.eth.net.getNetworkType()
        network = network.charAt(0).toUpperCase()+network.slice(1)
        dispatch(web3NetworkLoaded(network))
        return network
    } catch (e) {
        dispatch(web3NetworkLoaded('Wrong network'))
        console.log('Error, load network: ', e)
    }
}

export const loadAccount = async (web3, dispatch) => {
    try{
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts()
        const account = await accounts[0]
        if(typeof account !== 'undefined'){
            dispatch(web3AccountLoaded(account))
            return account
        } else {
            dispatch(web3AccountLoaded(null))
            return null
        }
    } catch (e) {
        console.log('Error, load account: ', e)
    }
}

export const loadBalance = async (web3, account, dispatch) => {
    try {
        const etherBalance = await web3.eth.getBalance(account)
        dispatch(web3BalanceLoaded((etherBalance/10**18).toFixed(5)))
    } catch (e) {
        console.log('Error, load balance: ', e)
    }
}

export const loadContract = async (web3, netId, dispatch) => {
    try {
        const contract = new web3.eth.Contract(NFT.abi, NFT.networks[netId].address)
        dispatch(contractLoaded(contract))
        return contract
    } catch (e) {
        window.alert('Wrong network!')
        console.log('Error, load contract: ', e)
        dispatch(contractLoaded(null))
        return null
    }
}

export const loadAllMintedTokens = async (nft, dispatch) => {
    const totalSupply = await nft.methods.totalSupply().call();

    dispatch(tokenSupplyLoaded(totalSupply))

}

export const getTokenInfo = async  (nft, tokenId) => {

    const uri = await nft.methods.tokenURI(tokenId).call();

    const ownerInfo = await nft.methods.ownerOf(tokenId).call();
    const state = await nft.methods.sold(tokenId).call();
    let price = await nft.methods.price(tokenId).call();
    return {
        uri,
        ownerInfo,
        state,
        price
    };

}

export const mintToken = async (nft, tokenUri, account,web3, dispatch) => {
    nft.methods.mint(tokenUri, web3.utils.toWei('0.01', 'ether')).send({from: account})
        .on('transactionHash', (hash) => {
           dispatch(startedMintingToken());
        })
        .on('error', (error) => {
            console.log(error);
        })
}


export const subscribeToEvents = async (nft, dispatch) => {

    nft.events.Minted({}, (error, event)=> {
        loadAllMintedTokens(nft, dispatch);
        dispatch(endedMintingToken());
    })

}

export const buyNft = async (nft, tokenId, account, price, cb) => {
    await nft.methods.buy(tokenId).send({from: account, value: price})
        .on('receipt', async (r) => {
            // update(dispatch)
            window.alert(`Congratulations, you've received NFT with ID: ${tokenId}\n`)
            cb(null, r)
        })
        .on('error',(error) => {
            console.error(error)
            window.alert(`There was an error!`);
            cb(error, null);
        })
}