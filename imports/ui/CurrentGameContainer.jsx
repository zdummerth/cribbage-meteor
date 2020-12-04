import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '/imports/api/games/GamesCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';

// import { createRun } from '/imports/api/runs/Methods';
import { discardToCrib, setIsGo } from '/imports/api/hands/Methods';
import { addToRun } from '/imports/api/runs/Methods';
import { nextTurn } from '/imports/api/games/Methods';


import { checkIsGo } from '/imports/api/cardFunctions';




import { CurrentGame } from '/imports/ui/CurrentGame';

const addCardToRun = ({ card, runId }) => {
    const validCards = addToRun.call({ card, runId})
    // console.log({validCards})
};
const addCardsToCrib = ({ cards, handId }) => discardToCrib.call({ cards, handId });
const setPlayerGo = ({ runId, handId }) => setIsGo.call({ runId, handId });



export const CurrentGameContainer = ({ game, closeGame, user }) => {

    const oppId =  game.players.find(playerId => playerId !== user._id)

    // console.log({game})

    const { 
        userScore, 
        hand, 
        loading, 
        opponent, 
        gameDocExists, 
        discarded, 
        runDocExists, 
        currentRun, 
        handId,
        isTurn,
        turnId,
        runId,
        isGo
    } = useTracker(() => {

        const oppHandLenghthSubData = {
            gameId: game._id,
            runId: game.currentRunId,
            oppId
        }
        const oppHandHandler = Meteor.subscribe('opponent.hand', oppHandLenghthSubData);
        const playerHandHandler = Meteor.subscribe('hand.forRun', game.currentRunId);
        const scoresHandler = Meteor.subscribe('scores', game._id);
        const runHandler = Meteor.subscribe('run.forGame', game._id);


        const loading = !(playerHandHandler.ready() && oppHandHandler.ready() && scoresHandler.ready() && runHandler.ready());

        const gameDoc = GamesCollection.findOne({ _id: game._id });
        const gameDocExists = !loading && !!gameDoc;


        const runDoc = RunsCollection.findOne({ _id: game.currentRunId, completed: false });
        
        const runDocExists = !loading && !!gameDoc;



        
        if(gameDocExists && runDocExists) {

            const opponent = {
                username: gameDoc.getUsername(oppId),
                score: gameDoc.score(oppId),
                handLength: runDoc.oppHand(oppId).handLength,
                isGo: runDoc.oppHand(oppId).isGo,
            }

            const { currentRun } = runDoc;
            const runId = runDoc._id

            const userScore = gameDoc.score(user._id);
            const { turnId } = gameDoc;
            const isTurn = turnId === user._id

            const handData = {
                userId: user._id,
                runCards: currentRun.cards
            }

            const { hand, discarded, handId, isGo } = runDoc.hand(handData);


            return { 
                opponent, 
                userScore, 
                hand, 
                handId,
                gameDocExists, 
                loading, 
                discarded, 
                runDocExists, 
                currentRun,
                turnId,
                isTurn, 
                isGo,
                runId,
            }

        } else {
            return { gameDocExists, runDocExists, loading }
        }
    });
    
    if(gameDocExists && runDocExists) {

        //This checks if go whenever other player plays the last card
        const isPlayerGo = checkIsGo({ cards: hand, run: currentRun.cards});

        if(isGo && opponent.isGo) {
            
            console.log('run is over')
            // Still need to write this part of the game

        } else if(!isGo && isPlayerGo) {
            setIsGo.call({ handId, runId, gameId: game._id });
        } 

    }

    


     
    return (
        <>
        { loading ? <div>loading.....</div> : gameDocExists ? (
            <CurrentGame
                opponent={opponent}
                loading={loading}
                userScore={userScore}
                hand={hand}
                handId={handId}
                discarded={discarded}
                game={game}
                closeGame={closeGame}
                user={user}
                currentRun={currentRun}
                addCardsToCrib={addCardsToCrib}
                addCardToRun={addCardToRun}
                isTurn={isTurn}
            />
        ) : (
            <>
                <div>Game does not exist</div>
                <button onClick={() => closeGame(game)}>Back to home</button>
            </>
        )}

        </>

    )
}