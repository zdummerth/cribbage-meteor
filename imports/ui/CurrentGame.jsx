import React, { useState } from 'react';
import styled from 'styled-components'

import Card from '/imports/ui/Card';


const Container = styled.div`
    width: 100vw;
`

const Scoreboard = styled.div`
    display: flex;
    justify-content: space-around;
`

const OpponentHand = styled.div`
    display: flex;
    justify-content: center;
`

const MainCardContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 200px;
`

const Run = styled.div`

`

const Hand = styled.div`
    display: flex;
    justify-content: center;
`


export const CurrentGame = ({ 
    game, 
    closeGame, 
    user, 
    userScore, 
    hand, 
    handId, 
    opponent, 
    discarded, 
    currentRun, 
    addCardToRun, 
    addCardsToCrib 
}) => {

    let opponentCards = [];
    for(let i = 0; i < opponent.handLength; i++) {
        opponentCards.push(<Card id={'blue_back'} key={i} noClick={true} />)
    }

    const isCribSubmitted = discarded.length === 2;
    const [ cribCards, setCribCards ] = useState([]);
    const [ tempHand, setTempHand ] = useState(hand);

    const cardWithProps = ({ card, scoringEventsForCard, noClick }) => (
        <Card 
            id={card}
            setCribCards={setCribCards}
            setTempHand={setTempHand} 
            cribCards={cribCards}
            tempHand={tempHand}
            isCribSubmitted={isCribSubmitted}
            addCardToRun={addCardToRun}
            scoringEventsForCard={scoringEventsForCard}
            runId={game.currentRunId}
            noClick={noClick}
        />
    )

    return (
        <Container>
                
            <Scoreboard>
                <div>
                    <p>{user.username}</p>
                    <p>{userScore}</p>
                </div>
                <div>
                    <p>{opponent.username}</p>
                    <p>{opponent.score}</p>
                </div>
            </Scoreboard>

            <p>Opponent Hand</p>
            <OpponentHand>
                { opponentCards }
            </OpponentHand>

            <div>Run Total:</div>
            <div>{currentRun.total}</div>
            <MainCardContainer>
                { isCribSubmitted ? (
                    <>
                        {currentRun.cards.map((card, index) => {

                            if (currentRun.scoringEvents.length > 0) {
                                const scoringEventsForCard = currentRun.scoringEvents.filter(ev => ev.cardIndex === index);
                                console.log({scoringEventsForCard})
                                return cardWithProps({ card, scoringEventsForCard, noClick: false })
                            }

                            return cardWithProps({ card, scoringEventsForCard: null, noClick: true })})
                        }
                    </>
                ) : (
                    <>
                        {cribCards.map(card => cardWithProps({ card, scoringEventsForCard: null, noClick: false }))}
                    </>
                )}
            </MainCardContainer>
            
            { cribCards.length === 2 && !isCribSubmitted? (
                <button onClick={() => addCardsToCrib({ cards: cribCards, handId })}>Submit Crib</button>
            ) : null}

            <p>Player Hand</p>
            <Hand>
                { isCribSubmitted ? (
                    <>
                        {hand.map(card => cardWithProps({ card, scoringEventsForCard: null, noClick: false }))}
                    </>
                ) : (
                    <>
                        {tempHand.map(card => cardWithProps({ card, scoringEventsForCard: null, noClick: false }))}
                    </>
                )}
            </Hand>
            <button onClick={() => closeGame(game)}>Close Game</button>

        </Container>
    )
}