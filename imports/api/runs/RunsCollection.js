import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';
import { HandsCollection } from '/imports/db/HandsCollection';


export const RunsCollection = new Mongo.Collection('runs');

RunsCollection.helpers({
    oppHand(oppId) {
        const handDoc = HandsCollection.findOne({ runId: this._id, userId: oppId});
        if(!handDoc) {
            console.log('hand doc not found')
            return { handLength: 1, isGo: false }
        }

        return { handLength: handDoc.handLength, isGo: handDoc.isGo }
  
    },

    hand({ userId, runCards}) {
        const handDoc = HandsCollection.findOne({ runId: this._id, userId });
    
        if( !!handDoc ) {
            const { discarded, dealt, isGo } = handDoc;
            const handId = handDoc._id
            const hand =  dealt.filter( card => !discarded.includes(card) && !runCards.includes(card) );
            return { discarded, hand, handId, isGo }

        }
        else {
            const noData = ['blue_back']
            return { discarded: noData, hand: noData, handId: '', isGo: false}
        }
  
    },
  });