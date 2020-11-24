import { Meteor } from 'meteor/meteor';
import { HandsCollection } from '/imports/db/HandsCollection';


const publicFields = {

}

Meteor.publish('hands', function publishInvites() {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }

    const selector = {
        // $or: [{ "sender._id": this.userId }, { "receiver._id": this.userId }]
      };
    
      const options = {
        fields: publicFields
      };
    
      return HandsCollection.find(selector, publicFields);


});
