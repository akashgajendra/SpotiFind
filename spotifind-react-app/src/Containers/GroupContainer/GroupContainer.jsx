// React
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { SetWrapper } from "../../Reducers/WrapperReducer";

// Material UI/Styles
import {
   Grid,
   Box,
   Paper,
   Divider,
   TextField,
   IconButton,
   Button,
   Avatar,
   Tooltip,
   ListItemIcon,
   CircularProgress,
   Typography,
   Menu,
   MenuItem,
} from '@mui/material';
import {
   Send,
   Person,
   ChevronLeft,
   Block,
   ExitToApp,
   PersonAdd,
   Delete,
   Check,
   Settings,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import './GroupContainer.scss';


// Components
import Message from "../../Components/Message/Message";

// Firebase
import { firebaseAuth, firestore } from "../../firebase";
import { SendMessage, DeleteGroup, LeaveGroup, SendGroupInvite, JoinGroup } from "../../FirebaseFunctions/Groups";






const InviteMenu = ({ anchorEl, setAnchorEl }) => {

   const handleClose = () => setAnchorEl(null);
   const ITEM_HEIGHT = 48;
   
   const location          = useLocation();
   const users             = useSelector(state => state.users);
   const groups            = useSelector(state => state.groups);
   const outgoingInvites   = useSelector(state => state.outgoingInvites);
   const [selectedUsers, setSelectedUsers]   = useState({});
   const [groupID, setGroupID]               = useState(window.location.pathname.split('/').pop());


   const toggleUser = (userID) => {
      const copy = { ...selectedUsers };
      copy[userID] ? delete copy[userID] : copy[userID] = userID;
      setSelectedUsers(copy);
   }


   const sendInvites = async () => {

      const promises = [];

      // Add invite promises to array for processing
      Object.keys(selectedUsers).forEach(invitedUserID => {
         promises.push(
            SendGroupInvite(invitedUserID, groupID)
         );
      });

      // Concurrently execute promises
      Promise.all(promises)
      .then(responses => {
         responses.forEach(({ response, error }) => {
            if (error) alert("ERROR ADDING USER");
         })

         // Clear users
         setSelectedUsers({});
      })
   }


   const remainingUsers = () => {
      const currentUserID = firebaseAuth.currentUser.uid;
      const groupUsers = groups[groupID].users

      const usersAlreadyInGroup = Object.values(users).filter(user => groupUsers.filter(usr => usr.userID === user.id).length === 0);
      const alreadySentInvites = usersAlreadyInGroup.filter(user => !(outgoingInvites['pending'][user.id] && outgoingInvites['pending'][user.id][groupID]));
      return alreadySentInvites.filter(user => user.id !== currentUserID);


   }

   const canRender = () => {
      return groups && groups[groupID] && users
   }


   useEffect(() => {
      
      setGroupID(window.location.pathname.split('/').pop());

   }, [location])




   return canRender() ? (
      <Menu
         id="invite-menu"
         anchorEl={anchorEl}
         open={Boolean(anchorEl)}
         onClose={handleClose}
         PaperProps={{
            style: {
               maxHeight: ITEM_HEIGHT * 6.5,
            },
         }}
      >
         { remainingUsers().map((user) => (
            <MenuItem 
            key={ user.id } 
            selected={ selectedUsers[user.id] } 
            onClick={ () => toggleUser(user.id) }>
               { 
                  selectedUsers[user.id] && 
                  <ListItemIcon>
                     <Check />
                  </ListItemIcon>
               }
               <span>{ user.first_name + ' ' + user.last_name}</span>
            </MenuItem>
         ))}
         {
            Object.keys(selectedUsers).length > 0 &&
            <MenuItem sx={{ position: 'sticky', bottom: '0', left: '0' }}>
               <Button onClick={ sendInvites } fullWidth variant='contained' sx={{ m: 1 }}>Send!</Button>
            </MenuItem>
         }
         
      </Menu>
   ) : (
      <h2>Loading...</h2>
   )
}


const GroupContainer = () => {
   const groups = useSelector(state => state.groups);
   const users = useSelector(state => state.users);
   const dark = useSelector(state => state.dark_mode);
   const dispatch = useDispatch();
   const history = useHistory();
   const location = useLocation();

   const [userMessage, setUserMessage] = useState("");
   const [sending, setSending] = useState(false);
   const [groupID, setGroupID] = useState(window.location.pathname.split('/').at(-1));
   const [loading, setLoading] = useState(false);
   const [icon, setIcon] = useState(<CircularProgress />);


   const [leaveIcon, setLeaveIcon] = useState(<ExitToApp fontSize='medium' />);
   const [inviteAnchorEl, setInviteAnchorEl] = useState(null);



   const sendMessage = async (e) => {
      e.preventDefault();  // Prevent page refresh
      setSending(true);

      const groupID = window.location.pathname.split('/').at(-1);
      const senderID = '123456'

      const { response, error } = await SendMessage(groupID, userMessage, senderID);

      // Handle error/response
      if (!error) {
         // scrollToBottom(document.getElementById('group-messages'))
         document.getElementById('group-messages').lastChild.scrollIntoView();
         setUserMessage("");

      } else {
         alert("Did not send message", error)
      }

      setSending(false);
      document.getElementById('message-field').focus();
   }

   const sort = (arr, sortBy) => {
      const arrCopy = [...arr];
      arrCopy.sort((a, b) => a[sortBy] - b[sortBy]);
      return arrCopy;
   }

   const userInGroup = () => {
      const groupID = window.location.pathname.split('/').at(-1)

      if (groups && groups[groupID]) return groups[groupID].users.find(user => user.userID === firebaseAuth.currentUser.uid);
      return []
   }


   const leaveGroup = async () => {
      setLeaveIcon(<CircularProgress fontSize='small' />);

      const { response, error } = await LeaveGroup(
         groupID, 
         groups[groupID].users.find(user => user.userID === firebaseAuth.currentUser.uid).docID
      );

      if (error) {
         alert("Could not leave group", error);
         setLeaveIcon(<ExitToApp fontSize='medium' />);
         console.log(error);
      } else {
         history.push('/console');
      }
   }

   const joinGroup = async () => {
      setLoading(true);

      const { response, error } = await JoinGroup(groupID);

      if (error) {
         alert("Could not join group", error);
         console.log(error);
      }

      setIcon(<Check />);

      setTimeout(() => {
         setIcon(<CircularProgress />);
         setLoading(false);
      }, 2000);
   }





   useEffect(() => {
      dispatch(SetWrapper(true));
      setGroupID(window.location.pathname.split('/').pop());
   }, [location])


   return (Object.keys(groups).length > 0 && Object.keys(users).length > 0 && userInGroup()) ? ( 
      <Box>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            <Tooltip title='Return to Console'>
               <IconButton onClick={ () => history.push('/console') } sx={{ 
                  color: dark && '#bac8d3',
                  "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
               }} >
                  <ChevronLeft fontSize='large'/>
               </IconButton>
            </Tooltip>

            <Box sx={{ 
               "& > *": { margin: 0.5 },
               display: 'flex',
               alignItems: 'center',
            }}>
               <Typography mr={4}>
                  { groups && groups[groupID] && groups[groupID].title }
               </Typography>
               <Tooltip title='Invite User'>
                  <IconButton onClick={ e => setInviteAnchorEl(e.currentTarget) } sx={{ 
                     color: dark && '#bac8d3',
                     "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
                  }} >
                     <PersonAdd fontSize='medium' />
                  </IconButton>
               </Tooltip>
               <Tooltip title='Leave Group'>
                  <IconButton onClick={ leaveGroup } sx={{ 
                     color: dark && '#bac8d3',
                     "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
                  }} >
                     { leaveIcon }
                  </IconButton>
               </Tooltip>
               <Tooltip title='Settings'>
                  <IconButton onClick={ () => history.push(`/console/${groupID}/settings`) } sx={{ 
                     color: dark && '#bac8d3',
                     "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
                  }} >
                     <Settings />
                  </IconButton>
               </Tooltip>
            </Box>
            
         </Box>

         
         <Box id='group-messages' sx={{ 
            height: 'calc(100vh - 250px)',
            display: 'flex', 
            justifyContent: 'start', 
            alignItems: 'start', 
            flexDirection: 'column',
            overflowY: 'scroll', 
            overflowX: 'hidden',
         }}>
            { 
               groups && groups[groupID] && 
               sort(
                  Object.values(groups[groupID].messages),
                  'timestamp'
               ).map(msg => {
                  const {
                     sender,
                     message,
                     senderID,
                     messageID,
                  } = msg;

                  return <Message 
                           key={ messageID } 
                           right={ firebaseAuth.currentUser.uid === senderID} 
                           sender={ users[senderID] ? users[senderID]['first_name'] + ' ' + users[senderID]['last_name'] : 'Deleted' } 
                           message={ message } 
                           senderID={ senderID }
                           img={ users[senderID] && users[senderID]['img'] ? users[senderID]['img'] : null }
                        />
               })
            }
            
         </Box>

         <form>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px' }}>
               <TextField 
                  autoFocus
                  label={ sending ? 'Waiting for shitty A&M wifi...' : 'Message' } 
                  fullWidth 
                  sx={{ 
                     "& input": { bgcolor: dark && 'rgb(55,73,87)', color: dark && '#bac8d3' }
                  }}
                  disabled={ sending }
                  variant='filled'
                  value={ userMessage }
                  id='message-field'
                  onChange={ e => setUserMessage(e.target.value) }
               ></TextField>
               <IconButton 
               disabled={ sending } 
               onClick={ sendMessage }
               type='submit'
               sx={{ 
                  marginLeft: '10px', 
                  color: '#bac8d3', 
                  "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' } 
               }}>
                  { 
                     sending 
                     ? <CircularProgress />
                     : <Send />
                  }
               </IconButton>
            </Box>   
         </form>


         <InviteMenu anchorEl={ inviteAnchorEl } setAnchorEl={ setInviteAnchorEl } />
      </Box>
   ) : (
      <Box>
         <Box sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px 8px 0 0' }}>
            <Tooltip title='Return to Console' sx={{ 
               color: '#bac8d3',
               "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
            }} >
               <IconButton onClick={ () => history.push('/console') }>
                  <ChevronLeft fontSize='large' />
               </IconButton>
            </Tooltip>
         </Box>
         <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            height: 'calc(100vh - 160px)', 
            backgroundColor: '#f5f5f5',
            borderRadius: '0 0 8px 8px' }}>
            
            <Typography variant='h4'>Access Denied</Typography>
            <Typography variant='subtitle1' sx={{ color: '#78909c', margin: 3 }}>You have not joined this group...</Typography>
            <Button 
            onClick={ joinGroup }
            disabled={ loading }
            variant='outlined'>
               {
                  loading 
                  ? icon
                  : <span>Join Group!</span>
               }
            </Button>
         </Box>



      </Box>
      
   )
}
 
 
export default GroupContainer;