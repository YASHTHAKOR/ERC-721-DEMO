import React, {Fragment, useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Card, Button} from "react-bootstrap";
import {accountSelector, nftSelector, web3Selector} from "../../store/selectors";
import {
    getTokenInfo,
    buyNft
} from '../../store/interactions';
import {get} from 'axios';
import './style.css';
import Spinner from "../../commons/Spinner";


function TokenInfo({tokenId}) {

    const account = useSelector(accountSelector);
    const nft = useSelector(nftSelector);

    const [isTokenLoaded, SetIsTokenLoaded] = useState(false);
    const [tokenData, SetTokenData] = useState({});
    const [isBuying, SetIsBuying] = useState(false);

    useEffect(() => {
        fetchAndProcessTokenData();
    }, []);

    const fetchAndProcessTokenData = async () => {
        try {
            let {
                uri : tokenUrl,
                ownerInfo,
                state,
                price
            } = await getTokenInfo(nft, tokenId);
            let response = await get(tokenUrl);
            SetTokenData({
                ...response.data,
                ownerInfo,
                state,
                price
            });
            SetIsTokenLoaded(true);
        } catch (Err) {
            console.log(Err);
        }

    }

    const buyNFTNow = async () => {
        SetIsBuying(true);
        await buyNft(nft, tokenId, account, tokenData.price, buyingNftCallback)

    }

    const buyingNftCallback = (err, data) => {
        SetIsBuying(false);
        fetchAndProcessTokenData();
    }

    return <Fragment>
        {isTokenLoaded ? <Card style={{width: '18rem'}}>
            <Card.Img variant="top" src={tokenData.image}/>
            <Card.Body>
                <Card.Title>{tokenData.name}</Card.Title>
                <Card.Text>
                    {tokenData.description}
                </Card.Text>
                {!tokenData.state? <Button disabled={isBuying} onClick={buyNFTNow}>{isBuying? <Spinner/> : <span>Buy at {(tokenData.price/10**18).toFixed(5)} </span>}</Button>: `SOLD to ${tokenData.ownerInfo}`}
                {/*<Button variant="primary">Go somewhere</Button>*/}
            </Card.Body>
        </Card> : 'not loaded yet'}
    </Fragment>

}

export default TokenInfo;