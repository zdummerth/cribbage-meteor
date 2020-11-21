import { check } from 'meteor/check';
import { GamesCollection } from '/imports/db/GamesCollection';
import { Meteor } from 'meteor/meteor';



Meteor.methods({
  'games.insert'(name) {


    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const userName = Meteor.user({fields: {'username': 1}}).username;


    GamesCollection.insert({
      createdAt: new Date(),
      playerOneId: this.userId,
      createdBy: userName,
    })
  },

  'games.remove'(gameId) {
    check(gameId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const game = GamesCollection.findOne({ _id: gameId, playerOneId: this.userId });

    if (!game) {
      throw new Meteor.Error('Access denied.');
    }

    GamesCollection.remove(gameId);
  },

  'games.setIsChecked'(gameId, isChecked) {
    check(gameId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const game = GamesCollection.findOne({ _id: gameId, playerOneId: this.userId });

    if (!game) {
      throw new Meteor.Error('Access denied.');
    }

    GamesCollection.update(gameId, {
      $set: {
        isChecked
      }
    });
  }
});