import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ScoresCollection } from '/imports/api/scores/ScoresCollection';


Meteor.publish('scores', function publishScores(gameId) {
  check(gameId, String)

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