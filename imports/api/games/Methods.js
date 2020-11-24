import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/db/GamesCollection';

import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const createGame = new ValidatedMethod({
  name: 'games.create',
  validate(players) {
    check(players, [{
      _id: String,
      username: String
    }])
  },

  run(players) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if(players.every(player => player._id === this.userId)) {
      throw new Meteor.Error('You cannot create a game with yourself');
    }

    const playerIndex = players.findIndex(player => player._id === this.userId);

    if (playerIndex < 0) {
      throw new Meteor.Error('You cannot create a game for another player');
    }

    const opponentData = players.find(player => player._id !== this.userId);

    const opponent = Meteor.users.find({ username: opponentData.username, _id: opponentData._id});

    if (!opponent) {
      throw new Meteor.Error('opponent does not exist');
    }




    const username = Meteor.user({fields: {"username": 1}}).username;
    const userData = {
      _id: this.userId,
      username: username
    }



    const gameId = GamesCollection.insert({
      createdAt: new Date(),
      players: [ userData, opponentData ],
      completed: false
    });


  }
});

export const removeGame = new ValidatedMethod({
  name: 'games.remove',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { _id: this.userId } } });


    if (!game) {
      throw new Meteor.Error('Access denied.');
    }
    
    GamesCollection.remove(gameId);
  }
});