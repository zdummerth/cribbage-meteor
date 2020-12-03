import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/api/games/GamesCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';

import { HandsCollection } from '/imports/db/HandsCollection';
import { InvitesCollection } from '/imports/db/InvitesCollection';


import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createHand } from '../hands/Methods'
import { createScores } from '../scores/Methods'

import { deal, getRunPoints } from '../cardFunctions.js'





export const createRun = new ValidatedMethod({
  name: 'runs.create',
  validate(gameId) {
    check(gameId, String)
  },

  run(gameId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const game = GamesCollection.findOne({ _id: gameId, players: { $elemMatch: { $eq: this.userId } } } );

    if (!game) {
      throw new Meteor.Error('There must be a game to create a run');
    }


    const opponentId = game.players.find(playerId => playerId !== this.userId);

    const deck = deal(2, 6);

    const userHand = deck.players[0].hand;
    const oppHand = deck.players[1].hand;
    const starterCard = deck.starterCard;

    const timestamp = new Date();


    //still need to verify succesful writes to database

    const runId = RunsCollection.insert({
      gameId,
      createdAt: timestamp,
      starterCard,
      currentRun: { cards: [], scoringEvents: [], total: 0 },
      currentRunCards: [],
      currentRunTotal: 0,
      pastRuns: [],
      completed: false
    });


    const handOneId = HandsCollection.insert({
      createdAt: timestamp,
      dealt: userHand,
      discarded: [],
      completed: false,
      userId: this.userId,
      runId,
      handLength: 6
    });

    const handTwoId = HandsCollection.insert({
      createdAt: timestamp,
      dealt: oppHand,
      discarded: [],
      completed: false,
      userId: opponentId,
      runId,
      handLength: 6
    });

    return runId

  }
});

export const addToRun = new ValidatedMethod({
  name: 'runs.addToRun',
  validate({ runId, card}) {
    check(runId, String);
    check(card, String);
  },

  run({ runId, card }) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    // const run = RunsCollection.findOne({ _id: runId });
    const game = GamesCollection.findOne({ currentRunId: runId, players: { $elemMatch: { $eq: this.userId } } } );
    const hand = HandsCollection.findOne({ runId: runId, userId: this.userId } );
    const run = RunsCollection.findOne({ _id: runId } );


    if (!game) {
      throw new Meteor.Error('There must be a game to add to run');
    }

    if (!hand) {
      throw new Meteor.Error('could not find hand');
    }

    if (!run) {
      throw new Meteor.Error('could not find run');
    }

    const { currentRun, pastRuns } = run;
    const { discarded, dealt } = hand;


    const allPastRunCards = [];
    pastRuns.forEach(run => allPastRunCards.push(run.cards));



    // pastRunCards is an array of arrays so must be flattened
    const cardInRun = card => currentRun.cards.includes(card) || allPastRunCards.flat().includes(card);
    const cardInHand = card => dealt.includes(card);
    const cardInDiscard = card => discarded.includes(card);



    const validCards = dealt.filter(card => (!cardInRun(card) && !cardInDiscard(card) && cardInHand(card)));

    if(!validCards.includes(card)) {
      throw new Meteor.Error('you must play a valid card');
    }


    // console.log('run before update', run.currentRun.cards);
    // console.log('run with new card', [...run.currentRun.cards, card]);

    const newRun = [...run.currentRun.cards, card];

    const { scoringEvents, runTotal } = getRunPoints(newRun);
    const newScoringEvents = [ ...run.currentRun.scoringEvents, ...scoringEvents]
    // console.log({ scoringEvents, runTotal });

    const newHandLength = validCards.filter(c => c !== card ).length;

    


    RunsCollection.update( runId, {
      $push: { "currentRun.cards": card },
      $set: { "currentRun.total": runTotal, "currentRun.scoringEvents": newScoringEvents },
    });

    HandsCollection.update( hand._id, {
      $set: { handLength: newHandLength },
    });

  }
});