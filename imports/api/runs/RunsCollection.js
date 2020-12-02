import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';
import { HandsCollection } from '/imports/db/HandsCollection';


export const RunsCollection = new Mongo.Collection('runs');

RunsCollection.helpers({
    getOppHandLength(oppId) {
        const handLengthDoc = HandsCollection.findOne({ runId: this._id, userId: oppId});
        const handLength = !!handLengthDoc ? handLengthDoc.handLength : 1;

        return handLength
  
    },

    hand(id) {
        const handDoc = HandsCollection.findOne({ runId: this._id, userId: id });
    
        if( !!handDoc ) {
            const { discarded, dealt } = handDoc;
            const handId = handDoc._id
            const hand =  dealt.filter( card => !discarded.includes(card) );
            return { discarded, hand, handId }

        }
        else {
            const noData = ['blue_back']
            return { discarded: noData, hand: noData, handId: ''}
        }
  
    },
  });