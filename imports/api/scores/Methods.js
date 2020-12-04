import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { ScoresCollection } from '/imports/api/scores/ScoresCollection';
import { GamesCollection } from '/imports/api/games/GamesCollection';


import { ValidatedMethod } from 'meteor/mdg:validated-method';


export const createScores = new ValidatedMethod({
  name: 'scores.create',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } });


    if (!game) {
      throw new Meteor.Error('Game does not exist');
    }

    const opponentId = game.players.find(playerId => playerId !== this.userId);

    const timestamp = new Date();

    const scoreOne = {
      createdAt: timestamp,
      userId: this.userId,
      gameId,
      score: 0
    };

    const scoreTwo = {
      createdAt: timestamp,
      userId: opponentId,
      gameId,
      score: 0
    };

    ScoresCollection.insert(scoreOne);
    ScoresCollection.insert(scoreTwo);
  }
});