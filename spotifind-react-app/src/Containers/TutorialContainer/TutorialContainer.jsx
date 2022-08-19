// React
import { useHistory } from "react-router";


// Material UI
import { 
   Button,
   Typography,
   Toolbar,
   Box,
   Avatar,
   InputBase,
   Tooltip,
   Dialog, 
   DialogTitle,
   DialogContent, 
   DialogContentText,
   Menu,
   MenuItem,
   Grid,
   Divider,
   TextField,
   InputAdornment,
   IconButton, 
   CircularProgress,
} from "@mui/material";
import {
   Add,
   Edit,
   Search,
   Map,
   Home,
   Close,
} from '@mui/icons-material';
import {
   orange,
} from "@mui/material/colors";


import './TutorialContainer.scss';


const TutorialContainer = ({}) => {

   const history = useHistory();

   return (  
      <div className='tutorial-container'>
         <h2 className='tutorial-header'>Spotifind Tutorial</h2>

         <div className='extended-divider' />

         <div className='section'>
            <div className="example">
               <Button variant='contained' color='warning'>Link</Button>
            </div>
            <div className="description">
               <h2 className="section-header">Link</h2>
               <p>The link button provides you the means to explore your own favorite artists, provided by the platforms you love. We pull your analytics (After you authenticate yourself) from the selected music streaming platform and bring it all to one central hub just for you!</p>
            </div>

         </div>
         <div className='section'>
            
            <div className="description">
               <h2 className="section-header">Groups</h2>
               <p>Groups are your main avenue of interaction and connection with other users with similar interests! Check out the Explore Groups area to browse groups you have not joined yet, or create your own new group to talk about whatever you want!</p>
            </div>
            <div className="example">
               <Tooltip title="Explore Groups">
                  <IconButton sx={{ mr: 3 }}>
                     <Avatar sx={{ bgcolor: '#f7743c' }}>
                        <Add />
                     </Avatar>
                  </IconButton>
               </Tooltip>
               <Tooltip title="Create Group">
                  <IconButton>
                     <Avatar sx={{ bgcolor: 'rgba(179,136,255,1)' }}>
                        <Edit />
                     </Avatar>
                  </IconButton>
               </Tooltip>
            </div>

         </div>
         <div className='section'>
            <div className="example">
               <Box sx={{
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
            </div>
            <div className="description">
               <h2 className="section-header">Search</h2>
               <p>From our global search bar, you are able to search for any users or groups you are interested in! You can search for users by username or first and last name, and you can search for groups by their titles.</p>
            </div>

         </div>
         <div className='section'>
            <div className="description">
               <h2 className="section-header">Profile</h2>
               <p>Your profile icon at the top of the site grants you access to your settings page and lets you sign out. Your settings page allows you to partially or completely conceal your location, set a dark or light mode, and more!</p>
            </div>
            <div className="example">
               <Tooltip title='Profile Icon'>
                  <IconButton>
                     <Avatar sx={{ bgcolor: orange[500] }}>
                        JS
                     </Avatar>
                  </IconButton>
               </Tooltip>
            </div>

         </div>
         <div className='section'>
            <div className="example">
               <Toolbar sx={{
                  bgcolor: 'rgb(55,73,87)',
                  boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  minHeight: 'unset !important',
                  paddingY: '4px',
               }}>
                  <Tooltip title='Console'>
                     <IconButton sx={{ 
                        marginX: '5px',
                        color: '#bac8d3',
                        "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
                     }}>
                        <Home />
                     </IconButton>
                  </Tooltip>
                  <Tooltip title='Map'>
                     <IconButton sx={{ 
                        marginX: '5px',
                        color: '#bac8d3',
                        "&:hover": { bgcolor: 'rgba(186, 216, 211, 0.1)' }
                     }}>
                        <Map />
                     </IconButton>
                  </Tooltip>
               </Toolbar>
            </div>
            <div className="description">
               <h2 className="section-header">Navigation</h2>
               <p>From the bottom right of your console, you will notice some more options. These allow you to navigate between your main console and the location services. In the map, you will be able to see yourself and other users near you!</p>
            </div>

         </div>

         <div className='exit'>
            <Button variant='contained' color='success' onClick={ () => history.push('/console') }>I'm Good to Go!</Button>
         </div>

         
      </div>
   );
}
 
export default TutorialContainer;