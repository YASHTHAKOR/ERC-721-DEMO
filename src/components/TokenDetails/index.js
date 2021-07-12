import React, {Fragment, useState} from 'react';
import {CardColumns} from 'react-bootstrap';
import TokenInfo from "./TokenInfo";

function TokenDetails({totalSupply}) {

    let tokensArray = [];

    for(let i=1; i<= totalSupply; i++) {
        tokensArray.push(i);
    }


    return  <Fragment>
        <CardColumns>
        {tokensArray.map((id) => {
            return <TokenInfo tokenId={id}/>
        })}
        </CardColumns>
    </Fragment>

}

export default TokenDetails;