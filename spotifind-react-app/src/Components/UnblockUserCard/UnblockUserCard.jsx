
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
const UnblockUserCard = ({ id, blockedId, removeBlock}) => {
   console.log(id + " has blocked " + blockedId)
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
               <CardContent>
                  <Typography variant='h6' fontSize="10px">{id } { blockedId}</Typography>
               </CardContent>
            </Box>
            
            {
               <Tooltip title='Remove Block' >
                  <IconButton onClick={ () => removeBlock(id, blockedId) }>
                     <RemoveCircle sx={{ color: red[200], width: 30, height: 30 }} />
                  </IconButton>
               </Tooltip>
            }
         </Box>
      </Card> 
   );
}
 
export default UnblockUserCard;