import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

import { LoginForm } from './LoginForm';
import { WaitingRoom } from './WaitingRoom';
import { Invites } from './Invites';
import { GamesListing } from './GamesListing';
import { CurrentGameContainer } from './CurrentGameContainer';


import { removeGame } from '../api/games/Methods'
import { createInvite } from '../api/invites/Methods'


const sendInvite = receiverId => createInvite.call(receiverId);
const deleteGame = ({ _id }) => removeGame.call(_id);


export const App = ({ user, usersInWaitingRoom, invites, games }) => {

  
  const setInWaitingRoom = () => Meteor.call('users.setInWaitingRoom');



  const [ waitingRoomOpen, setwaitingRoomOpen ] = useState(false);
  const toggleWaitingRoom = () => setwaitingRoomOpen(!waitingRoomOpen);
  const waitingRoomBtnText = waitingRoomOpen ? 'Close Waiting Room' : 'View Waiting Room';


  const logout = () => Meteor.logout();

  const [ currentGame, setCurrentGame ] = useState(null);

  const playGame = ({ game } ) => setCurrentGame(game)
  const closeGame = () => setCurrentGame(null)




  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>
              Cribbage
            </h1>
          </div>
        </div>
      </header>

      <div className="main">
        {user ? (
          <>
            <div className="user" onClick={logout}>
              {user.username} 🚪
            </div>


            <button onClick={() => console.log(user)}>user</button>
            { currentGame ? (
              <CurrentGameContainer 
                game={currentGame}
                closeGame={closeGame}
                user={user}
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
                  userId={user._id}
                />

                <button className='create-game-btn' onClick={toggleWaitingRoom}>{waitingRoomBtnText}</button>

                {waitingRoomOpen && 
                  <WaitingRoom
                    setInWaitingRoom={setInWaitingRoom}
                    inWaitingRoom={user.inWaitingRoom}
                    sendInvite={sendInvite}
                    usersInWaitingRoom={usersInWaitingRoom}
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