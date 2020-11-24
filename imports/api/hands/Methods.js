import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { InvitesCollection } from '/imports/db/InvitesCollection';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { createGame } from '../games/Methods'



export const createHand = new ValidatedMethod({
  name: 'hands.create',
  validate(receiver) {
    check(receiver, {
      _id: String,
      username: String
    })
  },

  run(receiver) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const receiverExists = Meteor.users.findOne({ _id: receiver._id, username: receiver.username});

    if (!receiverExists) {
      throw new Meteor.Error('Invite recipient does not exist');
    }

    const senderName = Meteor.user({fields: {"username": 1}}).username;

    const senderData = {
      _id: this.userId,
      username: senderName
    }

    const newInvite = {
      createdAt: new Date(),
      sender: senderData,
      receiver
    }

    InvitesCollection.insert(newInvite);
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

    const invite = InvitesCollection.findOne({ _id: inviteId, $or: [{'sender._id': this.userId}, {'receiver._id': this.userId}] });

    if (!invite) {
      throw new Meteor.Error('Access denied.');
    }

    InvitesCollection.remove(inviteId);
  }
});

export const acceptInvite = new ValidatedMethod({
  name: 'invites.accept',
  validate(inviteData) {
    check(inviteData, {
      inviteId: String,
      oppId: String,
      oppUsername: String
    })
  },

  run({ inviteId, oppId, oppUsername }) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const invite = InvitesCollection.findOne({ _id: inviteId, 'receiver._id': this.userId, 'sender._id': oppId, 'sender.username': oppUsername });

    if (!invite) {
      throw new Meteor.Error('Access denied.');
    }

    const username = Meteor.user({fields: {"username": 1}}).username;
    const userData = {
      _id: this.userId,
      username: username
    }
    const oppData = {
      _id: oppId,
      username: oppUsername
    }

    createGame.call([ userData, oppData ])

    InvitesCollection.remove(inviteId);
  }
});