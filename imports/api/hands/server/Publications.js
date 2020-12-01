import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { HandsCollection } from '/imports/db/HandsCollection';
import { GamesCollection } from '/imports/api/games/GamesCollection';


Meteor.publish('hand.forGame', function publishGames(gameId) {
  check(gameId, String)

  //If no user, return ready with no data
  if (!this.userId) {
      return this.ready();
  }

  const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } });

  if (!game) {
    throw new Meteor.Error('Access denied.');
  }

  const selector = {
    gameId,
    userId: this.userId
  }

  const publicFields = {
    dealt: 1,
    discarded: 1,
    completed: 1,
    userId: 1,
    gameId: 1
  }

  return HandsCollection.find(selector, { fields: publicFields });

});

Meteor.publish('opponent.handLength', function publishGames(gameId) {
  check(gameId, String)

  //If no user, return ready with no data
  if (!this.userId) {
      return this.ready();
  }

  const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } });

  // query below works if I need to check against the userId and opp Id
  // const shellQuery = db.games.find({ _id: "moRTTM5fBghKZFfmm", players: { $elemMatch: { $eq: "h25Tr3MDj2uJWkpox" }, $elemMatch: { $eq: "YW523xxJqQnMgFwZH" } } })

  if (!game) {
    throw new Meteor.Error('Access denied.');
  }

  const opponentId = game.players.find(playerId => playerId !== this.userId);

  const Selector = {
    gameId,
    userId: opponentId
  }

  const publicFields = {
    handLength: 1,
    userId : 1,
    gameId: 1
  }

  return HandsCollection.find(Selector, { fields: publicFields } );

});
