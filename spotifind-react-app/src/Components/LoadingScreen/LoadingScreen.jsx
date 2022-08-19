import {
   LinearProgress,
   Box,
   Typography,
} from '@mui/material';

const LoadingScreen = ({ message }) => {
   return (  
      <Box sx={{ 
         width: '100vw', 
         height: '100vh', 
         display: 'flex', 
         flexDirection: 'column',
         alignItems: 'center', 
         justifyContent: 'center' 
      }}>
         <Typography variant='h4' mb={4}>{ message }</Typography>
         <Box sx={{ width: '50%' }}>
            <LinearProgress />
         </Box>
      </Box>
   );
}
 
export default LoadingScreen;