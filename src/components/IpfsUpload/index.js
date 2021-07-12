import React, {Fragment, useEffect, useState} from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import ipfs from '../../commons/ipfs';
import Spinner from "../../commons/Spinner";

import {
    accountSelector,
    nftLoadedSelector,
    nftSelector, totalSupplyLoadedSelector, totalSupplySelector,
    web3Selector,
    isMintingTokenSelector
} from '../../store/selectors';

import {
    mintToken,
    subscribeToEvents,
    loadAllMintedTokens
} from '../../store/interactions';

import TokenDetails from "../TokenDetails";


function IpfsUpload() {

    const dispatch = useDispatch();

    const [isUploading, SetIsUploading] = useState(false);

    const account = useSelector(accountSelector);
    const nftLoaded = useSelector(nftLoadedSelector);
    const nft = useSelector(nftSelector);
    const web3 = useSelector(web3Selector)
    const totalSupplyLoaded = useSelector(totalSupplyLoadedSelector);
    const totalSupply = useSelector(totalSupplySelector);
    const isMinting = useSelector(isMintingTokenSelector);


    const loadblockchainData = async () => {
        await subscribeToEvents(nft,dispatch);
        await loadAllMintedTokens(nft,dispatch);
    }

    useEffect(() => {
        loadblockchainData();
    },[])

    const [fileBuffer, SetFileBuffer] = useState(null);
    const [ipfsHash, SetIpfsHash] = useState(null);
    const [carName, SetCarName] = useState(null);
    const [carDescription, SetCarDescription] = useState(null)

    const captureFile = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const file = event.target.files[0];
        let reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => convertToBuffer(reader);
    }

    const convertToBuffer = async (reader) => {
        const buffer = await Buffer.from(reader.result);
        SetFileBuffer(buffer);
    }

    const onIPFSSubmit = async (event) => {
        event.preventDefault();
        SetIsUploading(true);
        let ipfsHash = await ipfs.add(fileBuffer);
        SetIpfsHash(ipfsHash[0].hash);
        let metaData = {
            name: carName,
            description: carDescription,
            image: 'https://gateway.ipfs.io/ipfs/'+ ipfsHash[0].hash
        }

        let metaDataHash = await ipfs.add(Buffer.from(JSON.stringify(metaData)));

        SetIsUploading(false);

        await mintToken(nft, `https://gateway.ipfs.io/ipfs/${metaDataHash[0].hash}`, account, web3, dispatch);
    }


    return <Fragment>
        {account}
        <form onSubmit={onIPFSSubmit}>
            <Container>
                <Row>
                    <Col><b>Only Owner can mint the token</b></Col>
                </Row>
                <Row>
                    <Col>
                        Name:
                    </Col>
                    <Col>
                        <input type="text" name="carName" onChange={(e) => SetCarName(e.target.value)} required/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Description:
                    </Col>
                    <Col>
                        <input type="text" name="carDescription"
                               onChange={(e) => SetCarDescription(e.target.value)} required/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        Car Image
                    </Col>
                    <Col>
                        <input type="file"
                               onChange={captureFile}
                               accept="image/png, image/jpeg"
                               required
                        /> <br/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {isUploading? <span> Status: Uploading to Ipfs</span>: null}
                        {isMinting ? <span> Status: Minting the token</span>: null}

                    </Col>
                    <Col>
                        <button type="submit" disabled={isUploading || isMinting}> {isUploading || isMinting ? <Spinner/>: 'Upload'}</button>
                    </Col>
                </Row>
            </Container>
        </form>

        {totalSupplyLoaded && <TokenDetails totalSupply={totalSupply}/>}

    </Fragment>

}

export default IpfsUpload;