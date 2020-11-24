import React from 'react';

export const WaitingRoomUser = ({ user, sendInvite }) => {

    const handleClick = () => {
        // console.log(user);
        sendInvite(user)
    }

    return (
        <li className='waiting-room-user'>

            <span>
                {user.username}
            </span>

            <button onClick={handleClick}>Send Invite</button>
        </li>
    )
}