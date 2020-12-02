import React, { useState } from 'react';

export default function Card({ id, isCribSubmitted, cribCards, tempHand, setCribCards, setTempHand }) {

    const inCrib = card => cribCards.includes(card);
    const inTempHand = card => tempHand.includes(card);



    const toggleCrib = card => {
        if (!inCrib(card) && cribCards.length < 2) {
            setCribCards([...cribCards, card]);
            setTempHand(tempHand.filter(c => c !== card));
        } else if (!inTempHand(card)) {
            setCribCards(cribCards.filter(c => c !== card))
            setTempHand([...tempHand, card])
        }
    }


    return (
        <div onClick={() => toggleCrib(id)}>
            <img style={{width: '70px', height: '107px'}} src={`/cardImages/${id}.jpg`} alt={'two'}/>
        </div>
    )
}
