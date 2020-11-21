
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { GamesCollection } from '/imports/db/GamesCollection';
import '/imports/api/gamesMethods';
import '/imports/api/gamesPublications';



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


  const user = Accounts.findUserByUsername(players[0].name);

  if (GamesCollection.find().count() === 0) {
    GamesCollection.insert({
      playerOneId: user._id,
      createdAt: new Date(),
    });
  }


});
