// React
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ToggleMode } from "../../Reducers/DarkModeReducer";



// Material UI
import {
   Box,
   TextField,
   IconButton,
   Button,
   Typography,
   Divider,
   Card,
   Tooltip,
   CardHeader,
   Slider,
   CardContent,
   CardActions,
   FormControlLabel,
   Switch,
   CircularProgress
} from '@mui/material';
import {
   Close, 
   Delete,
   Edit,
   Check,
} from '@mui/icons-material';


// Firebase
import { firebaseAuth, firestore, firebaseStorageRef } from '../../firebase';
import { UpdateUser } from '../../FirebaseFunctions/Users';
import { DeleteUser, getPosition } from '../../FirebaseFunctions/Auth';




const UserSettingsContainer = ({}) => {

   const history           = useHistory();
   const dispatch          = useDispatch();
   const groups            = useSelector(state => state.groups);
   const users             = useSelector(state => state.users);
   const dark              = useSelector(state => state.dark_mode);
   const friends           = useSelector(state => state.friends);
   const outgoingInvites   = useSelector(state => state.outgoingInvites);
   const incomingInvites   = useSelector(state => state.incomingInvites);

   const [deleting, setDeleting]                = useState(false);
   const [updating, setUpdating]                = useState(false);
   const [editing, setEditing]                  = useState(false);
   const [firstName, setFirstName]              = useState('');
   const [lastName, setLastName]                = useState('');
   const [bio, setBio]                          = useState('');
   const [ageRange, setAgeRange]                = useState(null);
   const [updatingAge, setUpdatingAge]          = useState(false);
   const [updatingMode, setUpdatingMode]        = useState(false);
   const [updatingAllowLocation, setUpdatingAllowLocation]  = useState(false);
   const [updatingHideLocation, setUpdatingHideLocation]    = useState(false);


   
   
   const reduxReady = () => {
      return Object.keys(groups).length > 0 && Object.keys(users).length > 0 && users[firebaseAuth.currentUser.uid]
   }

   const closeSettings = () => history.push(`/console`);
   const getName = () => users[firebaseAuth.currentUser.uid].first_name + ' ' + users[firebaseAuth.currentUser.uid].last_name;
   const user = () => users[firebaseAuth.currentUser.uid];
   
   const openEditor = () => {
      
      const usr = user();
      
      setEditing(true);
      setFirstName(usr.first_name);
      setLastName(usr.last_name);
      setBio(usr.bio);
   }

   const closeEditor = async () => {

      // If no changes made
      const usr = user();
      if (
         firstName === usr.first_name && 
         lastName === usr.last_name &&
         bio === usr.bio
         ) {
         setEditing(false);
         return;
      }

      setUpdating(true); 

      const { response, error } = await UpdateUser({
         ...usr,
         first_name: firstName,
         last_name: lastName,
         bio,
      })
      if (error) alert("Error:", error);

      setUpdating(false);
      setEditing(false);
   }

   const updateAgeRange = async () => {

      setUpdatingAge(true);
      const usr = user();
      const { response, error } = await UpdateUser({ ...usr, ageRange })
      if (error) alert("Error:", error);
      setUpdatingAge(false);
   }

   const toggleHasAgeRange = async (e) => {
      setUpdatingAge(true);
      const usr = user();
      const { response, error } = await UpdateUser({ ...usr, hasAgeRange: e.target.checked })
      if (error) alert("Error:", error);
      setUpdatingAge(false);
   }

   const toggleMode = async (e) => {
      setUpdatingMode(true);
      const usr = user();
      const { response, error } = await UpdateUser({ ...usr, darkMode: e.target.checked });
      error ? alert("Error: ", error) : dispatch(ToggleMode());
      setUpdatingMode(false);
   }

   const toggleAllowLocation = async (e) => {
      setUpdatingAllowLocation(true);
      const usr = user();


      if (!e.target.checked) {

         const { response, error } = await UpdateUser({ ...usr, allowLocation: false, coords: null });
         if (error) alert('Error:', error);

      } else {

         let coords = null;
         await getPosition()
         .then(res => coords = [res.coords.latitude, res.coords.longitude])
         .catch(err => console.log(err));

         const { response, error } = await UpdateUser({ ...usr, coords });
         if (error) alert('Error:', error);
      }
      
      setUpdatingAllowLocation(false);
   }

   const toggleHideLocation = async (e) => {
      setUpdatingHideLocation(true);
      const usr = user();
      const { response, error } = await UpdateUser({ ...usr, allowLocation: e.target.checked })
      if (error) alert('Error:', error);
      setUpdatingHideLocation(false);
   }

   const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

   const deleteUser = async () => {
      
      const usr = user();
      const ownedGroups = Object.values(groups).filter(group => group.owner === usr.id);

      let involvedGroupIDs = []
      Object.values(groups).forEach(({ id, users }) => {
         const user = users.find(({ userID }) => userID === usr.id);
         if (user) involvedGroupIDs.push(id);
      })
      const followingDocIDs = Object.values(friends);
      const outgoingInviteIDs = []
      const incomingInviteIDs = []

      console.log("Checkpoint 1.1");

      ['pending', 'accepted', 'declined'].forEach(type => {

         // Incoming Invites
         Object.keys(incomingInvites[type]).forEach(userID => {
            console.log("checkpoint 1.2");
            Object.keys(incomingInvites[type][userID]).forEach(groupID => {
               console.log("Checkpoint 1.2")
               outgoingInviteIDs.push(incomingInvites[type][userID][groupID]['docID'])
            })
         })

         // Outgoing invites
         Object.keys(outgoingInvites[type]).forEach(userID => {
            Object.keys(outgoingInvites[type][userID]).forEach(groupID => {
               incomingInviteIDs.push(outgoingInvites[type][userID][groupID]['docID'])
            })
         })
      })

      console.log("Checkpoint 3");
      console.log("Invites:");
      console.log(outgoingInviteIDs);
      console.log(incomingInviteIDs);


      


      const { response, error } = await DeleteUser({
         id: usr.id,
         imgPath: usr.imgPath,
         ownedGroups,
         involvedGroupIDs,
         followingDocIDs,
         outgoingInviteIDs,
         incomingInviteIDs,
      })

      if (error) {
         console.log(error)
         alert(error)
      }
   }


   return reduxReady() ? (  
      <Box>

         {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Non-Admin Settings -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
         <Box>
            <Typography 
            component='div' 
            variant='h5' 
            gutterBottom
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
               <span>User Settings</span>
               <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <Typography mr={4}>
                     { getName() }
                  </Typography>
                  <IconButton onClick={ closeSettings } sx={{ 
                     color: '#bac8d3',
                     "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
                  }}>
                     <Close />
                  </IconButton>
               </Box>
            </Typography>


            <Box sx={{
               maxHeight: 'calc(100vh - 140px)',
               overflowY: 'scroll',
               '&::-webkit-scrollbar': { width: '4px' },
               '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: '4px' },
            }}>
               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        {
                           editing 
                           ?  <Box>
                                 <Box>
                                    <TextField 
                                    size='small'
                                    disabled={ updating }
                                    onChange={ e => setFirstName(e.target.value) }
                                    variant='outlined'
                                    value={ firstName } 
                                    sx={{ 
                                       "& input": { bgcolor: dark && 'rgb(55,73,87)', color: dark && '#bac8d3', fontSize: '20px' },
                                       mr: 1,
                                    }}/>
                                    <TextField 
                                    size='small'
                                    disabled={ updating }
                                    onChange={ e => setLastName(e.target.value) }
                                    variant='outlined'
                                    value={ lastName } 
                                    sx={{ 
                                       "& input": { bgcolor: dark && 'rgb(55,73,87)', color: '#bac8d3', fontSize: '20px' }
                                    }}/>
                                 </Box>
                                 <TextField
                                 multiline
                                 fullWidth
                                 onChange={ e => setBio(e.target.value) }
                                 value={ bio }
                                 disabled={ updating }
                                 variant='outlined'
                                 rows={4}
                                 sx={{ 
                                    "& textarea": { bgcolor: dark && 'rgb(55,73,87)', color: '#bac8d3', fontSize: '20px' },
                                    mt: 1
                                 }}/>
                                 
                              </Box>
                           :  <Box>
                                 <Typography variant='h6' gutterBottom>{ getName() }</Typography>
                                 <Typography variant='subtitle1' gutterBottom>{ user().bio }</Typography>
                              </Box>
                        }
                        {
                           editing 
                           ?  <IconButton onClick={ closeEditor } sx={{ 
                                 color: '#bac8d3',
                                 "&:hover": { bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00e676' }
                              }}>
                                 <Check />
                              </IconButton>
                           :  <Tooltip title='Edit Profile'>
                                 <IconButton onClick={ openEditor } sx={{ 
                                    color: '#bac8d3',
                                    "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
                                 }}>
                                    <Edit />
                                 </IconButton>
                              </Tooltip>
                        }
                        
                     </Box>
                     
                  </CardContent>
               </Card>

               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h6' gutterBottom>Tutorial</Typography>
                     </Box>
                     <Typography variant='subtitle2' sx={{ mb: 2 }}>If you would like to redo or look at the new user tutorial again, go ahead and click here!</Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button 
                        variant='contained' 
                        onClick={ () => history.push('/tutorial') }
                        >Tutorial</Button>
                     </Box>
                  </CardContent>
                  
               </Card>

               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h6' gutterBottom>Age Range</Typography>
                        <Switch 
                        disabled={ updatingAge } 
                        checked={ user().hasAgeRange } 
                        onChange={ toggleHasAgeRange } />
                     </Box>
                     <Typography variant='subtitle2' sx={{ mb: 2 }}>You can set an age range if you'd like to filter user recommendations based on age.</Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 450 }}>
                           <Slider
                           defaultValue={ user().ageRange }
                           disabled={ !user().hasAgeRange }
                           disableSwap
                           onChange={ (_, val) => setAgeRange(val) }
                           valueLabelDisplay="auto" />
                        </Box>
                        { 
                           user().hasAgeRange && 
                           ageRange && 
                           !equals(ageRange, user().ageRange) && 
                           <Button disabled={ updatingAge } onClick={ updateAgeRange } sx={{ ml: 2 }}>
                              { 
                                 updatingAge 
                                 ?  <CircularProgress size={ 30 } />
                                 :  <span>Confirm</span>
                              }
                           </Button> 
                        }
                     </Box>
                     
                  </CardContent>
                  
               </Card>

               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h6' gutterBottom>Light / Dark Mode</Typography>
                     </Box>
                     <Typography variant='subtitle2' sx={{ mb: 2 }}>You can set the theme (Light/Dark) of your page.</Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch 
                        disabled={ updatingMode } 
                        checked={ user().darkMode } 
                        onChange={ toggleMode } />
                        <Typography>{ user().darkMode ? 'Dark' : 'Light' }</Typography>
                     </Box>
                     
                  </CardContent>
                  
               </Card>

               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h6' gutterBottom>Allow Users to See Your Location</Typography>
                     </Box>
                     <Typography variant='subtitle2' sx={{ mb: 2 }}>You can still allow us use your location for a more immersive experience while hiding your location from other users.</Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch 
                        disabled={ updatingHideLocation || !user()['coords'] } 
                        checked={ user()['allowLocation'] } 
                        onChange={ toggleHideLocation } 
                        />
                        <Typography>{ user().allowLocation ? 'Yes! Show my location' : "No. Hide my location from others users" }</Typography>
                     </Box>
                     
                  </CardContent>
                  
               </Card>

               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='h6' gutterBottom>Allow Use of Location</Typography>
                     </Box>
                     <Typography variant='subtitle2' sx={{ mb: 2 }}>Would you like to allow us to use your location in order to better recommend users and create a more immersive experience?</Typography>
                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch 
                        disabled={ updatingAllowLocation } 
                        checked={ user()['coords'] } 
                        onChange={ toggleAllowLocation } 
                        />
                        <Typography>{ user()['coords'] ? 'Yes! Use my location' : "No. Don't use my location" }</Typography>
                     </Box>
                     
                  </CardContent>
                  
               </Card>

               <Card sx={{
                  bgcolor: dark && 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: dark && 'inherit'
               }}>
                  <CardContent>
                     <Typography variant='h6' gutterBottom>Delete Account</Typography>
                     <Typography variant='subtitle2'>Deleting an account will not remove any sent group messages and will not be recoverable.</Typography>
                  </CardContent>
                  <CardActions>
                     <Tooltip title='Coming soon lol'>
                        <Button 
                        onClick={ deleteUser }
                        fullWidth 
                        variant='contained' 
                        endIcon={ !deleting && <Delete /> }
                        color='error' >
                           { !deleting ? <span>Delete Account</span> : <CircularProgress color='inherit' fontSize='small' /> }
                        </Button>
                     </Tooltip>
                  </CardActions>
               </Card>
            </Box>
            
         </Box>
         

      </Box>
   ) : (
      <Box>Loading...</Box>
   )
}
 
export default UserSettingsContainer;