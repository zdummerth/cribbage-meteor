import { Meteor } from 'meteor/meteor';

// Meteor.publish('waitingRoomUsers', function publishWaitingRoomUSers() {

//     //If no user, return ready with no data
//     if (!this.userId) {
//         return this.ready();
//     }

//     return Meteor.users.find({});
// });

const userPublicFields = {
    inWaitingRoom: 1,
    username: 1,
    _id: 1
}

Meteor.publish('Meteor.users.inWaitingRoom', function publishInWaitingRoomField() {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }

    const selector = {
        _id: { $eq: this.userId }
      };
    
      // Only return one field, `inWaitingRoom`
      const options = {
        fields: { inWaitingRoom: 1 }
      };
    
      return Meteor.users.find(selector, options);

});


Meteor.publish('waitingRoomUsers', function publishWaitingRoomUsers() {

    //If no user, return ready with no data
    if (!this.userId) {
        return this.ready();
    }

    const selector = {
        inWaitingRoom: { $eq: true }
      };
    
      // Only return public fields
      const options = {
        fields: userPublicFields
      };
    
      return Meteor.users.find(selector, options);

});