import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { GamesCollection } from '/imports/api/games/GamesCollection';


import { CurrentGame } from '/imports/ui/CurrentGame';



export const CurrentGameContainer = ({ game, closeGame, user }) => {

    const { score, hand, loading, opponent, gameDocExists } = useTracker(() => {

        const playerHandHandler = Meteor.subscribe('hand.forGame', game._id);
        const oppHandLengthHandler = Meteor.subscribe('opponent.handLength', game._id);
        const scoresHandler = Meteor.subscribe('scores', game._id);

        const loading = !(playerHandHandler.ready() && oppHandLengthHandler.ready() && scoresHandler.ready())

        const gameDoc = GamesCollection.findOne({ _id: game._id });
        const gameDocExists = !loading && !!gameDoc;

        
        if(gameDocExists) {
            const opponent = gameDoc.opponent();
            const score = gameDoc.score();
            const hand = gameDoc.hand();

            return { opponent, score, hand, gameDocExists, loading }
        } else {
            return { gameDocExists, loading }
        }

    });
     
    return (
        <>
        { loading ? <div>loading.....</div> : gameDocExists ? (
            <CurrentGame
                opponent={opponent}
                loading={loading}
                score={score}
                hand={hand}
                game={game}
                closeGame={closeGame}
                user={user}
            />
        ) : (
            <div>Game does not exist</div>
        )}

        </>

    )
}