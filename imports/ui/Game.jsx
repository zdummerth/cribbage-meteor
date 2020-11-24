import React from 'react';

export const Game = ({ game, onDeleteClick }) => {
    const { players }  = game

    const playerTitle = players.length === 2 ? 
                        `${players[0].username} vs ${players[1].username}` 
                        : 
                        'No players'

    // const playerTitle = game.players ? game.players[0] : 'no players'
    // const { username } = Meteor.user({fields: {'username': 1}});

    

    return (
        <li className='game'>
            <span>
                {playerTitle}
            </span>
            <button onClick={() => onDeleteClick(game)}>Delete Game</button>
        </li>
    )
}