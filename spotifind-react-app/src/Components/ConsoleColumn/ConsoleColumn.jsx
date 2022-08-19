
import {
   Box,
} from '@mui/material';

import './ConsoleColumn.scss';




const ConsoleColumn = ({ cards }) => {
   return (  
      <Box sx={{ flexGrow: 1, padding: '10px' }} className='console-column'>
         { cards && cards.map(val => (
            val
         ))}
      </Box>
   );
}
 
export default ConsoleColumn;