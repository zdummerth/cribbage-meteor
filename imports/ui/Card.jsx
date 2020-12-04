import React from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.div`
    flex: 1 1 80px; 
    max-width: 80px;
`

const Image = styled.img`
    width: 100%;
`

export default function Card({ 
    id, 
    isCribSubmitted, 
    cribCards, 
    tempHand, 
    setCribCards, 
    setTempHand, 
    runId,
    scoringEventsForCard,
    addCardToRun,
    noClick,
    disabled
}) {

    const handleClick = card => {
        
        if(noClick || disabled) {
            console.log({disabled});
            return
        }
        if(isCribSubmitted) {
            addCardToRun({ card, runId })
        } else {
            toggleCrib(card)
        }
    }

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
        <ImageWrapper onClick={() => handleClick(id)}>
            { scoringEventsForCard ? (
                <>
                    {scoringEventsForCard.map(ev => (
                        <>
                            <div>{ev.type}</div>
                            <div>{ev.points}</div>
                        </>
                    ))}

                </>
            ) : null}
            <Image src={`/cardImages/${id}.jpg`} alt={'two'}/>
        </ImageWrapper>
    )
}
