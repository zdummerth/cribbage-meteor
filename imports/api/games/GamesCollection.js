import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { HandsCollection } from '/imports/api/hands/HandsCollection';
import { ScoresCollection } from '/imports/api/scores/ScoresCollection';


export const GamesCollection = new Mongo.Collection('games');

GamesCollection.helpers({
  getUsername(id) {

    const user = Meteor.users.findOne(id);

    if( !!user ) {
      return user.username
    }

    return 'Could not find user'

  },
  score(id) {
    const scoreDoc = ScoresCollection.findOne({ gameId: this._id, userId: id});

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
      const hand =  dealt.filter( card => !discarded.includes(card) );
      return { discarded, hand }
    }
    else {
      const noData = ['blue_back']
      return { discarded: noData, hand: noData}
    }

  },
  oppId() {
    return this.players.find(playerId => playerId !== Meteor.userId())
  }
});