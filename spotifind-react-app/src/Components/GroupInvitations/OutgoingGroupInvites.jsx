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
} from '@mui/icons-material';

// Firebase
import { DismissInvite, UnsendInvite } from '../../FirebaseFunctions/Groups'
import { firebaseAuth } from '../../firebase';





const InviteMenuOptions = ({ anchorEl, setAnchorEl, invite }) => {

   const [loading, setLoading] = useState(false);

   const handleClose = () => setAnchorEl(null);

   const unsendInvite = async () => {
      setLoading(true);
      const { response, error } = await UnsendInvite(invite.docID);
      if (error) alert("ERROR", error)
      handleClose();
      setLoading(false);
   }

   const dismissInvite = async () => {
      setLoading(true);
      const { response, error } = await DismissInvite(invite.docID);
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
                  { 
                     invite && invite.status === 'pending' ? (
                        <MenuItem onClick={ unsendInvite }>
                           <ListItemIcon>
                              <Delete />
                           </ListItemIcon>
                           <Typography>Unsend Invite</Typography>
                        </MenuItem>
                     ) : (
                        <MenuItem onClick={ dismissInvite }>
                           <ListItemIcon>
                              <Remove />
                           </ListItemIcon>
                           <Typography>Dismiss</Typography>
                        </MenuItem>
                     )
                  }
               </div>
            ) : <CircularProgress sx={{ marginY: 2, marginX: 3 }} />
         }
         
      </Menu>
   )


}


const GroupInvitations = ({ anchorEl, setAnchorEl }) => {


   const handleClose = () => setAnchorEl(null);

   const [optionsAnchorEl, setOptionsAnchorEl]  = useState(null);
   const [selectedInvite, setSelectedInvite]    = useState(null);
   const outgoingInvites   = useSelector(state => state.outgoingInvites);
   const groups            = useSelector(state => state.groups);
   const users             = useSelector(state => state.users);


   const reduxReady = () => {
      return groups && users;
   }


   const openInviteOptions = (invite, target) => {
      setSelectedInvite(invite);
      setOptionsAnchorEl(target);
   }

   const sections = [
      { 
         title: 'Pending Invites',
         status: 'pending',
         icon: <Schedule />
      },
      { 
         title: 'Accepted',
         status: 'accepted',
         icon: <SentimentVerySatisfied />
      },
      { 
         title: 'Declined',
         status: 'declined',
         icon: <SentimentVeryDissatisfied />
      }
   ]





   return reduxReady() ? (
         <Menu
         id="invite-menu"
         anchorEl={ anchorEl }
         open={ Boolean(anchorEl) }
         onClose={ handleClose }
         
         >
            {
               
               sections.map(({ title, status, icon }, i) => (
                  <div>
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        
                        <Typography variant='h6' fontWeight={ 600 } marginX={ 2 }>{ title }</Typography>
                        <ListItemIcon sx={{ minWidth: 'unset', mr: 2 }}>
                           { icon }
                        </ListItemIcon>
                     </ListItem>
                     {
                        Object.values(outgoingInvites[status]).map(userCollection => (
                           Object.values(userCollection).map(invite => (
                              <MenuItem onClick={ e => openInviteOptions(invite, e.currentTarget) }>
                                 <Typography sx={{ flexGrow: 1}}>{ users[invite.invited] && users[invite.invited].first_name + ' ' + users[invite.invited].last_name }</Typography>
                                 <Typography sx={{ color: '#d3d3d3', ml: 2 }} variant='subtitle2'>{ groups[invite.groupID] && groups[invite.groupID].title }</Typography>
                              </MenuItem>
                           ))
                        ))
                     }
                     { i < 2 && <Divider sx={{ marginY: 2 }} /> }


                  </div>
                     
               ))
            }
            
            <InviteMenuOptions anchorEl={ optionsAnchorEl } setAnchorEl={ setOptionsAnchorEl} invite={ selectedInvite } />
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
 
export default GroupInvitations;