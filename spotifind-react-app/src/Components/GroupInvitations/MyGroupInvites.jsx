// React
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

// Material UI
import {
   Menu,
   MenuItem,
   Divider,
   Button,
   ListItem,
   ListItemIcon,
   ListItemText,
   Paper,
   Typography,
   CircularProgress,
} from '@mui/material'
import {
   RemoveCircleOutline,
   Remove,
   Close,
   Delete,
   SentimentVerySatisfied,
   SentimentVeryDissatisfied,
   Schedule,
   Check,
} from '@mui/icons-material';

// Firebase
import { firebaseAuth } from '../../firebase';
import { AcceptInvite, DeclineInvite } from '../../FirebaseFunctions/Groups';



const MyInvitesMenuOptions = ({ anchorEl, setAnchorEl, invite }) => {

   const handleClose = () => setAnchorEl(null);
   const [loading, setLoading] = useState(false);
   const incomingInvites = useSelector(state => state.incomingInvites);

   const acceptInvite = async () => {
      setLoading(true);

      const docIDs = [];
      Object.values(incomingInvites['pending']).forEach(userCollection => {
         Object.values(userCollection).forEach(reduxInvite => {
            if (reduxInvite.groupID === invite.groupID) docIDs.push(reduxInvite.docID);
         })
      })
      const { response, error } = await AcceptInvite(docIDs, invite.groupID);
      if (error) alert("ERROR", error);
      handleClose();
      setLoading(false);
   }  

   const declineInvite = async () => {
      setLoading(true);
      const { response, error } = await DeclineInvite(invite.docID);
      if (error) alert("ERROR", error);
      handleClose();
      setLoading(false);
   }

   return (
      <Menu
         id='option-menu'
         open={ Boolean(anchorEl) }
         anchorEl={ anchorEl }
         onClose={handleClose}
         anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
         }}
         transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
         }}
      >
         { 
            !loading ? (
               <div>
                  <MenuItem onClick={ acceptInvite }>
                     <ListItemIcon>
                        <Check />
                     </ListItemIcon>
                     <Typography>Accept</Typography>
                  </MenuItem>
                  <MenuItem onClick={ declineInvite }>
                     <ListItemIcon>
                        <Close />
                     </ListItemIcon>
                     <Typography>Decline</Typography>
                  </MenuItem>
               </div>
            ) : <CircularProgress fontSize='small' sx={{ m: 2 }} />
         }
      </Menu>
   )
}




const MyGroupInvites = ({ anchorEl, setAnchorEl }) => {

   const handleClose = () => setAnchorEl(null);

   const groups            = useSelector(state => state.groups);
   const users             = useSelector(state => state.users);
   const incomingInvites   = useSelector(state => state.incomingInvites);

   const [optionsAnchorEl, setOptionsAnchorEl]  = useState(null);
   const [selectedInvite, setSelectedInvite]    = useState(null);
   
  

   const openInviteOptions = (invite, target) => {
      setSelectedInvite(invite);
      setOptionsAnchorEl(target);
   }

   

   const reduxReady = () => {
      return groups && users;
   }


   return reduxReady() ? (
      <Menu
      id="my-invites-menu"
      anchorEl={ anchorEl }
      open={ Boolean(anchorEl) }
      onClose={ handleClose }
      PaperProps={{
         style: {
            // width: 300
         },
      }}
      >
         <ListItem disablePadding sx={{ mb: 1 }}>
            <Typography variant='h6' fontWeight={ 600 } marginX={ 2 }>My Invites</Typography>
         </ListItem>
         {
            Object.values(incomingInvites['pending']).map(userCollection => (
               Object.values(userCollection).map(invite => (
                  <MenuItem onClick={ e => openInviteOptions(invite, e.currentTarget) }>
                     <Typography sx={{ flexGrow: 1 }}>{ users[invite.inviter] && users[invite.inviter].first_name + ' ' + users[invite.inviter].last_name }</Typography>
                     <Typography sx={{ color: '#d3d3d3', ml: 3 }} variant='subtitle2'>{ groups[invite.groupID] && groups[invite.groupID].title }</Typography>
                  </MenuItem>
               ))
            ))
         }
         
         <MyInvitesMenuOptions anchorEl={ optionsAnchorEl } setAnchorEl={ setOptionsAnchorEl} invite={ selectedInvite } />
      </Menu>
   
) : (
   <Menu
      id="invite-menu"
      anchorEl={anchorEl}
      open={ Boolean(anchorEl) }
      onClose={handleClose}
   >
      <CircularProgress size='small' sx={{ m: 2 }} />
   </Menu>
)
}
 
export default MyGroupInvites;