import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components'

import Card from '/imports/ui/Card';


const Container = styled.div`

`

const Scoreboard = styled.div`
    display: flex;
    justify-content: space-around;
`

const OpponentHand = styled.div`
    display: flex;
`

const MainCardContainer = styled.div`
    display: flex;
    height: 107px;
`

const Run = styled.div`

`

const Hand = styled.div`
    display: flex;
`


export const CurrentGame = ({ game, closeGame, user, userScore, hand, opponent, discarded, currentRun, submitToRun, submitToCrib }) => {

    let opponentCards = [];
    for(let i = 0; i < opponent.handLength; i++) {
        opponentCards.push(<Card id={'blue_back'} key={i}/>)
    }

    const isCribSubmitted = discarded.length === 2;
    const [ cribCards, setCribCards ] = useState([]);
    const [ tempHand, setTempHand ] = useState(hand);

    const cardWithProps = card => (
        <Card 
            id={card}
            setCribCards={setCribCards}
            setTempHand={setTempHand} 
            cribCards={cribCards}
            tempHand={tempHand}
            isCribSubmitted={isCribSubmitted}
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

            <MainCardContainer>
                { isCribSubmitted ? (
                    <>
                        {currentRun.map(card => cardWithProps(card))}
                    </>
                ) : (
                    <>
                        {cribCards.map(card => cardWithProps(card))}
                    </>
                )}
            </MainCardContainer>

            <p>Player Hand</p>
            <Hand>
                { isCribSubmitted ? (
                    <>
                        {hand.map(card => cardWithProps(card))}
                    </>
                ) : (
                    <>
                        {tempHand.map(card => cardWithProps(card))}
                    </>
                )}
            </Hand>
            <button onClick={() => closeGame(game)}>Close Game</button>

        </Container>
    )
}