import { Meteor } from 'meteor/meteor';
import { InvitesCollection } from '/imports/db/InvitesCollection';


const publicFields = {
    receiver: { _id: 1, username: 1},
    sender: { _id: 1, username: 1},
}

Meteor.publish('invites', function publishInvites() {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }

    const selector = {
        $or: [{ "sender._id": this.userId }, { "receiver._id": this.userId }]
      };
    
      const options = {
        fields: publicFields
      };
    
      return InvitesCollection.find(selector, publicFields);


});
