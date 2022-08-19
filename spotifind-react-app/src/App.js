// React
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';
import { SetMode } from './Reducers/DarkModeReducer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';


// Components
import HomePage from './Pages/HomePage/HomePage';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

// Material-UI
import './App.css';

// Firebase
import { firestore, firebaseAuth } from './firebase';
import { AddUser } from './Reducers/UsersReducer';
import { 
  AddGroup, 
  AddUserToGroup, 
  AddMessageToGroup, 
  RemoveGroup, 
  RemoveUserFromGroup, 
  UpdateGroup 
} from './Reducers/GroupsReducer';
import { RemoveOutgoingInvite, SetOutgoingInvite, UpdateOutgoingInviteStatus } from './Reducers/OutgoingInvites';
import { RemoveIncomingInvite, SetIncomingInvite, UpdateIncomingInviteStatus } from './Reducers/IncomingInvites';
import { AddFriend, RemoveFriend } from './Reducers/FriendsReducer';
import { AddAdmin, RemoveAdmin } from './Reducers/AdminsReducer';

// Pages
import UserLoginPage from './Pages/LoginPage/UserLoginPage';
import UserConsole from './Pages/UserConsole/UserConsole';
import Group from './Pages/Group/Group'
import Wrapper from './Components/Wrapper/Wrapper';
import GroupSettings from './Pages/GroupSettingsPage/GroupSettingsPage';
import AdminConsole from './Pages/AdminConsole/AdminConsole';
import UserSettings from './Pages/UserSettingsPage/UserSettingsPage';
import UserProfile from './Pages/UserProfilePage/UserProfilePage';
import TutorialPage from './Pages/TutorialPage/TutorialPage';





