import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';


import styled from 'styled-components'

import { createGame } from '../api/games/Methods'


const StyledInvite = styled.div`
    display: flex;
    justify-content: space-between;

    #accept {
        background: green;
    }
    #delete {
        background: red;
    }
`


export const Invite = ({ invite, isSender }) => {
    const { sender, receiver } = useTracker(() => {
        const noDataAvailable = {
            sender: { username: '', _id: '', inWaitingRoom: false },
            receiver: { username: '', _id: '', inWaitingRoom: false },
        };
        if (!Meteor.user()) {
          return noDataAvailable;
        }
        const handler = Meteor.subscribe('users.withInvites');
    
        if (!handler.ready()) {
          return noDataAvailable;
        }

        

        const senderSelector = { _id: invite.senderId };

        const receiverSelector = { _id: invite.receiverId };

        const sender = Meteor.users.findOne(senderSelector);
        const receiver = Meteor.users.findOne(receiverSelector);
        return { sender, receiver }
      });

    const deleteInvite = () => Meteor.call('invites.remove', invite._id);
    const acceptInvite = () => createGame.call(gameDetails);

    const gameDetails = {
        inviteId: invite._id,
        otherId: invite.senderId
    }


    return (
        <StyledInvite>
            {isSender ? 
                <>
                    <div>{`To: ${receiver.username}`}</div>
                    <button onClick={deleteInvite}>Delete</button>
                </>
                : 
                <>
                    <div>{`From: ${sender.username}`}</div>
                    <div>
                        <button id='accept' onClick={acceptInvite}>Accept</button>
                        <button id='delete' onClick={deleteInvite}>Delete</button>
                    </div>
                </>
            }
        </StyledInvite>
    )
}