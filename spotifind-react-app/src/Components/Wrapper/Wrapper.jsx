// React
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ToggleWrapper, SetWrapper } from "../../Reducers/WrapperReducer";
import { SetSpotifyMetadata, SetFavoriteArtists, SetTopSongs, ResetAPIData } from "../../Reducers/APIData";
import { ResetFriends } from "../../Reducers/FriendsReducer";
import { ResetGroups } from "../../Reducers/GroupsReducer";
import { ResetUsers } from "../../Reducers/UsersReducer";
import { ResetIncomingInvites } from "../../Reducers/IncomingInvites";
import { parseSpotifyResponse, getPlaylists, handleLogin } from '../../API/Spotify';
import { ResetOutgoingInvites } from "../../Reducers/OutgoingInvites";
import { ToggleMode, SetMode } from "../../Reducers/DarkModeReducer";
import { lastfmLink } from '../../API/Lastfm';
import LinkDeezer from '../../Containers/UserConsoleContainer/Link_Deezer'


// Material UI
import { 
   Button,
   Typography,
   Toolbar,
   Box,
   List,
   ListItem,
   ListItemIcon,
   ListItemButton,
   Avatar,
   InputBase,
   Tooltip,
   Dialog, 
   DialogTitle,
   DialogContent, 
   DialogContentText,
   Menu,
   MenuItem,
   Divider,
   TextField,
   InputAdornment,
   IconButton, 
   CircularProgress,
   DialogActions,
} from "@mui/material";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import {
   SupervisorAccount,
   Search,
   Edit,
   Check,
   Close,
   Link,
   Add,
   ExitToApp,
   Mail,
   MailOutline,
   Groups,
   Settings,
   MarkEmailUnread,
   Drafts,
   DriveFolderUpload,
   FileDownload,
   FileUpload,
   ForwardToInbox,
   Forward10,
} from '@mui/icons-material'
import { blue, orange, indigo, lightBlue} from '@mui/material/colors';
import { styled, alpha, createTheme } from '@mui/material/styles';
import './Wrapper.scss';

import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import Autocomplete from '@mui/material/Autocomplete';


// Components
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import ManageGroups from '../ManageGroups/ManageGroups';
import GroupCard from "../GroupCard/GroupCard";
import FileDrop from '../FileDrop/FileDrop';
import GroupInvitations from "../GroupInvitations/OutgoingGroupInvites";
import MyGroupInvites from "../GroupInvitations/MyGroupInvites";
import SearchDialog from "../SearchDialog/SearchDialog";


// Firebase
import { firebaseAuth } from "../../firebase";
import { logoutAuth } from "../../FirebaseFunctions/Auth";
import { JoinGroup, CreateGroup, CreateGroupWithImage, ReadInvite } from "../../FirebaseFunctions/Groups";
import { width } from "@mui/system";



// -=-=-=-=-=-=-=-=- Wrapper Component Styles -=-=-=-=-=-=-=-=- //
const drawerWidth = 74;

const openedMixin = (theme) => ({
   width: drawerWidth,
   transition: theme.transitions.create('width', {
     easing: theme.transitions.easing.sharp,
     duration: theme.transitions.duration.enteringScreen,
   }),
   overflowX: 'hidden',
 });
 
 const closedMixin = (theme) => ({
   transition: theme.transitions.create('width', {
     easing: theme.transitions.easing.sharp,
     duration: theme.transitions.duration.leavingScreen,
   }),
   overflowX: 'hidden',
   width: `calc(${theme.spacing(7)} + 1px)`,
   [theme.breakpoints.up('sm')]: {
     width: `calc(${theme.spacing(9)} + 1px)`,
   },
 });

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
   ({ theme, open }) => ({
     width: drawerWidth,
     flexShrink: 0,
     whiteSpace: 'nowrap',
     boxSizing: 'border-box',
     ...(open && {
       ...openedMixin(theme),
       '& .MuiDrawer-paper': openedMixin(theme),
     }),
     ...(!open && {
       ...closedMixin(theme),
       '& .MuiDrawer-paper': closedMixin(theme),
     }),
   }),
 );

