import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Game } from './Game';




export const Games = ({ games, onDeleteClick }) => {
    const inProgress = games
                    .filter(game => game.completed === false)
                    .map(game => (
                        <Game
                            key={game._id}
                            game={game}
                            onDeleteClick={onDeleteClick}
                        />
                    ))
    const completed = games
                        .filter(game => game.completed === true)
                        .map(game => (
                            <Game
                                key={game._id}
                                game={game}
                                onDeleteClick={onDeleteClick}
                            />
                        ))




    const [ gamesInProgressIsVisible, setGamesInProgressIsVisible ] = useState(true);
    const BtnText = gamesInProgressIsVisible ? 'Show Completed Games' : 'Show Games In Progress'

    return (
        <>
            <div>

                <h3>Games</h3>

                <button onClick={() => setGamesInProgressIsVisible(!gamesInProgressIsVisible)}>{BtnText}</button>

                {
                    gamesInProgressIsVisible ?
                    <>
                        <p>In Progress</p>
                        <div>
                            {inProgress}
                        </div> 
                    </>
                    :
                    <>
                        <p>Completed</p>
                        <div>
                            {completed}
                        </div>
                    </>
                }
            </div>
        </>
    )
}