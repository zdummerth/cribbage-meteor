import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/api/games/GamesCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';

import { HandsCollection } from '/imports/db/HandsCollection';
import { InvitesCollection } from '/imports/db/InvitesCollection';


import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createHand } from '../hands/Methods'
import { createScores } from '../scores/Methods'

import { deal } from '../cardFunctions.js'





export const createRun = new ValidatedMethod({
  name: 'runs.create',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } } );

    if (!game) {
      throw new Meteor.Error('There must be a game to create a run');
    }


    const opponentId = game.players.find(playerId => playerId !== this.userId);

    const deck = deal(2, 6);

    const userHand = deck.players[0].hand;
    const oppHand = deck.players[1].hand;
    const starterCard = deck.starterCard;

    const timestamp = new Date();


    //still need to verify succesful writes to database

    const runId = RunsCollection.insert({
      gameId,
      createdAt: timestamp,
      starterCard,
      currentCards: [],
      pastCards: [],
      completed: false
    });


    const handOneId = HandsCollection.insert({
      createdAt: timestamp,
      dealt: userHand,
      discarded: [],
      completed: false,
      userId: this.userId,
      runId,
      handLength: 6
    });

    const handTwoId = HandsCollection.insert({
      createdAt: timestamp,
      dealt: oppHand,
      discarded: [],
      completed: false,
      userId: opponentId,
      runId,
      handLength: 6
    });

    return runId

  }
});