const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'flex-end',
   padding: theme.spacing(0, 1),
   // necessary for content to be below app bar
   ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
   zIndex: theme.zIndex.drawer + 1,
   transition: theme.transitions.create(['width', 'margin'], {
     easing: theme.transitions.easing.sharp,
     duration: theme.transitions.duration.leavingScreen,
   }),
   ...(open && {
     marginLeft: drawerWidth,
   //   width: `calc(100% - ${drawerWidth}px)`,
      width: '100%',
      transition: theme.transitions.create(['width', 'margin'], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   }),
}));




// -=-=-=-=-=-=-=-=- Wrapper Component Styles -=-=-=-=-=-=-=-=- //



const ExploreGroups = ({ open, setOpen }) => {

   const groups = useSelector(state => state.groups);
   const users = useSelector(state => state.users);
   const dark = useSelector(state => state.dark_mode);


   const filterGroups = () => {
      /* Filters the groups to return only groups user has not joined */
      return (groups && users && firebaseAuth.currentUser) 
      ? Object.values(groups).filter(group => group.users.filter(user => user.userID === firebaseAuth.currentUser.uid).length === 0) 
      : []
   }

   const joinGroup = async (groupID) => {
      const { response, error } = await JoinGroup(groupID);
      if (error) alert("ERROR:", error);
   }



   return (
      <Dialog className='explore-groups-dialog' open={ open } onClose={ () => setOpen(false) } maxWidth='lg' sx={{ 
         "& .MuiDialog-paper": { 
            bgcolor: '#1d262d', 
            color: '#bac8d3'
         },
      }}>
         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{ filterGroups().length === 0 ? 'You have joined all groups!' : 'Explore Groups!' }</span>
            <IconButton onClick={ () => setOpen(false) } sx={{ 
               color: dark && '#bac8d3',
               marginLeft: 2,
               marginRight: '-5px',
               "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
            }}>
               <Close />
            </IconButton>
         </DialogTitle>
         <DialogContent>
         <Box sx={{ 
            display: 'flex', 
            flexFlow: 'wrap', 
            justifyContent: 'center', 
            alignItems: 'start' 
         }}>
            {
               filterGroups().map(group => (
                  <GroupCard 
                     group = { group }
                     id={ group.id } 
                     joinGroup={ joinGroup }
                     users={ users }
                  />
               ))
            }
         </Box>
         </DialogContent>
      </Dialog>
   );
}

