import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

import { LoginForm } from './LoginForm';
import { WaitingRoom } from './WaitingRoom';
import { Invites } from './Invites';
import { GamesListing } from './GamesListing';
import { CurrentGameContainer } from './CurrentGameContainer';

import styled from 'styled-components';



import { removeGame } from '../api/games/Methods'
import { createInvite } from '../api/invites/Methods'


const User = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 0;

  background: linear-gradient(to right bottom, orange, white, orange, white 100%);
  
  #username {
    font-weight: bold;
    font-size: 30px;
  }
`




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
            <User>
              <div id='username'>{user.username}</div>
              <div onClick={logout}>Logout</div>
            </User>

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