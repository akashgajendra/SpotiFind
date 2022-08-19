import { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
   Box,
   Dialog,
   DialogActions, 
   DialogContent, 
   DialogContentText,
   DialogTitle,
   Button,
   TextField,
   IconButton,
   Divider,
   Typography,    
   Tooltip,
   Slide,
   CircularProgress,
} from '@mui/material';
import {
   Add,
   ExitToApp, 
   Close,
   Delete,
   Edit,
   Check,
} from '@mui/icons-material';
import {
   green,
   blue,
   lightBlue,
   orange,
   red,
} from '@mui/material/colors';
import './ManageGroups.scss';

// Firebase
import { CreateGroup, DeleteGroup, JoinGroup, LeaveGroup } from '../../FirebaseFunctions/Groups';
import { firebaseAuth } from '../../firebase';




const Transition = forwardRef(function Transition(props, ref) {
   return <Slide direction="up" ref={ref} {...props} />;
});



const LeaveGroupDialog = ({ open, setOpen }) => {

   const [name, setName] = useState('');
   const [icon, setIcon] = useState(<CircularProgress />);
   const [loading, setLoading] = useState(false);
   const groups = useSelector(state => state.groups);

   const leaveGroup = async () => {
      setLoading(true);

      const groupID = Object.keys(groups).includes(name) ? name : Object.values(groups).find(group => group.title === name).id;
      const { response, error } = await LeaveGroup(
         groupID, 
         groups[groupID].users.find(user => user.userID === firebaseAuth.currentUser.uid).docID
      );

      if (error) {
         alert("Could not leave group", error);
         console.log(error);
      }

      setIcon(<Check />);
      setName("");

      setTimeout(() => {
         setIcon(<CircularProgress />);
         setLoading(false);
      }, 2000);
   }

   const userInGroup = () => {
      const group = groups[name] || Object.values(groups).find(group => group.title === name) || { users: [] }
      return group.users.find(user => user.userID === firebaseAuth.currentUser.uid);
   }



   return (
      <Dialog
         open={ open }
         onClose={ () => setOpen(false) }>

         <DialogTitle>Leave a Group!</DialogTitle>
         <DialogContent>
            <DialogContentText>Please provide the following fields in order to leave your group</DialogContentText>
            <Box sx={{ margin: 4 }}>
               <TextField 
               variant='outlined' 
               label='Group Name/ID' 
               fullWidth
               value={ name }
               onChange={ e => setName(e.target.value) } />
            </Box>
         </DialogContent>
         <DialogActions>
            <Button 
            onClick={ leaveGroup }
            disabled={ 
               name === '' || 
               loading || 
               !userInGroup()
            }
            variant='contained' 
            fullWidth 
            color='error'>
               {
                  loading 
                  ? icon
                  : <span>Leave Group!</span>
               }
            </Button>
         </DialogActions>

      </Dialog>
   );
}



const DeleteGroupDialog = ({ open, setOpen }) => {

   const [name, setName] = useState('');
   const [icon, setIcon] = useState(<CircularProgress />);
   const [loading, setLoading] = useState(false);
   const groups = useSelector(state => state.groups);
   const history = useHistory();

   const deleteGroup = async () => {
      setLoading(true);

      const groupID = Object.values(groups).find(group => group.title === name).id;

      const { response, error } = await DeleteGroup(groupID);
      if (window.location.pathname.split('/').at(-1) === groupID) history.push('/console');

      if (error) {
         alert("Could not delete group", error);
         console.log(error);
      }

      setIcon(<Check />);
      setName("");

      setTimeout(() => {
         setIcon(<CircularProgress />);
         setLoading(false);
      }, 2000);
   }



   return (
      <Dialog
         open={ open }
         onClose={ () => setOpen(false) }>

         <DialogTitle>Delete a Group!</DialogTitle>
         <DialogContent>
            <DialogContentText>Please provide the following fields in order to delete your group (You must be the owner)</DialogContentText>
            <Box sx={{ margin: 4 }}>
               <TextField 
               variant='outlined' 
               label='Group Name' 
               fullWidth
               value={ name }
               onChange={ e => setName(e.target.value) } />
            </Box>
         </DialogContent>
         <DialogActions>
            <Button 
            onClick={ deleteGroup }
            disabled={ 
               name === '' || 
               loading || 
               !Object.values(groups).map(group => group.title).includes(name) ||
               !Object.values(groups).find(group => group.owner === firebaseAuth.currentUser.uid)
            }
            variant='contained' 
            fullWidth 
            color='error'>
               {
                  loading 
                  ? icon
                  : <span>Delete Group!</span>
               }
            </Button>
         </DialogActions>

      </Dialog>
   );
}

