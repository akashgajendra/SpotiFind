

import {
   Card,
   CardTitle,
   CardContent,
   CardMedia,
   CardActions,
   Box,
   IconButton,
   Button,
   Typography,
} from '@mui/material';
import {
   SkipPrevious,
   PlayArrow,
   SkipNext,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import img from '../../Assets/AquaBackground.jpg'




const GroupCard = ({ id, joinGroup, group, users }) => {
   const theme = useTheme();

   const userCount = () => {
      const count = group.users.length;
      if (count === 0) return 'No Users';
      else if (count === 1) return '1 User';
      else return count + ' Users';
   }
   

   return (  
      <Card sx={{ 
         display: 'flex', 
         margin: 2, 
         backgroundColor: 'rgb(55,73,87)', 
         color: 'inherit',
      }}>
         {
            group.img ? 
            <CardMedia
               component="img"
               sx={{ width: 151 }}
               image={ group.img }
            /> :
            <CardMedia
               component="img"
               sx={{ width: 151 }}
               image={ img }
            />
         }
         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
               <Typography component="div" variant="h4">{ group.title }</Typography>
               <Typography variant="subtitle1" component="div">
                  Owner: { users[group.owner].first_name + ' ' + users[group.owner].last_name }
               </Typography>
               <Typography variant="subtitle1" component="div">
                  { userCount() }
               </Typography>
            </CardContent>
            <CardActions>
               <Button onClick={ () => joinGroup(id) } sx={{ 
                  color: '#f7743c',
                  "&:hover": { backgroundColor: 'rgba(247, 116, 60, 0.1)' } 
               }}
               >Join</Button>
            </CardActions>
         </Box>
         
      </Card>
   );
}
 
export default GroupCard;