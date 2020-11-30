import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/db/GamesCollection';
import { HandsCollection } from '/imports/db/HandsCollection';
import { InvitesCollection } from '/imports/db/InvitesCollection';


import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createHand } from '../hands/Methods'
import { createScores } from '../scores/Methods'




export const createGame = new ValidatedMethod({
  name: 'games.create',
  validate({otherId, inviteId}) {
    check({otherId, inviteId}, {
      otherId: String,
      inviteId: String
    })
  },

  run({otherId, inviteId}) {

    console.log({inviteId, otherId})

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
      run: [],
      crib: []
    });

    InvitesCollection.remove(inviteId);

    createHand.call(gameId);
    createScores.call(gameId);

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