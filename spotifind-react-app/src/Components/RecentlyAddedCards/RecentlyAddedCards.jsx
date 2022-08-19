import React from 'react';

// Material UI
import { 
   Card,
   Typography,
} from "@mui/material";



const RecentlyAddedCards = ({ users }) => {
   return (  
      <div className="recently-added">
         { users.length > 0 && <Typography textAlign='center' marginTop='20px'>Recently Added:</Typography> }
         { users && users.map(user => {
            const { 
               id,
               first_name, 
               last_name 
            } = user;

            return (
               <Card className='result-card' key={ id }>
                  <Typography sx={{ fontSize: 14 }} textAlign='center' color="text.secondary" gutterBottom>{ first_name }</Typography>
                  <Typography sx={{ fontSize: 14 }} textAlign='center' color="text.secondary" gutterBottom>{ last_name }</Typography>
               </Card>
            )
         })}
      </div>
   );
}
 
export default RecentlyAddedCards;