import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { GamesCollection } from '/imports/db/GamesCollection';
import { InvitesCollection } from '/imports/db/InvitesCollection';

import { LoginForm } from './LoginForm';
import { WaitingRoom } from './WaitingRoom';
import { Invites } from './Invites';
import { GamesListing } from './GamesListing';
import { CurrentGame } from './CurrentGame';


import { removeGame } from '../api/games/Methods'
import { createInvite } from '../api/invites/Methods'
// import { createHand } from '../api/invites/Methods'



import Card from '/imports/ui/Card';









const sendInvite = receiverId => createInvite.call(receiverId);
const deleteGame = ({ _id }) => removeGame.call(_id);



export const App = () => {


  const user = useTracker(() => {
    const noDataAvailable = { username: '', _id: '', inWaitingRoom: false };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('user');
    const usersHandler = Meteor.subscribe('users');
    

    if (!(handler.ready() && usersHandler.ready())) {
      return noDataAvailable;
    }
    return Meteor.user()
  });

  const { username, _id, inWaitingRoom } = user


  const setInWaitingRoom = () => {
    console.log({ username, _id, inWaitingRoom });
    return Meteor.call('users.setInWaitingRoom')
  };

  




  const { invites, isLoading } = useTracker(() => {
    const noDataAvailable = { invites: [] };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('invites');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }


    const invites = InvitesCollection.find({}).fetch();


    return { invites };
  });

  const { games } = useTracker(() => {
    const noDataAvailable = {
      games: [
        { _id: '', players: ['', ''], completed: false}
      ]
    }
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('games');

    if (!handler.ready()) {
      return noDataAvailable;
    }


    const games = GamesCollection.find({}).fetch();


    return { games };
  });



  const [ waitingRoomOpen, setwaitingRoomOpen ] = useState(false);
  const toggleWaitingRoom = () => setwaitingRoomOpen(!waitingRoomOpen);
  const waitingRoomBtnText = waitingRoomOpen ? 'Close Waiting Room' : 'View Waiting Room';


  const logout = () => Meteor.logout();

  const [ currentGame, setCurrentGame ] = useState(null);

  const playGame = ({ game } ) => {
    // console.log({game})
    setCurrentGame(game)
  }
  const closeGame = () => setCurrentGame(null)




  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>
              Mother Fucking Cribbage
            </h1>
          </div>
        </div>
      </header>

      <div className="main">
        {Meteor.user() ? (
          <>
            <div className="user" onClick={logout}>
              {Meteor.user().username} 🚪
            </div>


            <button onClick={() => console.log(user)}>user</button>
            { currentGame ? (
              <CurrentGame 
                game={currentGame}
                closeGame={closeGame}
               />
            ) : (
              <>
                <GamesListing
                  games={games}
                  onDeleteClick={deleteGame}
                  playGame={playGame}
                />

                <Invites
                  invites={invites}
                  userId={_id}
                />

                <button className='create-game-btn' onClick={toggleWaitingRoom}>{waitingRoomBtnText}</button>

                {waitingRoomOpen && 
                  <WaitingRoom
                    setInWaitingRoom={setInWaitingRoom}
                    inWaitingRoom={inWaitingRoom}
                    sendInvite={sendInvite}
                  /> 
                }
              </>
            )}
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};