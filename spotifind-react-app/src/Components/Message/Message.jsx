
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import {
   Box,
   Avatar, 
   Paper,
} from '@mui/material';
import {
   Person
} from '@mui/icons-material';
import { blue } from '@mui/material/colors';




const Message = ({ right, sender, message, img, senderID }) => {

   const history = useHistory();
   const handleRoute = () => history.push(`/profiles/${senderID}`)
   const dark = useSelector(state => state.dark_mode);

   return right ? 
   <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      alignSelf: 'end', 
      margin: '10px',
      color: '#bac8d3',
   }}>
      <Paper elevation={ 3 } sx={{ padding: '15px', margin: '0 10px', bgcolor: dark && 'rgb(55,73,87)', color: dark && 'inherit' }}>
         <strong>{ sender }</strong>: { message }
      </Paper>
      { 
         img
         ?  <Avatar onClick={ handleRoute } src={ img } sx={{ cursor: 'pointer' }} />
         :  <Avatar onClick={ handleRoute } sx={{ bgcolor: blue[700], cursor: 'pointer' }}>
               <Person />
            </Avatar>
      }
   </Box>
   :  
   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'start', margin: '10px' }}>
      { 
         img
         ?  <Avatar onClick={ handleRoute } src={ img } sx={{ cursor: 'pointer' }} />
         :  <Avatar onClick={ handleRoute } sx={{ bgcolor: blue[700], cursor: 'pointer' }}>
               <Person />
            </Avatar>
      }
      <Paper elevation={ 3 } sx={{ padding: '15px', margin: '0 10px', bgcolor: dark && 'rgb(55,73,87)', color: dark && 'inherit' }}>
         <strong>{ sender }</strong>: { message }
      </Paper>
   </Box>
      
}
 
export default Message;