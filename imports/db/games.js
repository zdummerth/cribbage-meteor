import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


class GamesCollection extends Mongo.Collection {
  insert(game, callback) {

    return super.insert(game, callback);
  }

  remove(selector, callback) {
    
    return super.remove(selector, callback);
  }
}

export const Games = new GamesCollection('Games');

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// Games.schema = new SimpleSchema({
//   players: { type: Array },
//   'players.$': { type: String },
//   completed: { type: Boolean, defaultValue: false },
// });

// Games.attachSchema(Games.schema);

// This represents the keys from Games objects that should be published
// to the client. If we add secret properties to List objects, don't list
// them here to keep them private to the server.
Games.publicFields = {
  players: 1,
  completed: 1,
};

Games.helpers({
  players() {
    // const game = Games.find({ _id: this._id});
    // const { players } = game;
    
    // return Meteor.users.find({ _id: { $in: players } } );
    return Meteor.users.findOne();

  }
});
