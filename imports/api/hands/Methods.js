import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { HandsCollection } from '/imports/db/HandsCollection';
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

export const removeHand = new ValidatedMethod({
  name: 'hands.remove',
  validate(inviteId) {
    check(inviteId, String)
  },

  run(inviteId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const invite = HandsCollection.findOne({ _id: inviteId, $or: [{'sender._id': this.userId}, {'receiver._id': this.userId}] });

    if (!invite) {
      throw new Meteor.Error('Access denied.');
    }

    HandsCollection.remove(inviteId);
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