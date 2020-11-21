import { Meteor } from 'meteor/meteor';
import { GamesCollection } from '/imports/db/GamesCollection';

Meteor.publish('games', function publishGames() {
  return GamesCollection.find({ playerOneId: this.userId });
});