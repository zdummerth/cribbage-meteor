import React, { useState } from 'react';
import { Invite } from './Invite';



export const Invites = ({ invites, userId }) => {
    const sent = invites
                    .filter(invite => invite.senderId === userId)
                    .map(invite => (
                        <Invite
                            key={invite._id}
                            invite={invite}
                            isSender={true}
                        />
                    ))
    const received = invites
                        .filter(invite => invite.receiverId === userId)
                        .map(invite => (
                            <Invite
                                key={invite._id}
                                invite={invite}
                                isSender={false}
                            />
                        ))




    const [ sentIsVisible, setSentIsVisibel ] = useState(false);
    const BtnText = sentIsVisible ? 'Show Received Invites' : 'Show Sent Invites'

    return (
        <div>
            <h3>Invites</h3>

            <button onClick={() => setSentIsVisibel(!sentIsVisible)}>{BtnText}</button>
                {sentIsVisible ?
                <>
                    <p>Sent</p>
                    <div>
                        {sent}
                    </div> 
                </>
                :
                <>
                    <p>Received</p>
                    <div>
                        {received}
                    </div>
                </>}
        </div>
    )
}