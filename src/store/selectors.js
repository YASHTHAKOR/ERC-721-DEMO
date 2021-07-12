import { createSelector } from 'reselect'
import { get } from 'lodash'

const web3 = state => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, w => w)

const network = state => get(state, 'web3.network')
export const networkSelector = createSelector(network, n => n)

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

const balance = state => get(state, 'web3.balance', 0)
export const balanceSelector = createSelector(balance, e => e)

const nftLoaded = state => get(state, 'nft.loaded', false);
export const nftLoadedSelector = createSelector(nftLoaded, nl => nl);

const nft = state => get(state, 'nft.contract');
export const nftSelector = createSelector(nft, n => n);

const totalSupplyLoaded = state => get(state, 'nft.totalSupplyLoaded', false);
export const totalSupplyLoadedSelector = createSelector(totalSupplyLoaded, tsl => tsl);

const totalSupply = state => get(state, 'nft.totalSupply');
export const totalSupplySelector = createSelector(totalSupply, ts => ts);

const isMintingToken = state => get(state, 'nft.mintingToken', false);
export const isMintingTokenSelector = createSelector(isMintingToken, imt => imt);