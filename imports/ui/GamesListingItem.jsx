import React from 'react';
import { Meteor } from 'meteor/meteor';

export const GamesListingItem = ({ game, onDeleteClick, playGame }) => {
    
    const selector = { _id: { $in: game.players } };

    const players = Meteor.users.find(selector, {fields: {'username': 1}}).fetch();

    const usernames = players.map(p => <p key={p._id}>{p.username}</p>);

    return (
        <li className='game'>
            <span>
                {usernames}
            </span>
            <button onClick={() => playGame({ game })}>
                 Play Game
            </button>

            <button onClick={() => onDeleteClick(game)}>Delete Game</button>
        </li>
    )
}