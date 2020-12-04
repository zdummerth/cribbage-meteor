import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { HandsCollection } from '/imports/db/HandsCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';
import { GamesCollection } from '/imports/api/games/GamesCollection';



import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createGame } from '../games/Methods'

import { deal } from '../cardFunctions.js'




export const createHand = new ValidatedMethod({
  name: 'hands.create',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

      //hands are created when run is created
  }
});

export const setIsGo = new ValidatedMethod({
  name: 'hands.setIsGo',
  validate({ handId, runId, gameId }) {
    check(runId, String);
    check(handId, String);
    check(gameId, String);

  },

  run({ handId, runId, gameId}) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } } );

    if (!game) {
      throw new Meteor.Error('Could not find hand in set is go');
    }

    const hand = HandsCollection.findOne({ _id: handId, userId: this.userId, runId });

    if (!hand) {
      throw new Meteor.Error('Could not find hand in set is go');
    }

    const run = RunsCollection.findOne({ _id: runId });

    if (!run) {
      throw new Meteor.Error('Could not find run in set is go');
    }


    const oppHand = HandsCollection.findOne({ userId: game.oppId(), runId });

    if (!oppHand) {
      throw new Meteor.Error('Could not find opponent');
    }

    if(oppHand.isGo) {
      const { currentRun, pastRuns } = run;
      const newPastRuns = [...pastRuns, currentRun]

      // Still need to write this part of the game
      // If the past runs cards = 8, then create new run and set currentRunId in game 
      // If past cards < 8 just reset the current run
      
    } else {
  
      HandsCollection.update( hand._id, {
        $set: { isGo: true}
      });
    }



      
  }
});

export const removeHand = new ValidatedMethod({
  name: 'hands.remove',
  validate(handId) {
    check(handId, String)
  },

  run(handId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const hand = HandsCollection.findOne();

    if (!hand) {
      throw new Meteor.Error('Access denied.');
    }

    HandsCollection.remove(handId);
  }
});

export const discardToCrib = new ValidatedMethod({
  name: 'hand.discardToCrib',
  validate({ cards, handId }) {
    check(cards, [ String ]);
    check(handId, String);
  },

  run({ cards, handId }) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const hand = HandsCollection.findOne({ _id: handId, userId: this.userId });

    if (!hand) {
      throw new Meteor.Error('Access denied.');
    }

    HandsCollection.update(handId, { 
      $set: { discarded: cards, handLength: 4 } 
    } );
    
  }
});