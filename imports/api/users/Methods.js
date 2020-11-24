import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';


Meteor.methods({
  'users.setInWaitingRoom'() {
    // check(inWaitingRoom, Boolean)

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const inWaitingRoom = !Meteor.user().inWaitingRoom
    console.log('user: ', Meteor.user())

    console.log('in waiting room', inWaitingRoom)


    Meteor.users.update(this.userId, {
        $set : {
            inWaitingRoom
        }
    })

  },

});