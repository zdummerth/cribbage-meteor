import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { HandsCollection } from '/imports/db/HandsCollection';


import Card from '/imports/ui/Card';

import styled from 'styled-components'

const Container = styled.div`

`

const Scoreboard = styled.div`

`

const OpponentHand = styled.div`
    display: flex;
`

const RunContainer = styled.div`

`

const Run = styled.div`

`

const Hand = styled.div`
    display: flex;
`

export const CurrentGame = ({ game, closeGame }) => {

    const { hand, opponentHandLength, isLoadingHand } = useTracker(() => {
        const noDataAvailable = { 
            hand: { 
                dealt: [], 
                discarded: [] 
            },
            opponentHandLength: 0 
        };
        if (!Meteor.user()) {
          return noDataAvailable;
        }
        
        const playerHandHandler = Meteor.subscribe('hand.forGame', game._id);
        const oppHandLengthHandler = Meteor.subscribe('opponent.handLength', game._id);

    
        if (!(playerHandHandler.ready() && oppHandLengthHandler.ready())) {
            return noDataAvailable;
        }

        // if (!playerHandHandler.ready()) {
        //     return noDataAvailable;
        // }

    
        const hand = HandsCollection.findOne({ userId: Meteor.user()._id});
        const opponentHand = HandsCollection.findOne({ userId: { $ne: Meteor.user()._id}});

        const opponentHandLength = opponentHand.handLength

        console.log({opponentHand})


        return { hand, opponentHandLength };
    });

    const playerHand = hand.dealt.filter(card => !hand.discarded.includes(card));
    console.log({playerHand})
    
    const selector = { _id: { $in: game.players } };

    const players = Meteor.users.find(selector, {fields: {'username': 1}}).fetch();

    const usernames = players.map(p => <p key={p._id}>{p.username}</p>);

    let opponentCards = [];
    for(let i = 0; i < opponentHandLength; i++) {
        opponentCards.push(<Card id={'blue_back'}/>)
    }

    return (
        <Container>
            <Scoreboard>

            </Scoreboard>
            <p>Opponent Hand</p>
            <OpponentHand>
                {
                    opponentCards
                }
            </OpponentHand>
            <RunContainer>
                {game.run.map(card => <Card id={card} />)}
            </RunContainer>
            <p>Player Hand</p>
            <Hand>
                {isLoadingHand && <div>loading hand...</div>}

                {hand ? (
                    <>
                        {playerHand.map(value => <Card id={value} />)}
                    </>
                ) : (
                    null
                )}
            </Hand>
            <button onClick={() => closeGame(game)}>Close Game</button>

        </Container>
    )
}