function App() {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState();
  const [authDetails, setAuthDetails] = useState({
    authenticated: false,
    isAdmin: false,
    loading: true,
  })
  let listeners = [];


  useEffect(() => {

    /* -=-=-=-=-=- In charge of detecting changes in user/auth and acting accordingly -=-=-=-=-=- */
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        console.log(user.email, "just logged in");
        setAuthDetails({ 
          authenticated: true, 
          loading: false 
        });


      } else {
        console.log("No user signed in");

        // Detach all the firestore listeners or else we get duplicate data
        listeners.forEach(listener => listener());
        listeners = [];

        setAuthDetails({
          authenticated: false,
          loading: false
        });
      }


      setCurrentUser(user);
    });

    if (authDetails.authenticated) {

      // Check Dark Mode
      firestore.collection('users').doc(firebaseAuth.currentUser.uid).get()
      .then(snapshot => dispatch(SetMode(snapshot.data().darkMode)))
      .catch(err => alert("Error in dark mode"))

      /* -=-=-=-=-=- In charge of loading and altering data in Redux based on changes to FRIENDS COLLECTION -=-=-=-=-=- */
      listeners.push(
        firestore.collection('friends').where('friend1', '==', firebaseAuth.currentUser.uid).onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {

            switch (change.type) {
              case 'added':
                dispatch(AddFriend({ relationshipID: change.doc.id, friendID: change.doc.data().friend2 }))
                break;
                
              case 'removed':
                dispatch(RemoveFriend(change.doc.data().friend2));
                break;
            
              default:
                break;
            }
          })
        })
      )

      /* -=-=-=-=-=- In charge of loading and altering data in Redux based on changes to ADMINSS COLLECTION -=-=-=-=-=- */
      listeners.push(
        firestore.collection('admins').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {

            switch (change.type) {
              case 'added':
                dispatch(AddAdmin({  user: change.doc.id , userID: change.doc.data().user}))
                break;
                
              case 'removed':
                dispatch(RemoveAdmin(change.doc.id));
                break;
            
              default:
                break;
            }
          })
        })
      )


      
      /* -=-=-=-=-=- In charge of loading and altering data in Redux based on changes to USERS COLLECTION -=-=-=-=-=- */
      listeners.push(
        firestore.collection('users').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            
            switch (change.type) {
              case 'added':

                const user = {
                  id: change.doc.id,
                  ...change.doc.data(),
                }
                dispatch(AddUser({ id: change.doc.id, user }));
                break;

              case 'modified':

                const modifiedUser = {
                  id: change.doc.id,
                  ...change.doc.data()
                }
                dispatch(AddUser({ id: change.doc.id, user: modifiedUser }))
                break;

              default:
                break;
            }
          })
        })
      )
      
      /* -=-=-=-=-=- In charge of loading and altering data in Redux based on changes to GROUP-INVITES COLLECTION (Outgoing) -=-=-=-=-=- */
      listeners.push(
        firestore.collection('group-invitations').where('inviter', '==', firebaseAuth.currentUser.uid).onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            
            switch (change.type) {
              case 'added':

                dispatch(SetOutgoingInvite({
                  docID: change.doc.id,
                  ...change.doc.data(),
                }));

                break;
              case 'modified':

                dispatch(UpdateOutgoingInviteStatus({
                  docID: change.doc.id,
                  ...change.doc.data(),
                }));
                break;

              case 'removed':
                dispatch(RemoveOutgoingInvite(change.doc.data()));
                break;
              default:
                break;
            }
          })
        })
      )

      /* -=-=-=-=-=- In charge of loading and altering data in Redux based on changes to GROUP-INVITES COLLECTION (Incoming) -=-=-=-=-=- */
      listeners.push(
        firestore.collection('group-invitations').where('invited', '==', firebaseAuth.currentUser.uid).onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            
            switch (change.type) {
              case 'added':

                dispatch(SetIncomingInvite({
                  docID: change.doc.id,
                  ...change.doc.data(),
                }));

                break;

              case 'modified':

                dispatch(UpdateIncomingInviteStatus({
                  docID: change.doc.id,
                  ...change.doc.data(),
                }));
                break;
                
              case 'removed':
                dispatch(RemoveIncomingInvite(change.doc.data()));
                break;
              default:
                break;
            }
          })
        })
      )

      /* -=-=-=-=-=- In charge of loading and altering data in Redux based on changes to GROUPS COLLECTION -=-=-=-=-=- */
      listeners.push(
        firestore.collection('groups').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(async change => {

            switch (change.type) {
              case 'added':
                
                // Generates Group object for Redux
                const group = {
                  id: change.doc.id,
                  ...change.doc.data(),
                  users: [],
                  messages: [],
                }

                // Add group to Redux store
                dispatch(AddGroup({ id: change.doc.id, group }));

                // Listener for USERS subcollection
                listeners.push(
                  firestore.collection('groups').doc(change.doc.id).collection('users').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {

                      switch (change.type) {
                        case 'added':

                          // Add user to group
                          dispatch(AddUserToGroup({ 
                            groupID: group.id, 
                            userID: change.doc.data().id,
                            docID: change.doc.id,
                          }));

                          break;
                        case 'removed':
                          dispatch(RemoveUserFromGroup({
                            userID: change.doc.data().id,
                            groupID: group.id, 
                          }))
                      
                        default:
                          break;
                      }
                    })
                  })
                )
                

                // Listener for MESSAGES subcollection
                listeners.push(
                  firestore.collection('groups').doc(change.doc.id).collection('messages').onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {

                      switch (change.type) {
                        case 'added':

                          // Add user to group
                          dispatch(AddMessageToGroup({ 
                            groupID: group.id, 
                            message: { messageID: change.doc.id, ...change.doc.data() }
                          }));

                          break;
                      
                        default:
                          break;
                      }
                    })
                  })
                )
                
                break;
              
              case 'modified':
                dispatch(UpdateGroup({ groupID: change.doc.id, group: change.doc.data() }))
                break;
              case 'removed':
                dispatch(RemoveGroup(change.doc.id));
                break;
              default:
                break;
            }
          })
        })
      )
      


      
    }
    



  }, [authDetails.authenticated]);


  //const admins = useSelector(state => state.admins);

  

  return (
    <Router>
      <Wrapper user={ currentUser } auth={ authDetails }>
        <Switch>
          <Route exact path='/' component={ UserLoginPage } />
          <Route exact path='/home' component={ HomePage } />
          <PrivateRoute exact path='/console/admin' authenticated={ authDetails.authenticated } component={ AdminConsole } />
          <PrivateRoute exact path='/console' authenticated={ authDetails.authenticated } component={ UserConsole } />
          <PrivateRoute exact path='/console/settings' authenticated={ authDetails.authenticated } component={ UserSettings } />
          <PrivateRoute exact path='/console/:group' authenticated={ authDetails.authenticated } component={ Group } />
          <PrivateRoute exact path='/console/:group/settings' authenticated={ authDetails.authenticated } component={ GroupSettings } />
          <PrivateRoute exact path='/profiles/:userID' authenticated={ authDetails.authenticated } component={ UserProfile } />
          <PrivateRoute exact path='/tutorial' authenticated={ authDetails.authenticated } component={ TutorialPage } />
        </Switch>
      </Wrapper>
    </Router>
  );
}

export default App;
