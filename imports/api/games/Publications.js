import { Meteor } from 'meteor/meteor';
import { GamesCollection } from '/imports/db/GamesCollection';

// All publications must either return a cursor or this.ready()
// this.ready() indicates to the subscription that all the initial data has been sent
Meteor.publish('games', function publishGames() {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }


    return GamesCollection.find({ players: { $elemMatch: { _id: this.userId } } });


    // return all games for testing
    // return GamesCollection.find({});

});