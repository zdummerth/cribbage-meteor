import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { RunsCollection } from '/imports/api/runs/RunsCollection';
import { GamesCollection } from '/imports/api/games/GamesCollection';


// All publications must either return a cursor or this.ready()
// this.ready() indicates to the subscription that all the initial data has been sent
Meteor.publish('run.forGame', function publishRunForGame(gameId) {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } } );

    if(!game) {
        return this.ready()
    }

    const publicFields = {
        starterCard: 1,
        gameId: 1,
        currentRun: 1,
        currentRunCards: 1,
        currentRunTotal: 1,
        scoringEvents: 1,
        pastRuns: 1,
        completed: 1
    }

    return RunsCollection.find({ gameId: gameId }, { fields: publicFields });


});