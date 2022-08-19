

// React
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

// Material UI
import { 
   Box, 
   Typography,
   Avatar,
   IconButton,
   Card, 
   CardContent,
   CardActionArea,
   CardActions,
   CardMedia, 
   Button,
   CardHeader,
   CircularProgress,
} from '@mui/material';
import {
   Close
} from '@mui/icons-material';
import { blue, orange, indigo, lightBlue} from '@mui/material/colors';

// Firebase
import { firestore, firebaseAuth } from '../../firebase';
import { GetFollowing, UpdateUserWithId } from '../../FirebaseFunctions/Users';



const avatarDim = 200;


const ProfileInfoCard = ({ title, subtitle, avatar, route }) => {

   const dark = useSelector(state => state.dark_mode);
   const history = useHistory();

   const goTo = () => history.push(route)

   return (
      <Card 
      elevation={2} 
      sx={{ 
         borderRadius: '8px',
         bgcolor: `${dark && 'rgb(55,73,87)'}`, 
         m: 2,
         minWidth: '250px',
         '& span': { color: `${dark && '#BAC8C7'}` },
         '& span:nth-child(1)': { fontSize: '1.2em' }
      }}>
         <CardActionArea onClick={ goTo }>
            <CardHeader
            avatar={
               avatar
               ? <Avatar sx={{ width: 50, height: 50 }} src={ avatar } />
               : <Avatar sx={{ width: 50, height: 50 }} />
            }
            title={ title }
            subheader={ subtitle }
            />
         </CardActionArea>
      </Card>
   );
}

