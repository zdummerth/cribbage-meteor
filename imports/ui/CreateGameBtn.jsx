import { Meteor } from 'meteor/meteor';
import React from 'react';

export const CreateGameBtn = () => {

  const handleClick = () => {
    //Create Something to limit how many games can be created per second
    Meteor.call('games.insert', (err, res) => console.log({res, err}));
  };

  return (
      <button className='create-game-btn' onClick={handleClick}>Create New Game</button>
  );
};