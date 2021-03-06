import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/api/games/GamesCollection';

// All publications must either return a cursor or this.ready()
// this.ready() indicates to the subscription that all the initial data has been sent

Meteor.publish('games', function publishGames() {

    if (!this.userId) {
        return this.ready();
    }

    return GamesCollection.find({ players: { $elemMatch: { $eq: this.userId } } } );

});