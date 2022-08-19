// React
import { useState } from 'react';
import { useSelector } from 'react-redux';

// Material UI
import { 
   Toolbar,
   IconButton,
   Tooltip,
} from '@mui/material';
import {
   Close,
   Home,
   Map,
} from '@mui/icons-material';

// Containers 
import UserConsoleContainer from "../../Containers/UserConsoleContainer/UserConsoleContainer";
import UserMapContainer from "../../Containers/UserMapContainer/UserMapContainer";




const UserConsole = () => {

   const [page, setPage] = useState(0);
   const dark = useSelector(state => state.dark_mode);

   const toolbarIcons = [
      {
         tooltip: 'Console',
         icon: <Home />,
      },
      {
         tooltip: 'Map',
         icon: <Map />,
      }
   ]

   return ( 
      <div className="login-console">
         <Toolbar sx={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            bgcolor: dark ? 'rgb(55,73,87)' : '#fff',
            boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            minHeight: 'unset !important',
            paddingY: '4px',
            zIndex: 10000
         }}>
            {
               toolbarIcons.map(({ tooltip, icon }, i) => (
                  <Tooltip title={ tooltip }>
                     <IconButton onClick={ () => setPage(i) } sx={{ 
                        marginX: '5px',
                        color: dark && '#bac8d3',
                        bgcolor: page === i && 'rgba(144, 202, 249, 0.3)',
                        "&:hover": { bgcolor: dark && 'rgba(186, 216, 211, 0.1)' }
                     }}>
                        { icon }
                     </IconButton>
                  </Tooltip>
               ))
            }
         </Toolbar>
         { page === 0 && <UserConsoleContainer/> }
         { page === 1 && <UserMapContainer /> }
      </div>
   );
}
 
export default UserConsole;