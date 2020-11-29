import React from 'react';

export default function Card({ id }) {

    return (
        <div>
            <img style={{width: '70px', height: '107px'}} src={`/cardImages/${id}.jpg`} alt={'two'}/>
        </div>
    )
}
