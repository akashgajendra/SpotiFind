
// React
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// Material UI
import {
   TextField, 
   Button,
   Card,
   CardActionArea,
   CardContent,
   CardActions,
   Box,
   IconButton,
   Avatar,
   Typography,
   Slider,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
   Grid,
} from '@mui/material';
import {
   Search,
   MoreVert,
} from '@mui/icons-material';

// Firebase
import { firestore, firebaseAuth } from '../../firebase';

const GroupResult = ({ group, onClick }) => {


   return (
      <Card variant=''>
         <Grid container>
            <Grid item xs={11}>
               <CardActionArea
               onClick={ () => onClick(group.id) }
               sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  paddingY: 1, 
                  borderRadius: '8px' 
               }}>
                  <Grid item xs={2}>
                     {
                        group['img'] 
                        ? <Avatar sx={{ width: 50, height: 50 }} src={ group['img'] } />
                        : <Avatar sx={{ width: 50, height: 50 }} />
                     }
                  </Grid>
                  <Grid item xs={9}>
                     <Typography variant='h6'>{ group['title'] }</Typography>
                     <Typography variant='subtitle1' color='#898989'>Users: { group['users'].length }</Typography>
                  </Grid>
               </CardActionArea>
            </Grid>
            
            <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
               <IconButton>
                  <MoreVert />
               </IconButton>
            </Grid>
         </Grid>

         
      </Card>
      
   )
}

const UserResult = ({ user, onClick }) => {
   return (
      <Card variant=''>
         <Grid container>
            <Grid item xs={11}>
               <CardActionArea
               onClick={ () => onClick(user.id) }
               sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  paddingY: 1, 
                  borderRadius: '8px' 
               }}>
                  <Grid item xs={2}>
                     {
                        user['img'] 
                        ? <Avatar sx={{ width: 50, height: 50 }} src={ user['img'] } />
                        : <Avatar sx={{ width: 50, height: 50 }} />
                     }
                  </Grid>
                  <Grid item xs={9}>
                     <Typography variant='h6'>{ user['first_name'] + ' ' + user['last_name'] }</Typography>
                     <Typography variant='subtitle1' color='#898989'>{ user['username'] }</Typography>
                  </Grid>
               </CardActionArea>
            </Grid>
            
            <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
               <IconButton>
                  <MoreVert />
               </IconButton>
            </Grid>
         </Grid>

         
      </Card>
      
   )
}

const SearchDialog = ({ open, setOpen }) => {

   const history              = useHistory();
   const users                = useSelector(state => state.users);
   const groups               = useSelector(state => state.groups)
   const [query, setQuery]                   = useState('');



   const onUserSelect = (userID) => {
      setOpen(false);
      history.push(`/profiles/${userID}`);
   }

   const onGroupSelect = (groupID) => {
      setOpen(false);
      history.push(`/console/${groupID}`);
   }

   const filterUsers = () => {
      if (query === '') return Object.values(users).filter(({ id }) => id !== firebaseAuth.currentUser.uid);
      
      return Object.values(users).filter(({first_name, last_name, username, id}) => 
         (
            (first_name + ' ' + last_name).substr(0, query.length) === query || 
            username.substr(0, query.length) === query
         ) && 
         id !== firebaseAuth.currentUser.uid
      )
   }

   const filterGroups = () => {
      return query === '' 
      ? Object.values(groups)
      : Object.values(groups).filter(({ title }) => title.substr(0, query.length) === query);
   }
   

   useEffect(() => {
      if (open) setQuery('');
   }, [open])


   return (  
      <Dialog 
         sx={{ 
            '& .MuiDialog-paper': { maxHeight: '50vh', borderRadius: '20px' } 
         }}
         scroll='paper'
         open={ open }
         onClose={ () => setOpen(false) }
      >
         <DialogTitle sx={{ 
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            '& input::placeholder': { color: '#cfcfcf', fontSize: '0.8em' }
         }}>
            <Search sx={{
               fill: '#007FFF',
               width: 40,
               height: 40,
            }} />
            <input 
            autoFocus
            id='user-search' 
            onChange={ e => setQuery(e.target.value) } 
            type='text' 
            placeholder='Search...' 
            style={{
               outline: 'none',
               border: 'none',
               width: '100%',
               height: '40px',
               margin: '0 10px',
               fontSize: '1.6em',
               paddingX: '8px',
               color: '#007FFF',
            }}/>
            <button onClick={ () => setOpen(false) } style={{
               display: 'block',
               alignSelf: 'center',
               height: '1.5rem',
               marginRight: '8px',
               padding: '2.4px 6.4px 4.8px',
               borderRadius: '5px',
               backgroundColor: 'rgb(243, 246, 249)',
               border: '1px solid rgb(215, 220, 225)',
            }}>esc</button>
         </DialogTitle>
         <DialogContent dividers>
            {
               filterUsers().map((user, i) => (
                  <div>
                     { 
                        i === 0 && 
                        <Typography 
                           variant='subtitle1'
                           sx={{ 
                              fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              marginTop: 1,
                           }}>
                           Users
                        </Typography>  
                     }
                     <UserResult user={ user } onClick={ onUserSelect } />
                  </div>
               ))
            }
            {
               filterGroups().map((group, i) => (
                  <div>
                     { 
                        i === 0 && 
                        <Typography 
                           variant='subtitle1'
                           sx={{ 
                              fontFamily: '"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                              fontSize: '0.9rem',
                              fontWeight: 500,
                              marginTop: 1,
                           }}>
                           Groups
                        </Typography>  
                     }
                     <GroupResult group={ group } onClick={ onGroupSelect } />
                  </div>
               ))
            }
         </DialogContent>
      </Dialog>
   );
}
 
export default SearchDialog;