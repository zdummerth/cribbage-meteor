import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { HandsCollection } from '/imports/db/HandsCollection';
import { GamesCollection } from '/imports/db/GamesCollection';


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

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } });


    // console.log({game})

    if (!game) {
      throw new Meteor.Error('Could Not find Game');
    }

    const opponentId = game.players.find(playerId => playerId !== this.userId);

    const deck = deal(2, 6);

    const userHand = deck.players[0].hand;
    const oppHand = deck.players[1].hand;


    // console.log({userHand, oppHand})

    const timestamp = new Date();

    const handOneId = HandsCollection.insert({
      createdAt: timestamp,
      dealt: userHand,
      discarded: [],
      completed: false,
      userId: this.userId,
      gameId,
      handLength: 6
    });

    const handTwoId = HandsCollection.insert({
      createdAt: timestamp,
      dealt: oppHand,
      discarded: [],
      completed: false,
      userId: opponentId,
      gameId,
      handLength: 6
    });

    // console.log({handOneId, handTwoId})


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
    check(cards, [ String ])
  },

  run(cards) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const hand = HandsCollection.findOne({ _id: handId, userId: this.userId });

    if (!hand) {
      throw new Meteor.Error('Access denied.');
    }

    HandsCollection.updata(handId, { $set: { discarded: cards } } );
    
  }
});