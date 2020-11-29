import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { WaitingRoomUser } from './WaitingRoomUser';



export const WaitingRoom = ({ setInWaitingRoom, inWaitingRoom, sendInvite }) => {
    const { usersInWaitingRoom, isLoading } = useTracker(() => {
        const noDataAvailable = { usersInWaitingRoom: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('users.inWaitingRoom');
    
        if (!handler.ready()) {
          return { ...noDataAvailable, isLoading: true };
        }

        const selector = {
            inWaitingRoom: true,
            _id: { $ne: Meteor.user()._id }
          };
    
        const usersInWaitingRoom = Meteor.users.find(selector).fetch();
    
        return { usersInWaitingRoom };
    });

    const joinRoomBtnText = inWaitingRoom ? 'Leave Waiting Room' : 'Join Waiting Room';

    return (
        <>
            <div>

                <h3>Waiting Room</h3>
                <button className='create-game-btn' onClick={setInWaitingRoom}>{joinRoomBtnText}</button>

                <button className='create-game-btn' onClick={() => console.log({usersInWaitingRoom})}>console users</button>

                {isLoading && <div className="loading">loading...</div>}

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