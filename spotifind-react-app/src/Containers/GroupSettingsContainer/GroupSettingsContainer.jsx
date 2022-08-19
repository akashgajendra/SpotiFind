
// React
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// Material UI
import {
   Box,
   TextField,
   IconButton,
   Button,
   Typography,
   Divider,
   Card,
   CardHeader,
   CardContent,
   CardActions,
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
import { DeleteGroup, UpdateGroup } from '../../FirebaseFunctions/Groups';








const GroupSettingsContainer = () => {

   const history = useHistory();
   const groups = useSelector(state => state.groups);
   const users = useSelector(state => state.users);
   const dark = useSelector(state => state.dark_mode);

   const [groupID, setGroupID] = useState(window.location.pathname.split('/').at(-2));
   const [deleting, setDeleting] = useState(false);
   const [updating, setUpdating] = useState(false);
   const [editing, setEditing] = useState(false);
   const [title, setTitle] = useState('');


   
   
   const reduxReady = () => {
      return Object.keys(groups).length > 0 && Object.keys(users).length > 0 && groups[groupID] 
   }

   const closeSettings = () => history.push(`/console/${groupID}`);
   const isAdmin = () => groups[groupID].owner === firebaseAuth.currentUser.uid;
   const openEditor = () => {
      setEditing(true);
      setTitle(groups[groupID].title);
   }

   const closeEditor = async () => {

      // If no changes made
      if (title === groups[groupID].title) {
         setEditing(false);
         return;
      }

      setUpdating(true); 

      const { response, error } = await UpdateGroup(groupID, { title });
      if (error) alert("Error:", error);

      setUpdating(false);
      setEditing(false);
   }


   const deleteGroup = async () => {
      setDeleting(true);

      const { response, error } = await DeleteGroup(groupID, groups[groupID].imgPath);

      if (error) {
         alert("Could not delete group", error);
         setDeleting(false);
         console.log(error);
      } else {
         history.push('/console');
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
               <span>General Group Settings</span>
               <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <Typography mr={4}>
                     { groups[groupID].title }
                  </Typography>
                  <IconButton onClick={ closeSettings } sx={{ 
                     color: '#bac8d3',
                     "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
                  }}>
                     <Close />
                  </IconButton>
               </Box>
            </Typography>


            <Card sx={{
               bgcolor: dark && 'rgb(55,73,87)',
               paddingX: 2,
               m: 3, 
               color: dark && 'inherit'
            }}>
               <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     {
                        editing 
                        ?  <TextField 
                           size='small'
                           disabled={ updating }
                           onChange={ e => setTitle(e.target.value) }
                           variant='outlined'
                           value={ title } 
                           sx={{ 
                              "& input": { bgcolor: dark && 'rgb(55,73,87)', color: '#bac8d3', fontSize: '20px' }
                           }}/>
                        :  <Typography variant='h6' gutterBottom>{ groups[groupID].title }</Typography>
                     }
                     {
                        editing 
                        ?  <IconButton onClick={ closeEditor } sx={{ 
                              color: '#bac8d3',
                              "&:hover": { bgcolor: 'rgba(0, 230, 118, 0.1)', color: '#00e676' }
                           }}>
                              <Check />
                           </IconButton>
                        :  <IconButton onClick={ openEditor } sx={{ 
                              color: '#bac8d3',
                              "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
                           }}>
                              <Edit />
                           </IconButton>
                     }
                     
                  </Box>
                  <Typography variant='subtitle1' gutterBottom>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At aut id libero, dicta placeat illum in architecto aliquam ad ipsa ipsum sequi quisquam? Modi sint eveniet quibusdam beatae laudantium alias?</Typography>
               </CardContent>
            </Card>
         </Box>
         

         <Divider sx={{ bgcolor: '#bac8d3', marginY: 4 }} />

         {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Admin Settings -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
         {
            isAdmin() && 
            <Box>
               <Typography component='div' variant='h5' gutterBottom>
                  Admin Group Settings
               </Typography>
               <Card sx={{
                  bgcolor: 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: 'inherit'
               }}>
                  <CardContent>
                     <Typography variant='h6' gutterBottom>Remove Users</Typography>
                  </CardContent>
               </Card>
               <Card sx={{
                  bgcolor: 'rgb(55,73,87)',
                  paddingX: 2,
                  m: 3, 
                  color: 'inherit'
               }}>
                  <CardContent>
                     <Typography variant='h6' gutterBottom>Delete Group</Typography>
                     <Typography variant='subtitle2'>Deleting a group will remove all message history, remove all users from the group, and will not be recoverable.</Typography>
                  </CardContent>
                  <CardActions>
                     <Button 
                     onClick={ deleteGroup }
                     fullWidth 
                     variant='contained' 
                     endIcon={ !deleting && <Delete /> }
                     color='error' >
                        { !deleting ? <span>Delete Group</span> : <CircularProgress color='inherit' fontSize='small' /> }
                     </Button>
                  </CardActions>
               </Card>
            </Box>
         }
         

   
      </Box>
   ) : (
      <Box>Loading...</Box>
   )
}
 
export default GroupSettingsContainer;