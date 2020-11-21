import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { GamesCollection } from '/imports/db/GamesCollection';
import { Game } from './Game';
import { LoginForm } from './LoginForm';
import { CreateGameBtn } from './CreateGameBtn';


const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call('games.setIsChecked', _id, !isChecked);

const deleteGame = ({ _id }) => Meteor.call('games.remove', _id);

export const App = () => {
  const user = useTracker(() => Meteor.user());

  const { games, isLoading } = useTracker(() => {
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



  const [ inWaitingRoom, setInWaitingRoom ] = useState(false);

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
        {user ? (
          <>
            <div className="user" onClick={logout}>
              {user.username} 🚪
            </div>

            <CreateGameBtn />


            {isLoading && <div className="loading">loading...</div>}



            <ul className="tasks">
              {games.map(game => (
                <Game
                  key={game._id}
                  game={game}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteGame}
                />
              ))}
            </ul>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};