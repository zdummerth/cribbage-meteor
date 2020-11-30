import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { HandsCollection } from '/imports/db/HandsCollection';
import { ScoresCollection } from '/imports/db/ScoresCollection';



import Card from '/imports/ui/Card';

import styled from 'styled-components'

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


export const CurrentGame = ({ game, closeGame, user }) => {

    const { score, remainingCards, loading, opponent, userHandExists, discarded } = useTracker(() => {

        const playerHandHandler = Meteor.subscribe('hand.forGame', game._id);
        const oppHandLengthHandler = Meteor.subscribe('opponent.handLength', game._id);
        const scoresHandler = Meteor.subscribe('scores', game._id);

        const loading = !(playerHandHandler.ready() && oppHandLengthHandler.ready() && scoresHandler.ready())

        const userHand = HandsCollection.findOne( { userId: user._id, completed: false, gameId: game._id } );
        const userScore = ScoresCollection.findOne( { userId: user._id, gameId: game._id } );

        const userHandExists = !loading && !!userHand;
        const userScoreExists = !loading && !!userScore;

        const score = userScoreExists ? userScore.score : 0;

        let remainingCards = [];
        let discarded = []
        if (userHandExists) {
            remainingCards = userHand.dealt.filter( card => !userHand.discarded.includes(card) );
            discarded = userHand.discarded
        }


        const opponentId = game.players.find(playerId => playerId !== user._id);

        const opponentUsername = Meteor.users.findOne({ _id: opponentId }, {fields: {"username": 1}});
        const opponentScore = ScoresCollection.findOne({ userId: opponentId }, { fields: { "score": 1 }});
        const opponentHandLength = HandsCollection.findOne({ userId: opponentId }, { fields: { "handLength": 1 }});

        const opponentUsernameExists = !loading && !!opponentUsername
        const opponentScoreExists = !loading && !!opponentScore
        const opponentHandLengthExists = !loading && !!opponentHandLength

        const opponent = (opponentScoreExists && opponentUsernameExists && opponentHandLengthExists) ? (
            {
                username: opponentUsername.username,
                score: opponentScore.score,
                _id: opponentId,
                handLength: opponentHandLength.handLength
            }
        ) : (
            {
                username: 'Could not load opponent',
                score: 0,
                _id: '',
                handLength: 0
            }
        )

        console.log({ opponentScoreExists, opponentUsernameExists, opponentHandLengthExists })

        return { opponent, loading, score, remainingCards, userHandExists, discarded };
    });

    

    let opponentCards = [];
    for(let i = 0; i < opponent.handLength; i++) {
        opponentCards.push(<Card id={'blue_back'} key={i}/>)
    }

    return (
        <Container>
                
            {loading && <div>loading hand...</div>}

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
                { discarded.length === 0 ? (
                    <>
                    </>
                ) : (
                    <>
                    </>
                )}
                {game.run.map(card => <Card id={card} />)}
            </MainCardContainer>

            <p>Player Hand</p>
            <Hand>
                {userHandExists ? (
                    <>
                        {remainingCards.map(value => <Card id={value} key={value} />)}
                    </>
                ) : (
                    null
                )}
            </Hand>
            <button onClick={() => closeGame(game)}>Close Game</button>

        </Container>
    )
}