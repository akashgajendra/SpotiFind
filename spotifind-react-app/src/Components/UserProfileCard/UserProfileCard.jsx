
import {
   Card, 
   CardContent,
   CardActionArea,
   CardActions,
   CardMedia, 
   Button,
   Tooltip,
   Typography,
   Avatar,
   IconButton,
   Box,
} from '@mui/material';
import {
   AddCircle,
   RemoveCircle,
   Person,
} from '@mui/icons-material';
import { blue, red } from '@mui/material/colors';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'



const UserProfileCard = ({ img, firstname, lastname, email, id, friend, addFriend, removeFriend }) => {
   const dark = useSelector(state => state.dark_mode)
   var profile_card_bg = dark ? "rgb(55,73,87)" : "#fff";
   var font_color = dark ? "" : "black";


   const history = useHistory();

   const handleRoute = () => history.push(`/profiles/${id}`)

   return (  
      <Card elevation={ 3 } sx={{ 
            width: 325, 
            marginTop: 2, 
            marginLeft: 'auto', 
            marginRight: 'auto' ,
            backgroundColor: profile_card_bg,
            color: 'inherit',
         }}>
         <Box sx={{ 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center',
            }}>
            <CardActionArea onClick={ handleRoute }>
               <Box sx={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'start',
                     pl: '20px',
                     position: 'relative',
                  }}>
                  { 
                     img
                     ? <Avatar src={ img } />
                     : <Avatar sx={{ bgcolor: blue[700] }}>
                        <Person />
                     </Avatar>
                  }
                  <CardContent sx={{ 
                     width: '160px', 
                     whiteSpace: 'nowrap',
                     overflow: 'hidden',
                     display: 'block',
                     textOverflow: 'ellipsis',
                     }}>
                     <Typography variant='h6' color={font_color}>{ firstname } { lastname }</Typography>
                     <Typography variant='subtitle2' color={font_color}>{ email }</Typography>
                  </CardContent>
               </Box>
            </CardActionArea>
            {
               !friend ?
               <Tooltip title='Follow'>
                  <IconButton sx={{ marginX: '8px' }} onClick={ () => addFriend(id) }>
                     <AddCircle sx={{ color: blue[200], width: 30, height: 30 }} />
                  </IconButton>
               </Tooltip> :
               <Tooltip title='Unfollow'>
                  <IconButton sx={{ marginX: '8px' }} onClick={ () => removeFriend(id) }>
                     <RemoveCircle sx={{ color: red[200], width: 30, height: 30 }} />
                  </IconButton>
               </Tooltip>
            }
         </Box>
      </Card> 
   );
}
 
export default UserProfileCard;