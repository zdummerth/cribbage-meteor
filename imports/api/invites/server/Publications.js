import { Meteor } from 'meteor/meteor';
import { InvitesCollection } from '/imports/api/invites/InvitesCollection';


Meteor.publish('invites', function publishInvites() {

  if (!this.userId) {
      return this.ready();
  }

  const selector = {
      $or: [{ senderId: this.userId }, { receiverId: this.userId }]
    };
  
  const publicFields = {
    receiverId: 1,
    senderId: 1,
  }

  return InvitesCollection.find(selector, { fields: publicFields } );

});
