import React from 'react';
import { GamesListingItem } from './GamesListingItem';




export const GamesListing = ({ games, onDeleteClick, playGame }) => {
    const allGames = games.map(game => (
        <GamesListingItem
            key={game._id}
            game={game}
            onDeleteClick={onDeleteClick}
            playGame={playGame}
        />
    ))

    return (
        <>
            <div>
                <h3>All Games</h3>
                <div>
                    {allGames}
                </div> 
            </div>
        </>
    )
}