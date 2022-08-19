
// React
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// Material UI
import {
   Box,
   Typography,
   Card, 
   CardContent,
   CardActionArea,
   CardActions,
   CardMedia, 
   IconButton,
   CardHeader,
   Avatar
} from '@mui/material';
import {
   MyLocation,
   PermIdentity,
   Person,
} from '@mui/icons-material';

import { firebaseAuth } from '../../firebase';

// Leaflet
import { MapContainer, Marker, Popup, Tooltip, TileLayer, useMap, useMapEvent } from 'react-leaflet'




const ProfileMarker = ({ user, show }) => {

   const history = useHistory();
   const goToProfile = () => history.push(`/profiles/${user.id}`);

   return (
      <Marker 
      position={ user.coords } 
      riseOnHover 
      eventHandlers={{ click: () => goToProfile() }}
      className='hide'
      class='hide'
      >
         <Tooltip permanent={show} key={`${user.id}-${show}`}>
            <Card elevation={0} sx={{ borderRadius: '8px' }}>
               <CardHeader
               avatar={
                  user['img'] 
                  ? <Avatar sx={{ width: 50, height: 50 }} src={ user['img'] } />
                  : <Avatar sx={{ width: 50, height: 50 }} />
               }
               title={ user.first_name + ' ' + user.last_name + `${user['allowLocation'] ? '' : ' (Hidden)' }` }
               subheader={ user.username }
               />
            </Card>
         </Tooltip>
      </Marker>
   )
}

const CenterMap = ({ center, zoom }) => {
   const map = useMap();
   const centerMap = () => map.flyTo(center, zoom)

   return (
      <IconButton onClick={ centerMap }>
         <MyLocation />
      </IconButton>
   )
}


const UserMapContainer = ({}) => {
   
   const users = useSelector(state => state.users);
   const user = () => users[firebaseAuth.currentUser.uid];
   const [showProfiles, setShowProfiles] = useState(false);
   const hiddenUser = (usr) => {
      if (usr.blocked.includes(user().id))   return false;
      if (usr.id !== user().id)              return usr['allowLocation']

      return true;
   }

   return user() ? (  
      <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', position: 'relative' }}>
         
         <MapContainer center={ user()['coords'] || [0, 0] } zoom={ user()['coords'] ? 8 : 4 } >


            <Box sx={{
               position: 'absolute',
               top: 80,
               left: 7,
               zIndex: 10000,
               display: 'flex',
               flexDirection: 'column',
               '& svg': { fill: 'black' }
            }}>
               <IconButton onClick={ () => setShowProfiles(!showProfiles) }>
                  { !showProfiles ? <PermIdentity /> : <Person /> }
               </IconButton>
               <CenterMap center={ user()['coords'] || [0, 0] } zoom={ user()['coords'] ? 8 : 4 } />
            </Box>


            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
               Object.values(users).map(usr => usr['coords'] && hiddenUser(usr) && (
                  <ProfileMarker show={ showProfiles } user={ usr } />
               ))
            }
            
         </MapContainer>
      </Box>
   ) : (
      <h2>Loading...</h2>
   )
}
 
export default UserMapContainer;