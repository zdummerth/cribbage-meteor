import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { InvitesCollection } from '/imports/api/invites/InvitesCollection';

import { ValidatedMethod } from 'meteor/mdg:validated-method';



export const createInvite = new ValidatedMethod({
  name: 'invites.create',
  validate(receiverId) {
    check(receiverId, String)
  },

  run(receiverId) {

    console.log('recieverId', receiverId)

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const receiverExists = Meteor.users.findOne(receiverId);

    if (!receiverExists) {
      throw new Meteor.Error('Invite recipient does not exist');
    }


    const newInvite = {
      createdAt: new Date(),
      senderId: this.userId,
      receiverId
    }

    InvitesCollection.insert(newInvite);
  }
});

export const removeInvite = new ValidatedMethod({
  name: 'invites.remove',
  validate(inviteId) {
    check(inviteId, String)
  },

  run(inviteId) {

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const invite = InvitesCollection.findOne({ _id: inviteId, $or: [{ senderId: this.userId }, { receiverId: this.userId} ] });

    if (!invite) {
      throw new Meteor.Error('Access denied.');
    }

    InvitesCollection.remove(inviteId);
  }
});

// export const acceptInvite = new ValidatedMethod({
//   name: 'invites.accept',
//   validate(inviteData) {
//     check(inviteData, {
//       inviteId: String,
//       oppId: String,
//       oppUsername: String
//     })
//   },

//   run({ inviteId, oppId, oppUsername }) {

//     if (!this.userId) {
//       throw new Meteor.Error('Not authorized.');
//     }

//     const invite = InvitesCollection.findOne({ _id: inviteId, 'receiver._id': this.userId, 'sender._id': oppId });

//     if (!invite) {
//       throw new Meteor.Error('Access denied.');
//     }

//     const username = Meteor.user({fields: {"username": 1}}).username;
//     const userData = {
//       _id: this.userId,
//       username: username
//     }
//     const oppData = {
//       _id: oppId,
//       username: oppUsername
//     }

//     createGame.call([ userData, oppData ])

//     InvitesCollection.remove(inviteId);
//   }
// });