import React from 'react';
import styled from 'styled-components'

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

`

const Run = styled.div`

`

const Hand = styled.div`
    display: flex;
`


export const CurrentGame = ({ game, closeGame, user, score, hand, opponent, discarded }) => {

    let opponentCards = [];
    for(let i = 0; i < opponent.handLength; i++) {
        opponentCards.push(<Card id={'blue_back'} key={i}/>)
    }

    return (
        <Container>
                

            <Scoreboard>
                <div>
                    <p>{user.username}</p>
                    <p>{score}</p>
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

            </MainCardContainer>

            <p>Player Hand</p>
            <Hand>
                <>
                    {hand.map(value => <Card id={value} key={value} />)}
                </>
            </Hand>
            <button onClick={() => closeGame(game)}>Close Game</button>

        </Container>
    )
}