const JoinGroupDialog = ({ open, setOpen }) => {

   const [name, setName] = useState('');
   const [icon, setIcon] = useState(<CircularProgress />);
   const [loading, setLoading] = useState(false);
   const groups = useSelector(state => state.groups);


   const joinGroup = async () => {
      setLoading(true);

      const groupID = Object.keys(groups).includes(name) ? name : Object.values(groups).find(group => group.title === name).id;

      const { response, error } = await JoinGroup(groupID);

      if (error) {
         alert("Could not join group", error);
         console.log(error);
      }

      setIcon(<Check />);
      setName("");

      setTimeout(() => {
         setIcon(<CircularProgress />);
         setLoading(false);
      }, 2000);
   }

   const userInGroup = () => {
      const group = groups[name] || Object.values(groups).find(group => group.title === name) || { users: [] }
      return group.users.find(user => user.userID === firebaseAuth.currentUser.uid);
   }



   return (
      <Dialog
         open={ open }
         onClose={ () => setOpen(false) }>

         <DialogTitle>Join a Group!</DialogTitle>
         <DialogContent>
            <DialogContentText>Please provide either the <strong>Group ID</strong> or <strong>Group Name</strong> to join</DialogContentText>
            <Box sx={{ margin: 4 }}>
               <TextField 
               variant='outlined' 
               label='Group Name/ID' 
               fullWidth
               value={ name }
               onChange={ e => setName(e.target.value) } />
            </Box>
         </DialogContent>
         <DialogActions>
            <Button 
            onClick={ joinGroup }
            disabled={ 
               name === '' || 
               loading || 
               (!Object.values(groups).map(group => group.title).includes(name) && !Object.keys(groups).includes(name)) ||
               userInGroup()
            }
            variant='contained' 
            fullWidth 
            color='success'>
               {
                  loading 
                  ? icon
                  : <span>Join Group!</span>
               }
            </Button>
         </DialogActions>

      </Dialog>
   );
}




const CreateGroupDialog = ({ open, setOpen }) => {

   const [name, setName] = useState("");
   const [icon, setIcon] = useState(<CircularProgress />);
   const [loading, setLoading] = useState(false);
   const groups = useSelector(state => state.groups);

   
   
   const createGroup = async () => {
      setLoading(true);

      const { response, error } = await CreateGroup(name);

      if (error) {
         alert("Could not create group", error);
         console.log(error);
      }

      setIcon(<Check />);
      setName("");

      setTimeout(() => {
         setIcon(<CircularProgress />);
         setLoading(false);
      }, 2000);
   }



   return (
      <Dialog
         open={ open }
         onClose={ () => setOpen(false) }>

         <DialogTitle>Create a Group!</DialogTitle>
         <DialogContent>
            <DialogContentText>Please provide the following fields in order to create your group (Creating a group does not automatically join it)</DialogContentText>
            <Box sx={{ margin: 4 }}>
               <TextField 
               variant='outlined' 
               label='Group Name' 
               fullWidth
               value={ name }
               onChange={ e => setName(e.target.value) } />
            </Box>
         </DialogContent>
         <DialogActions>
            <Button 
            onClick={ createGroup }
            disabled={ name === '' || loading || Object.values(groups).map(group => group.title).includes(name) }
            variant='contained' 
            fullWidth 
            color='success'>
               {
                  loading 
                  ? icon
                  : <span>Create Group!</span>
               }
            </Button>
         </DialogActions>

      </Dialog>
   );
}


const ManageGroups = ({ open, setOpen }) => {

   const [createGroup, setCreateGroup] = useState(false);
   const [deleteGroup, setDeleteGroup] = useState(false);
   const [joinGroup, setJoinGroup] = useState(false);
   const [leaveGroup, setLeaveGroup] = useState(false);

   return (  
      <Dialog 
         open={ open } 
         maxWidth='sm' 
         onClose={ () => setOpen(false) }
         TransitionComponent={Transition}>

         <DialogTitle>Manage Groups</DialogTitle>
         <DialogContent>
            <DialogContentText>
               You can manage your groups here and choose to
               <strong> Create</strong>, 
               <strong> Join</strong>, 
               <strong> Leave</strong>, or
               <strong> Delete </strong>
               groups you either own or don't own.
            </DialogContentText>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', margin: '40px 0 20px 0' }}>

               <Tooltip title='Create Group'>
                  <IconButton size='large' className='manage-group-option' onClick={ () => setCreateGroup(true) }>
                     <Edit fontSize='inherit' />
                  </IconButton>
               </Tooltip>

               <Divider orientation='vertical' flexItem />

               <Tooltip title='Join Group'>
                  <IconButton size='large' className='manage-group-option' onClick={ () => setJoinGroup(true) }>
                     <Add fontSize='inherit' />
                  </IconButton>
               </Tooltip>

               <Divider orientation='vertical' flexItem />

               <Tooltip title='Leave Group'>
                  <IconButton size='large' className='manage-group-option' onClick={ () => setLeaveGroup(true) }>
                     <ExitToApp fontSize='inherit' />
                  </IconButton>  
               </Tooltip>

               <Divider orientation='vertical' flexItem />

               <Tooltip title='Delete Group'>
                  <IconButton size='large' className='manage-group-option' onClick={ () => setDeleteGroup(true) }>
                     <Delete fontSize='inherit' />
                  </IconButton>  
               </Tooltip>
            </Box>

         </DialogContent>

         <CreateGroupDialog open={ createGroup } setOpen={ setCreateGroup } />
         <DeleteGroupDialog open={ deleteGroup } setOpen={ setDeleteGroup } />
         <JoinGroupDialog open={ joinGroup } setOpen={ setJoinGroup } />
         <LeaveGroupDialog open={ leaveGroup } setOpen={ setLeaveGroup } />
      </Dialog>
   );
}
 
export default ManageGroups;