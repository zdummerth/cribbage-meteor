import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { GamesCollection } from '/imports/api/games/GamesCollection';
import { RunsCollection } from '/imports/api/runs/RunsCollection';

import { HandsCollection } from '/imports/db/HandsCollection';
import { ScoresCollection } from '/imports/db/ScoresCollection';


import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createHand, setIsGo } from '../hands/Methods'
import { createScores } from '../scores/Methods'

import { deal, getRunPoints, isCardOver31, checkIsGo } from '../cardFunctions.js'




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


    HandsCollection.insert({
      createdAt: timestamp,
      dealt: userHand,
      discarded: [],
      completed: false,
      userId: this.userId,
      runId,
      handLength: 6,
      isGo: false
    });

    HandsCollection.insert({
      createdAt: timestamp,
      dealt: oppHand,
      discarded: [],
      completed: false,
      userId: opponentId,
      runId,
      handLength: 6,
      isGo: false
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

    const game = GamesCollection.findOne({ currentRunId: runId, players: { $elemMatch: { $eq: this.userId } } } );

    if (!game) {
      throw new Meteor.Error('could not find game');
    }

    const hand = HandsCollection.findOne({ runId: runId, userId: this.userId } );

    if (!hand) {
      throw new Meteor.Error('could not find hand');
    }

    const run = RunsCollection.findOne({ _id: runId } );

    if (!run) {
      throw new Meteor.Error('could not find run');
    }

    const scoreDoc = ScoresCollection.findOne({ userId: this.userId, gameId: game._id } );

    if (!scoreDoc) {
      throw new Meteor.Error('could not find your score');
    }


    const { currentRun, pastRuns } = run;
    const { discarded, dealt } = hand;

    console.log({currentRun})


    const allPastRunCards = [];
    pastRuns.forEach(run => allPastRunCards.push(run.cards));



    // pastRunCards is an array of arrays so must be flattened
    const cardInRun = card => currentRun.cards.includes(card) || allPastRunCards.flat().includes(card);
    const cardInHand = card => dealt.includes(card);
    const cardInDiscard = card => discarded.includes(card);

    const validCards = dealt.filter(card => (!cardInRun(card) && !cardInDiscard(card) && cardInHand(card)));

    const isOver31 = isCardOver31({ card , run: currentRun.cards });

    if(isOver31) {
      throw new Meteor.Error('you played a card over 31');
    }

    if(!validCards.includes(card)) {
      throw new Meteor.Error('you must play a valid card');
    }


    const newRun = [...run.currentRun.cards, card];

    const { scoringEvents, runTotal } = getRunPoints(newRun);
    const newPoints = scoringEvents.reduce((acc, cv) => acc + cv.points, 0);

    ScoresCollection.update( { _id: scoreDoc._id, userId: this.userId }, {
      $inc: { score: newPoints },
    });

    const allScoringEvents = [ ...run.currentRun.scoringEvents, ...scoringEvents];
    
    
    RunsCollection.update( runId, {
      $push: { "currentRun.cards": card },
      $set: { "currentRun.total": runTotal, "currentRun.scoringEvents": allScoringEvents },
    });

    const newHand = validCards.filter(c => c !== card );
    const newHandLength = newHand.length;

    let isPlayerGo = false;
    if(newHandLength > 0) {
      isPlayerGo = checkIsGo({cards: newHand, run: newRun});
    } else {
      isPlayerGo === true
    }

    const oppId = game.players.find(p => p !== this.userId)

    const isOppGo = run.oppHand(oppId).isGo;


    const isRunOver = isPlayerGo && isOppGo;

    if(isRunOver) {

    }


    const isTurn = game.turnId === this.userId;

    const nextTurnId = isTurn && !isOppGo ? oppId
     : isRunOver ? 'runOver' : this.userId;


    console.log({isRunOver})
  
    // console.log({isPlayerGo});


    HandsCollection.update( hand._id, {
      $set: { handLength: newHandLength, isGo: isPlayerGo },
    });

    GamesCollection.update( game._id, {
      $set: { turnId: nextTurnId },
    });

  }
});