import { Meteor } from 'meteor/meteor';
import { InvitesCollection } from '/imports/db/InvitesCollection';


const publicFields = {
    receiverId: 1,
    senderId: 1,
}

Meteor.publish('invites', function publishInvites() {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }

    const selector = {
        $or: [{ senderId: this.userId }, { receiverId: this.userId }]
      };
    
      const options = {
        fields: publicFields
      };
    
      return InvitesCollection.find(selector, publicFields);


});
