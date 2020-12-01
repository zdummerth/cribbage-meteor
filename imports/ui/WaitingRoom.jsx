import React from 'react';
import { WaitingRoomUser } from './WaitingRoomUser';



export const WaitingRoom = ({ setInWaitingRoom, inWaitingRoom, sendInvite, usersInWaitingRoom }) => {

    const joinRoomBtnText = inWaitingRoom ? 'Leave Waiting Room' : 'Join Waiting Room';

    return (
        <>
            <div>
                <h3>Waiting Room</h3>
                <button className='create-game-btn' onClick={setInWaitingRoom}>{joinRoomBtnText}</button>

                <button className='create-game-btn' onClick={() => console.log({usersInWaitingRoom})}>console users</button>

                <ul className="">
                    {usersInWaitingRoom.map(user => (
                        <WaitingRoomUser
                            key={user._id}
                            user={user}
                            sendInvite={sendInvite}
                        />
                    ))}
                </ul>
            </div>
        </>
    )
}