const UserProfileContainer = ({ }) => {

   const history = useHistory();
   const location = useLocation();
   const users = useSelector(state => state.users)
   const groups = useSelector(state => state.groups);
   const dark = useSelector(state => state.dark_mode);
   const friends = useSelector(state => state.friends);
   const user = () => users[window.location.pathname.split('/').pop()];
   const loggedInUser = () => users[firebaseAuth.currentUser.uid];
   const [following, setFollowing]                 = useState([]);
   const [similarFollowing, setSimilarFollowing]   = useState([]);
   const [filteredGroups, setFilteredGroups]       = useState([]);
   const [blocking, setBlocking]                   = useState(false);

   const userExists = () => {
      const userID = window.location.pathname.split('/').pop();
      return Boolean(users[userID]);
   }

   const filterGroups = () => {
      const userID = window.location.pathname.split('/').pop();
      if (groups && users) {
         setFilteredGroups(Object.values(groups).filter(group => group.users.filter(user => user.userID === userID).length > 0))
      } else {
         setFilteredGroups([])
      }
   }

   const getFollowing = async () => {

      // Get all users that current user (From profile) is following
      const userID = window.location.pathname.split('/').pop();
      const { response, error } = await GetFollowing(userID);
      if (error) alert("Error (GetFollowing):", error);
      setFollowing(response);

      // Get all users that both profile user and logged in user are following
      const userFollowing  = response.map(({ friend2 }) => friend2);
      const myFollowing    = Object.keys(friends);
      const similar        = [];

      userFollowing.forEach(otherFriendID => {
         myFollowing.forEach(myFriendID => {
            if (otherFriendID === myFriendID) similar.push(myFriendID);
         })
      })
      setSimilarFollowing(similar);
   }  

   const blockUser = async () => {
      setBlocking(true);
      const userID = window.location.pathname.split('/').pop();
      const usr = loggedInUser();
      console.log(usr);

      const { response, error } = await UpdateUserWithId(usr.id, {
         blocked: [ ...usr.blocked, userID ]
      })

      if (error) alert("Error blocking:", error);
      setBlocking(false);
   }

   const unblockUser = async () => {
      setBlocking(true);
      const userID = window.location.pathname.split('/').pop();
      const usr = loggedInUser();

      const { response, error } = await UpdateUserWithId(usr.id, {
         blocked: [ ...usr.blocked.filter(id => id !== userID) ]
      })

      if (error) alert("Error blocking:", error);
      setBlocking(false);
   }


   useEffect(() => {
      getFollowing();
      filterGroups();
   }, [location, groups, users])


   return userExists() && loggedInUser() && !user().blocked.includes(loggedInUser().id) ? (  
      <Box sx={{
         height: 'calc(100vh - 66px)',
         mt: '-24px',
         pt: '24px',
         overflowY: 'scroll',
         '&::-webkit-scrollbar': { width: '0px' },
         '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: '4px' },
         '& > div:last-child': { mb: 10 },
      }}>
         <Box sx={{ 
            display: 'flex', 
            justifyContent: 'start', 
            alignItems: 'start',
            margin: 2, 
         }}>
            { 
               user()['img']
               ?  <Avatar sx={{ width: avatarDim, height: avatarDim }} src={ user()['img'] } />
               :  <Avatar sx={{ bgcolor: orange[500], width: avatarDim, height: avatarDim }}>
                     { user().first_name[0] + user().last_name[0] }
                  </Avatar>
            }
            <Box ml={ 5 }>
               <Typography mt={ 2 } variant='h3' mb={ 2 }>
                  { user().first_name + ' ' + user().last_name }
               </Typography>
               <Typography variant='h6' mb={ 3 }>
                  { user().username + '  —  ' + user().email }
               </Typography>
               <Typography variant='body2' gutterBottom>
                  { user().bio }
               </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
               <IconButton onClick={ () => history.push('/console') } sx={{ 
                  color: '#bac8d3',
                  "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
               }}>
                  <Close />
               </IconButton>
            </Box>
         </Box>

            <Typography sx={{
               fontSize: '1.4em',
               mt: 4,
               ml: 2,
               mr: 4,
               borderBottom: `2px solid ${dark ? '#BAC8C7' : 'black'}`,
               pb: 1,
            }}>Groups</Typography>
            <Box sx={{ 
               display: 'flex', 
               justifyContent: 'start', 
               alignItems: 'start',
               flexFlow: 'wrap',
               margin: 2, 
            }}>
               {
                  filteredGroups.map(group => (
                     <ProfileInfoCard 
                        key={ group.id }
                        title={ group['title'] }
                        subtitle={ `Users: ${group['users'].length}` }
                        avatar={ group['img'] }
                        route={ `/console/${group.id}`}
                     />
                  ))
               }
               {
                  filteredGroups.length === 0 && 
                  <Typography sx={{
                     margin: '20px auto 0 auto',
                     fontSize: '1.3em',
                  }}>No Groups</Typography>
               }
            </Box>

            <Typography sx={{
               fontSize: '1.4em',
               mt: 4,
               ml: 2,
               mr: 4,
               borderBottom: `2px solid ${dark ? '#BAC8C7' : 'black'}`,
               pb: 1,
            }}>Following</Typography>
            <Box sx={{ 
               display: 'flex', 
               justifyContent: 'start', 
               alignItems: 'start',
               flexFlow: 'wrap',
               margin: 2, 
            }}>
               {
                  following.map(({ friend2: invited }) => users[invited] && (
                     <ProfileInfoCard 
                        key={ invited }
                        title={ users[invited].first_name + ' ' + users[invited].last_name }
                        subtitle={ users[invited].username }
                        avatar={ users[invited]['img'] }
                        route={ `/profiles/${invited}`}
                     />
                  ))
               }
               {
                  following.length === 0 && 
                  <Typography sx={{
                     margin: '20px auto 0 auto',
                     fontSize: '1.3em',
                  }}>Not Following Any Users</Typography>
               }
            </Box>
            {
               window.location.pathname.split('/').pop() !== firebaseAuth.currentUser.uid &&
               <Box>
                  <Typography sx={{
                     fontSize: '1.4em',
                     mt: 4,
                     ml: 2,
                     mr: 4,
                     borderBottom: `2px solid ${dark ? '#BAC8C7' : 'black'}`,
                     pb: 1,
                  }}>Similar Following</Typography>
                  <Box sx={{ 
                     display: 'flex', 
                     justifyContent: 'start', 
                     alignItems: 'start',
                     flexFlow: 'wrap',
                     margin: 2, 
                  }}>
                     { 
                        similarFollowing.map(userID => (
                           <ProfileInfoCard 
                              key={ `similar-${userID}`}
                              title={ users[userID].first_name + ' ' + users[userID].last_name }
                              subtitle={ users[userID].username }
                              avatar={ users[userID]['img'] }
                              route={ `/profiles/${userID}`}
                           />
                        ))
                     }
                     {
                        similarFollowing.length === 0 && 
                        <Typography sx={{
                           margin: '20px auto 0 auto',
                           fontSize: '1.3em',
                        }}>Not Following Any Similar Users</Typography>
                     }
                  </Box>
                  <Box sx={{ mt: 6, pr: 5, display: 'flex', justifyContent: 'end' }}>
                     {
                        !loggedInUser().blocked.includes(window.location.pathname.split('/').pop())
                        ?  <Button onClick={ blockUser } variant='contained' color='warning'>
                              { blocking ? <CircularProgress sx={{ '& circle': { stroke: '#fff' } }} size={ 20 } /> : <span>Block User</span> }
                           </Button>
                        :  <Button onClick={ unblockUser } variant='contained' color='warning'>
                              { blocking ? <CircularProgress sx={{ '& circle': { stroke: '#fff' } }} size={ 20 } /> : <span>Unblock User</span> }
                           </Button>
                     }
                  </Box>
               </Box>
               
            }
            
            
         
      </Box>
   ) : (
      <Box>
         <h2>{ window.location.pathname.split('/').pop() } does not exist...</h2>
      </Box>
   )
}
 
export default UserProfileContainer;