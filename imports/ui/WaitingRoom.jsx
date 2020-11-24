import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { WaitingRoomUser } from './WaitingRoomUser';



export const WaitingRoom = ({ setInWaitingRoom, inWaitingRoom, sendInvite }) => {
    const { waitingRoomUsers, isLoading } = useTracker(() => {
        const noDataAvailable = { waitingRoomUsers: [] };

        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('waitingRoomUsers');
    
        if (!handler.ready()) {
          return { ...noDataAvailable, isLoading: true };
        }
    
        const waitingRoomUsers = Meteor.users.find({inWaitingRoom: true}).fetch();
    
        return { waitingRoomUsers };
    });

    console.log({waitingRoomUsers})

    const joinRoomBtnText = inWaitingRoom ? 'Leave Waiting Room' : 'Join Waiting Room';

    return (
        <>
            <div>
                {isLoading && <div className="loading">loading...</div>}


                <h3>Waiting Room</h3>
                <button className='create-game-btn' onClick={setInWaitingRoom}>{joinRoomBtnText}</button>

                <button className='create-game-btn' onClick={() => console.log({waitingRoomUsers})}>console users</button>


                <ul className="">
                    {waitingRoomUsers.map(user => (
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