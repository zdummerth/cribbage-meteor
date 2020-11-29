import React from 'react';

export const WaitingRoomUser = ({ user, sendInvite }) => {

    const handleClick = () => sendInvite(user._id);

    return (
        <li className='waiting-room-user'>
            <span>
                {user.username}
            </span>
            <button onClick={handleClick}>Send Invite</button>
        </li>
    )
}