import React from 'react';
import { Meteor } from 'meteor/meteor';

import styled from 'styled-components'

// import { createInvite } from '../api/invites/Methods'


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

    const deleteInvite = () => Meteor.call('invites.remove', invite._id);
    const acceptInvite = () => Meteor.call('invites.accept', inviteDetails);

    const inviteDetails = {
        inviteId: invite._id,
        oppId: invite.sender._id,
        oppUsername: invite.sender.username
    }



    return (
        <StyledInvite>
            {isSender ? 
                <>
                    <div>{`To: ${invite.receiver.username}`}</div>
                    <button onClick={deleteInvite}>Delete</button>
                </>
                : 
                <>
                    <div>{`From: ${invite.sender.username}`}</div>
                    <div>
                        <button id='accept' onClick={acceptInvite}>Accept</button>
                        <button id='delete' onClick={deleteInvite}>Delete</button>
                    </div>
                </>
            }
        </StyledInvite>
    )
}