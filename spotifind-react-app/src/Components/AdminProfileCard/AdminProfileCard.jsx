
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



//The admin variable determines whether or not someone is an admin
const AdminProfileCard = ({ img, firstname, lastname, email, id, admin, addAdmin, removeAdmin }) => {
   
   return (  
      <Card sx={{ 
            maxWidth: 370, 
            marginTop: 2, 
            marginLeft: 'auto', 
            marginRight: 'auto' ,
            backgroundColor: 'rgb(55,73,87)',
            color: 'inherit',
         }}>
         <Box sx={{ 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center', 
               padding: '0 20px' 
            }}>
            <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
               }}>
               { 
                  img
                  ? <Avatar src={ img } />
                  : <Avatar sx={{ bgcolor: blue[700] }}>
                     <Person />
                  </Avatar>
               }
               <CardContent>
                  <Typography variant='h6' fontSize="10px">{ firstname } { lastname }</Typography>
                  <Typography variant='subtitle2' fontSize="12px">{ email }</Typography>
               </CardContent>
            </Box>
            
            {
               !admin ?
               <Tooltip title='Make Admin' >
                  <IconButton onClick={ () => addAdmin(id, firstname + " " + lastname) }>
                     <AddCircle sx={{ color: blue[200], width: 30, height: 30 }} />
                  </IconButton>
               </Tooltip> :
               <Tooltip title='Remove Admin' >
                  <IconButton onClick={ () => removeAdmin(id) }>
                     <RemoveCircle sx={{ color: red[200], width: 30, height: 30 }} />
                  </IconButton>
               </Tooltip>

            }
         </Box>
      </Card> 
   );
}
 
export default AdminProfileCard;