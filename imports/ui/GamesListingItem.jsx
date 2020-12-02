import React from 'react';
import { Meteor } from 'meteor/meteor';

import styled from 'styled-components';

const PlayButton = styled.button`
    background: linear-gradient(to right bottom, white, green, green, white 100%);
`

const DeleteButton = styled.button`
    background: linear-gradient(to right bottom, white, red, red, white 100%);
`

export const GamesListingItem = ({ game, onDeleteClick, playGame }) => {
    
    const selector = { _id: { $in: game.players } };

    const players = Meteor.users.find(selector, {fields: {'username': 1}}).fetch();

    const usernames = players.map(p => <p key={p._id}>{p.username}</p>);

    return (
        <li className='game'>
            <span>
                {usernames}
            </span>
            <PlayButton onClick={() => playGame({ game })}>
                 Play Game
            </PlayButton>

            <DeleteButton onClick={() => onDeleteClick(game)}>Delete Game</DeleteButton>
        </li>
    )
}