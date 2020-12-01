import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { InvitesCollection } from '/imports/db/InvitesCollection';
import { HandsCollection } from '/imports/db/HandsCollection';
import { ScoresCollection } from '/imports/db/ScoresCollection';




export const GamesCollection = new Mongo.Collection('games');

GamesCollection.helpers({
  opponent() {
    let opponentData = {
      username: '',
      _id: '',
      score: '',
      cardsRemaining: 1
    }
    const opp = Meteor.users.findOne( { _id: { $ne: Meteor.userId(), $in: this.players } });
    if( !!opp ) {

      const scoreDoc = ScoresCollection.findOne({ gameId: this._id, userId: opp._id});
      const handLengthDoc = HandsCollection.findOne({ gameId: this._id, userId: opp._id});

      if( !!scoreDoc && !!handLengthDoc ) {
        opponentData = {
          username: opp.username,
          _id: opp._id,
          score: scoreDoc.score,
          handLength: handLengthDoc.handLength
        }
      }
    } 

    return opponentData

  },
  score() {
    const scoreDoc = ScoresCollection.findOne({ gameId: this._id, userId: Meteor.userId()});
    if( !!scoreDoc ) {
      return scoreDoc.score
    }
    else {
      return -999
    }
  }, 
  hand() {
    const handDoc = HandsCollection.findOne({ gameId: this._id, userId: Meteor.userId()});

    if( !!handDoc ) {
      const { discarded, dealt } = handDoc;
      return dealt.filter( card => !discarded.includes(card) );
    }
    else {
      return ['blue_back']
    }
    
  }
});