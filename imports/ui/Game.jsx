import React from 'react';

export const Game = ({ game, onCheckboxClick, onDeleteClick }) => {
    return (
        <li className='task'>
            <input
                type="checkbox"
                checked={!!game.isChecked}
                onClick={() => onCheckboxClick(game)}
                readOnly
            />
            <span>
                {game.createdBy}
            </span>
            <button onClick={() => onDeleteClick(game)}>&times;</button>
        </li>
    )
}