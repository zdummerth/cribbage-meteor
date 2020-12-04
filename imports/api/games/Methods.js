import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/api/games/GamesCollection';
import { HandsCollection } from '/imports/db/HandsCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';

import { InvitesCollection } from '/imports/db/InvitesCollection';


import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createScores } from '../scores/Methods';
import { createRun } from '../runs/Methods';




export const createGame = new ValidatedMethod({
  name: 'games.create',
  validate({otherId, inviteId}) {
    check({otherId, inviteId}, {
      otherId: String,
      inviteId: String
    })
  },

  run({otherId, inviteId}) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if(otherId === this.userId) {
      throw new Meteor.Error('You cannot create a game with yourself');
    }

    const opponent = Meteor.users.findOne(otherId);

    if (!opponent) {
      throw new Meteor.Error('opponent does not exist');
    }

    const invite = InvitesCollection.findOne({ _id: inviteId, $or: [{ senderId: this.userId }, { receiverId: this.userId }] });

    if (!invite) {
      throw new Meteor.Error('There must be an invite to create a game');
    }

    const gameId = GamesCollection.insert({
      createdAt: new Date(),
      players: [ this.userId, otherId ],
      completed: false,
      currentRunId: '',
      pastRunIds: [],
      turnId: this.userId
    });

    InvitesCollection.remove(inviteId);

    const runId = createRun.call(gameId);

    GamesCollection.update(gameId, {
      $set: {
        currentRunId: runId
      }
    })
    createScores.call(gameId);

  }
});

export const nextTurn = new ValidatedMethod({
  name: 'games.nextTurn',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } });


    if (!game) {
      throw new Meteor.Error('Access denied.');
    }

    const oppId = game.oppId();

    console.log({oppId})

    
    GamesCollection.update(gameId, {
      $set: { turn: oppId}
    });
  }
});

export const removeGame = new ValidatedMethod({
  name: 'games.remove',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } });



    if (!game) {
      throw new Meteor.Error('Access denied.');
    }
    
    GamesCollection.remove(gameId);
  }
});