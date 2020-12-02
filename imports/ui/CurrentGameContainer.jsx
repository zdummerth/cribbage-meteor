import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '/imports/api/games/GamesCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';

import { createRun } from '/imports/api/runs/Methods';



import { CurrentGame } from '/imports/ui/CurrentGame';

const addCardToRun = value => value;
const addCardToCrib = value => value;


export const CurrentGameContainer = ({ game, closeGame, user }) => {

    const oppId =  game.players.find(playerId => playerId !== user._id)

    console.log({game})

    const { userScore, hand, loading, opponent, gameDocExists, discarded, runDocExists, currentRun } = useTracker(() => {

        const playerHandHandler = Meteor.subscribe('hand.forRun', game.currentRunId);

        const oppHandLenghthSubData = {
            gameId: game._id,
            runId: game.currentRunId,
            oppId
        }
        const oppHandLengthHandler = Meteor.subscribe('opponent.handLength', oppHandLenghthSubData);
        const scoresHandler = Meteor.subscribe('scores', game._id);
        const runHandler = Meteor.subscribe('run.forGame', game._id);


        const loading = !(playerHandHandler.ready() && oppHandLengthHandler.ready() && scoresHandler.ready() && runHandler.ready());

        const gameDoc = GamesCollection.findOne({ _id: game._id });
        const gameDocExists = !loading && !!gameDoc;

        const runDoc = RunsCollection.findOne({ gameId: game._id, completed: false });
        const runDocExists = !loading && !!gameDoc;



        
        if(gameDocExists && runDocExists) {

            const opponent = {
                username: gameDoc.getUsername(oppId),
                score: gameDoc.score(oppId),
                handLength: runDoc.getOppHandLength(oppId)
            }

            const { currentRun } = runDoc

            const userScore = gameDoc.score(user._id);

            const { hand, discarded } = runDoc.hand(user._id);

            return { opponent, userScore, hand, gameDocExists, loading, discarded, runDocExists, currentRun }

        } else {
            console.log('run doc does not exist')
            return { gameDocExists, runDocExists, loading }
        }


    });
     
    return (
        <>
        { loading ? <div>loading.....</div> : gameDocExists ? (
            <CurrentGame
                opponent={opponent}
                loading={loading}
                userScore={userScore}
                hand={hand}
                discarded={discarded}
                game={game}
                closeGame={closeGame}
                user={user}
                currentRun={currentRun}
            />
        ) : (
            <div>Game does not exist</div>
        )}

        </>

    )
}