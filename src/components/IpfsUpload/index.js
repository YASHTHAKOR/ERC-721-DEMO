import React, {Fragment, useState} from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import ipfs from '../../commons/ipfs';


function IpfsUpload() {

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
        debugger;
        let ipfsHash = await ipfs.add(fileBuffer);
        SetIpfsHash(ipfsHash[0].hash);
        let metaData = {
            name: carName,
            description: carDescription,
            image: 'https://gateway.ipfs.io/ipfs/'+ ipfsHash[0].hash
        }

        let metaDataHash = await ipfs.add(Buffer.from(JSON.stringify(metaData)));
        debugger;


    }


    return <Fragment>
        <form onSubmit={onIPFSSubmit}>
            <Container>
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
                        /> <br/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button type="submit"> Upload</button>
                    </Col>
                </Row>
            </Container>
        </form>

    </Fragment>

}

export default IpfsUpload;