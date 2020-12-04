import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { GamesCollection } from '/imports/api/games/GamesCollection';
import { InvitesCollection } from '/imports/api/invites/InvitesCollection';


import { App } from '/imports/ui/App';
import { LoginForm } from '/imports/ui/LoginForm';

const setInWaitingRoom = () => Meteor.call('users.setInWaitingRoom');


export const AppContainer = () => {

    const { userExists, user, loading, usersInWaitingRoom, invites, games } = useTracker(() => {

        const userHandler = Meteor.subscribe('user');
        const usersHandler = Meteor.subscribe('users.inWaitingRoom');
        const invitesHandler = Meteor.subscribe('invites');
        const gamesHandler = Meteor.subscribe('games');


        const loading = !(
            userHandler.ready() && 
            usersHandler.ready() && 
            invitesHandler.ready() &&
            gamesHandler.ready()
        );

        const user = Meteor.user()
        const userExists = !loading && !!user;

        const usersInWaitingRoom = Meteor.users.find({ _id: { $ne: Meteor.userId() } } ).fetch();

        const invites = InvitesCollection.find({}).fetch();

        const games = GamesCollection.find({}).fetch();
        

        return { userExists, user, loading, usersInWaitingRoom, invites, games }
  });

     
    return (
        <>
            { loading ? <div>Loading...</div> : userExists ? (
                <App 
                    user={user}
                    usersInWaitingRoom={usersInWaitingRoom}
                    invites={invites}
                    games={games}
                    setInWaitingRoom={setInWaitingRoom}
                />
            ) : (
                <LoginForm />
            )}
        </>
    )
}