import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { HandsCollection } from '/imports/db/HandsCollection';
import { GamesCollection } from '/imports/api/games/GamesCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';



Meteor.publish('hand.forRun', function publishHandForRun(runId) {
  check(runId, String)

  //If no user, return ready with no data
  if (!this.userId) {
      return this.ready();
  }

  const hand = HandsCollection.findOne({ runId: runId, userId: this.userId });

  if (!hand) {
    throw new Meteor.Error('Access denied.');
  }

  const selector = {
    runId,
    userId: this.userId
  }

  const publicFields = {
    dealt: 1,
    discarded: 1,
    completed: 1,
    userId: 1,
    runId: 1
  }

  return HandsCollection.find(selector, { fields: publicFields });

});

Meteor.publish('opponent.handLength', function publishGames({ runId, oppId, gameId }) {
  check(oppId, String);
  check(runId, String);
  check(gameId, String);


  //If no user, return ready with no data
  if (!this.userId) {
      return this.ready();
  }

  const game = GamesCollection.findOne({ _id: gameId, currentRunId: runId,  players: { $elemMatch: { $eq: this.userId, $eq: oppId } } });

  // query below works if I need to check against the userId and opp Id
  // const shellQuery = db.games.find({ _id: "moRTTM5fBghKZFfmm", players: { $elemMatch: { $eq: "h25Tr3MDj2uJWkpox" }, $elemMatch: { $eq: "YW523xxJqQnMgFwZH" } } })

  if (!game) {
    throw new Meteor.Error('Access denied.');
  }


  const Selector = {
    runId,
    userId: oppId
  }

  const publicFields = {
    handLength: 1,
    userId : 1,
    runId: 1
  }

  return HandsCollection.find(Selector, { fields: publicFields } );

});
