
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { GamesCollection } from '/imports/db/GamesCollection';

import '/imports/api/games/Methods';
import '/imports/api/games/Publications';
import '/imports/api/users/Methods';
import '/imports/api/users/Publications';
import '/imports/api/invites/Methods';
import '/imports/api/invites/Publications';



const players = [
  {
    name: 'p1',
    pass: 'p1'
  },
  {
    name: 'p2',
    pass: 'p2'
  }
]
Meteor.startup(() => {
  players.forEach(p => {
    if (!Accounts.findUserByUsername(p.name)) {
      Accounts.createUser({
        username: p.name,
        password: p.pass,
      });
    }
  })


  // const user = Accounts.findUserByUsername(players[0].name);

  if (GamesCollection.find().count() === 0) {
    GamesCollection.insert({
      createdAt: new Date(),
      players: [],
    });
  }


});
