import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ScoresCollection } from '/imports/db/ScoresCollection';


Meteor.publish('scores', function publishScores(gameId) {
  check(gameId, String)

  //If no user, return ready with no data
  if (!this.userId) {
      return this.ready();
  }

  const selector = {
    gameId: gameId
  };

  const publicFields = {
    score: 1,
    userId: 1,
    gameId: 1,
  }
  
  return ScoresCollection.find(selector, { fields: publicFields });

});