const CreateGroupDialog = ({ open, setOpen }) => {

   const [name, setName] = useState("");
   const [icon, setIcon] = useState(<CircularProgress />);
   const [loading, setLoading] = useState(false);
   const [file, setFile] = useState(null); 
   const [fileError, setFileError] = useState();
   const groups = useSelector(state => state.groups);
   

   
   
   const createGroup = async () => {
      setLoading(true);

      let response, error;

      if (file) {
         const res = await CreateGroupWithImage(name, file);
         response = res.response;
         error = res.error;
      } else {
         const res = await CreateGroup(name);
         response = res.response;
         error = res.error;
      }
      

      if (error) {
         alert("Could not create group", error);
         console.log(error);
      } 

      setIcon(<Check />);
      setName("");
      setFile(null);
      setFileError("");

      setTimeout(() => {
         setIcon(<CircularProgress />);
         setLoading(false);
      }, 2000);
   }


   const validateFile = (selectedFile) => {
      const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/avif'];
      return selectedFile && acceptedImageTypes.includes(selectedFile['type'])
   };


   const closeDialog = () => {
      setFile(null);
      setOpen(false);
   }



   return (
      <Dialog
         open={ open }
         onClose={ closeDialog }>

         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Create a Group!</span>
            <IconButton onClick={ closeDialog } sx={{ 
               color: '#bac8d3',
               marginLeft: 2,
               marginRight: '-5px',
               "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
            }}>
               <Close />
            </IconButton>
         </DialogTitle>
         <DialogContent>
            <DialogContentText>Please provide the following fields in order to create your group</DialogContentText>
            <Box sx={{ margin: 4 }}>
               <TextField 
               sx={{ mb: 3 }}
               variant='outlined' 
               label='Group Name' 
               fullWidth
               value={ name }
               onChange={ e => setName(e.target.value) } />
               <Typography component='div' variant='body1' mb={1}>Group Image (Optional):</Typography>
               <FileDrop 
               validateFile={ validateFile }
               selectedFile={ file } 
               setSelectedFile={ setFile } 
               id={ 'fileDrop' } 
               error={ fileError } 
               setError={ setFileError }
               />
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


const NavbarMenu = ({ anchorEl, setAnchorEl, options }) => {
   return (
      <Menu
         id='link-menu'
         open={ Boolean(anchorEl) }
         anchorEl={ anchorEl }
         onClose={ () => setAnchorEl(null) }
      >
         {
            options.map(({ title, method, icon }) => (
               <MenuItem onClick={ method }>
                  { icon && <ListItemIcon>{ icon }</ListItemIcon> }
                  { title }
               </MenuItem>
            ))
         }
      </Menu>
   )
}

const LinkMenu = ({ anchorEl, setAnchorEl }) => {

   const handleClose = () => setAnchorEl(null);
   const options = [
      {
         title: 'Spotify', 
         method: () => handleLogin()
      },
      {
         title: 'Deezer Music',
         method: () => LinkDeezer()
      }
   ]



   return (
      <Menu
         id='link-menu'
         open={ Boolean(anchorEl) }
         anchorEl={ anchorEl }
         onClose={ handleClose }
      >
         {
            options.map(({ title, method }) => (
               <MenuItem onClick={ method }>
                  { title }
               </MenuItem>
            ))
         }
      </Menu>
   )
}

const Wrapper = ({ user, children, auth }) => {

   const wrapper           = useSelector(state => state.wrapper);
   const dispatch          = useDispatch();
   const location          = useLocation();
   const history           = useHistory();
   const groups            = useSelector(state => state.groups);
   const users             = useSelector(state => state.users);
   const incomingInvites   = useSelector(state => state.incomingInvites)
   const [groupInvitationEl, setGroupInvitationEl]       = useState(null);
   const [myInvitesEl, setMyInvitesEl]                   = useState(null);
   const [groupsDialog, setGroupsDialog]                 = useState(false);
   const [exploreGroupsDialog, setExploreGroupsDialog]   = useState(false);
   const [createGroupDialog, setCreateGroupDialog]       = useState(false);
   const [searchDialog, setSearchDialog]                 = useState(false);
   const [linkMenu, setLinkMenu]                         = useState(null);
   const [navMenu, setNavMenu]                           = useState(false);
   const [width, setWidth]                               = useState('25ch');
   const [mainHeight, setMainHeight]                     = useState('100vh');

   const label = { inputProps: { 'aria-label': 'Switch demo' } };
   const dark = useSelector(state=>state.dark_mode);
   
   var navbar_color= (dark)? "linear-gradient(90deg, rgba(95,95,246,1) 30%, rgba(179,136,255,1) 100%)":"#0288D1";
   var main_console_color= (dark)? "#1d262d":"#ffffff";

   
   

   const loggoutUser = async () => {
      dispatch(ResetAPIData());
      dispatch(ResetFriends());
      dispatch(ResetGroups());
      dispatch(ResetUsers());
      dispatch(ResetOutgoingInvites());
      dispatch(ResetIncomingInvites());
      await logoutAuth();
   }
   

   const filterGroups = () => {
      if (groups && users && firebaseAuth.currentUser) {
         return Object.values(groups).filter(group => group.users.filter(user => user.userID === firebaseAuth.currentUser.uid).length > 0)
      }
      return []
   }

   const openInvites = async (e) => {
      setMyInvitesEl(e.currentTarget)   // Open menu   

      // Mark invites as read
      const promises = [];
      const pending = incomingInvites['pending']
      Object.keys(pending).forEach(userID => {
         Object.keys(pending[userID]).forEach(groupID => {
            promises.push(ReadInvite(pending[userID][groupID]['docID']))
         })
      })

      // Concurrently execute promises
      Promise.all(promises)
      .then(responses => {
         responses.forEach(({ response, error }) => {
            if (error) alert("ERROR MARKING INVITES AS READ");
         })
      })
   }

   const allMessagesRead = () => {

      const pending = incomingInvites['pending']

      for (const userID of Object.keys(pending)) {
         for (const groupID of Object.keys(pending[userID])) {
            if (!pending[userID][groupID]['read']) return false;
         }
      }

      return true;
   }


   const navMenuOptions = [
      {
         title: 'Sign Out',
         icon: <ExitToApp />,
         method: () => {
            setNavMenu(null);
            loggoutUser();
         }
      },
      {
         title: 'Settings',
         icon: <Settings />,
         method: () => {
            setNavMenu(null);
            history.push('/console/settings');
         }
      }
   ]
  
  
  
   useEffect(async () => {
      
      // -=-=-=-=-=-=-=-=-=-=- Used to render wrapper based on page -=-=-=-=-=-=-=-=-=-=- //
      const paths = window.location.pathname.split('/');
      const pathCount = paths.length;

      switch (pathCount) {
         case 2:

            const route = paths.pop();
            if (route === 'console') {
               dispatch(SetWrapper(true));
               setMainHeight('calc(100vh - 48px)');
            } else {
               dispatch(SetWrapper(false));
               setMainHeight('100vh');
            }

            break;
         case 3: 
            const end = paths.pop();
            if (paths.at(-2) === 'profiles' || end === 'settings' || end === 'admin') {
               dispatch(SetWrapper(true));
               setMainHeight('calc(100vh - 48px)');
            }

            break;
         default:
            setMainHeight('calc(100vh - 48px)');
            break;
      }
      


      if (window.location.hash) {
         
         // Parse the response from spotify
         const { access_token, expires_in, token_type } = parseSpotifyResponse(window.location.hash)
   
         // Update Spotify Metadata
         dispatch(SetSpotifyMetadata({
            accessToken: access_token,
            tokenType: token_type,
            expiresIn: expires_in,
            platforms: 'Spotify',
         }));

         // Get the playlists with new access token
         const { response, error } = await getPlaylists(access_token);
         !error ? dispatch(SetFavoriteArtists(response)) : alert("Error linking:", error);
      }

   }, [location])
   

   return (  
      <Box sx={{ display: 'flex' }}>
         
         
         {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Navbar -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
         {
            wrapper &&
            <AppBar position="fixed" open={ true } sx={{ 
               background: dark 
               ? 'linear-gradient(90deg, rgba(95,95,246,1) 30%, rgba(179,136,255,1) 100%)'
               : 'linear-gradient(90deg, rgba(95,95,246,1) 25%, rgba(0,212,255,1) 100%)',

               
            }}>
               <Toolbar sx={{ 
                  '& *': { border: 'none !important' },
                  '& .css-33etsu-MuiAutocomplete-root': {
                     width: width,
                     transition: '0.3s all',
                  },
                  '& input[type="search"]::-webkit-search-decoration': { display: 'none' },
                  '& input[type="search"]::-webkit-search-cancel-button': { display: 'none' },
                  '& input[type="search"]::-webkit-search-results-button': { display: 'none' },
                  '& input[type="search"]::-webkit-search-results-decoration': { display: 'none' }
               }}>
                  <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }} onClick={ () => history.push('/console')} >
                     Spotifind
                  </Typography>
                  
                  
                  <Typography variant='body2' component='div' sx={{ flexGrow: 1, margin: 2 }}>
                     {/* Changed margin to 2 from 3 due to size of the toggle covering part of groups */}
                     { user && users[user.uid] && users[user.uid].first_name + ' ' + users[user.uid].last_name }
                     
                  </Typography>
                  <Tooltip title='Received invites'>
                     <IconButton onClick={ openInvites } sx={{ 
                        color: '#fff',
                        mr: 1,
                        "&:hover": { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                     }} >
                        {
                           allMessagesRead() 
                           ? <MailOutline />
                           : <MarkEmailUnread />
                        }
                     </IconButton>
                  </Tooltip>
                  <Tooltip title='Sent Invites'>
                     <IconButton onClick={ e => setGroupInvitationEl(e.currentTarget) } sx={{ 
                        color: '#fff',
                        mr: 1,
                        "&:hover": { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                     }} >
                        <ForwardToInbox />
                     </IconButton>
                  </Tooltip>

                  <Box onClick={ () => setSearchDialog(true) } sx={{
                     backgroundColor: 'rgba(255, 255, 255, 0.15)',
                     height: '40px',
                     display: 'flex',
                     justifyContent: 'start',
                     alignItems: 'center',
                     paddingX: 1,
                     marginX: 2,
                     borderRadius: '4px',
                     '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                     },
                     '& input::placeholder': { 
                        color: '#d9d9d9',
                     }
                  }}>
                     <Search sx={{ m: 1 }} />
                     <input type='text' placeholder='Search...' style={{
                        outline: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '1.1em',
                        width: '150px',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                     }}/>
                  </Box>
                  
                  
                  { 
                     user &&
                     <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                     }}>

                        <Tooltip title='Link a platform'>
                           <Button 
                           onClick={ e => setLinkMenu(e.currentTarget) } 
                           sx={{ margin: 1, backgroundColor: "#f7743c"}} 
                           variant='contained' 
                           endIcon={ <Link /> }>Link</Button>
                        </Tooltip>
                        <IconButton onClick={ e => setNavMenu(e.currentTarget) }>
                           { 
                              (user && users[user.uid] && users[user.uid]['img'])
                              ?  <Avatar src={ users[user.uid]['img'] } />
                              :  <Avatar sx={{ bgcolor: orange[500] }}>
                                    { users[user.uid] && users[user.uid].first_name[0] + users[user.uid].last_name[0] }
                                 </Avatar>
                           }
                        </IconButton>
                           
                     </Box>
                  }

                  <NavbarMenu anchorEl={ navMenu } setAnchorEl={ setNavMenu } options={ navMenuOptions } />
                  <LinkMenu anchorEl={ linkMenu } setAnchorEl={ setLinkMenu } />
               </Toolbar>
            </AppBar>
         }

         {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Groups Drawer -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
         {
            wrapper &&
            <Drawer
               variant='permanent'
               open={ true }
               sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  
                  //COLOR CHANGE - 2: Groups bar
                  [`& .MuiDrawer-paper`]: { bgcolor: dark ? 'rgb(55,73,87)' : '#e8e8e8', width: drawerWidth, boxSizing: 'border-box' },
               }}
            >
               <Toolbar />
               <Box sx={{ overflow: 'auto' }} className='groups'>

                  {/* -=-=-=-=-=-=- Groups List in Groups Drawer -=-=-=-=-=-=- */}
                  <List>
                     { filterGroups().map(group => {
                        const { title, id, img } = group;
                        
                        return (
                           <Tooltip key={ id } title={ title } placement='right'>
                              <ListItemButton 
                                 selected={ id === location.pathname.split('/').at(-1) } 
                                 onClick={ () => history.push('/console/' + id) }>
                                 { 
                                    img
                                    ? <Avatar src={ img } />
                                    : <Avatar sx={{ bgcolor: '#5f5ff6' }}>
                                       <SupervisorAccount />
                                    </Avatar>
                                 }
                                 
                              </ListItemButton>
                           </Tooltip>
                        )
                     })}
                     <Tooltip title='Explore Groups' placement='right'>
                        <ListItemButton onClick={ () => setExploreGroupsDialog(true) }>
                           <Avatar sx={{ bgcolor: '#f7743c' }}>
                              <Add />
                           </Avatar>
                        </ListItemButton>
                     </Tooltip>
                     <Tooltip title='Create Group!' placement='right'>
                        <ListItemButton onClick={ () => setCreateGroupDialog(true) }>
                           <Avatar sx={{ bgcolor: 'rgba(179,136,255,1)' }}>
                              <Edit />
                           </Avatar>
                        </ListItemButton>
                     </Tooltip>
                  </List>


               </Box>
            </Drawer>
         }

         {/* -=-=-=-=-=-=- Main section of application (Passes all components through here so navbar/wrapper wraps all components) -=-=-=-=-=-=- */}
         {
            auth.loading === true ? <LoadingScreen message='Loading your profile' /> :
            <Box component="main" sx={{ 
               flexGrow: 1, 
               p: (wrapper ? 3 : 0),
               //COLOR CHANGE - 3 : Main console
               backgroundColor: main_console_color, 
               color: '#bac8d3',
               height: mainHeight,
               overflowY: 'hidden',
            }}>
               { wrapper && <DrawerHeader />}
               { children }
            </Box>
         }

         <MyGroupInvites anchorEl={ myInvitesEl } setAnchorEl={ setMyInvitesEl } />
         <GroupInvitations anchorEl={ groupInvitationEl } setAnchorEl={ setGroupInvitationEl } />
         <ManageGroups open={ groupsDialog } setOpen={ setGroupsDialog } />
         <ExploreGroups open={ exploreGroupsDialog } setOpen={ setExploreGroupsDialog } />
         <CreateGroupDialog open={ createGroupDialog } setOpen={ setCreateGroupDialog } />
         <SearchDialog open={ searchDialog } setOpen={ setSearchDialog } />
         
      </Box>
   );
}
 
export default Wrapper;