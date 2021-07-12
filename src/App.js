import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import IpfsUpload from './components/IpfsUpload';

import {
    loadWeb3,
    loadNetwork,
    loadAccount,
    loadContract,
} from './store/interactions';

import {
    nftLoadedSelector
} from  './store/selectors'


function App() {

    const dispatch = useDispatch();

    const nftLoaded = useSelector(nftLoadedSelector);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        const web3 = loadWeb3(dispatch);
        const networkId = await web3.eth.net.getId()
        const account = await loadAccount(web3, dispatch);
        const nft = loadContract(web3, networkId, dispatch);
        if(!nft) {
            window.alert('Contract not deployed to the current network. Please select another network with metamask');
            return;
        }
    }

  return (
    <div className="App">
        {nftLoaded && <IpfsUpload/>}
    </div>
  );
}

export default App;
