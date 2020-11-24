import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { GamesCollection } from '/imports/db/GamesCollection';
import { InvitesCollection } from '/imports/db/InvitesCollection';

import { LoginForm } from './LoginForm';
import { WaitingRoom } from './WaitingRoom';
import { Invites } from './Invites';
import { Games } from './Games';

import { removeGame } from '../api/games/Methods'
import { createInvite } from '../api/invites/Methods'








const sendInvite = ({ _id, username }) => createInvite.call({ _id, username });
const deleteGame = ({ _id }) => removeGame.call(_id);



export const App = () => {
  const { username, _id, inWaitingRoom } = useTracker(() => {
    if (!Meteor.user()) {
      return {};
    }
    const handler = Meteor.subscribe('Meteor.users.inWaitingRoom');

    if (!handler.ready()) {
      return {};
    }
    return Meteor.user()
  })


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
    const noDataAvailable = { games: [] };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('games');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }


    const games = GamesCollection.find({}).fetch();


    return { games };
  });







  const [ waitingRoomOpen, setwaitingRoomOpen ] = useState(false);
  const toggleWaitingRoom = () => setwaitingRoomOpen(!waitingRoomOpen);
  const waitingRoomBtnText = waitingRoomOpen ? 'Close Waiting Room' : 'View Waiting Room';


  const logout = () => Meteor.logout();

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


            <Games
              games={games}
              onDeleteClick={deleteGame}
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

            {isLoading && <div className="loading">loading waiting room...</div>}


          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};