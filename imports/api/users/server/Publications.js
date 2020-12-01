import { Meteor } from 'meteor/meteor';
import { InvitesCollection } from '/imports/db/InvitesCollection';


const userPublicFields = {
    inWaitingRoom: 1,
    username: 1,
    _id: 1
}

Meteor.publish('user', function publishUser() {

  const options = {
    fields: userPublicFields
  };
    
  return Meteor.users.find(this.userId, options);

});


Meteor.publish('users.inWaitingRoom', function publishUsersInWaitingRoom() {

  if (!this.userId) {
      return this.ready();
  }

  const selector = {
    inWaitingRoom: { $eq: true },
    _id: { $ne: this.userId }
  };
  
  const options = {
    fields: userPublicFields
  };


  return Meteor.users.find(selector, options);

});

Meteor.publish('users.withInvites', function publishUsers() {

  if (!this.userId) {
      return this.ready();
  }

  
  // Only return public fields
  const options = {
    fields: userPublicFields
  };

  const invites = InvitesCollection.find({}).fetch();

  const usersWithSentInvite = invites.map(invite => invite.senderId);
  const usersWithReceivedInvite = invites.map(invite => invite.receiverId);

  const usersWithInvite = [...usersWithReceivedInvite, ...usersWithSentInvite]




  // This removes duplicates
  const uniqueUsersWithInvite = [...new Set(usersWithInvite)];


  console.log('uniqueIds', uniqueUsersWithInvite)


  const selector = {
    _id: { $in: uniqueUsersWithInvite }
  };

  console.log('selector', selector)
  
  return Meteor.users.find(selector, options);

});