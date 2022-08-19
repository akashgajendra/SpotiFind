// React
import React, { useState } from "react";

// Material UI
import { 
   TextField, 
   Button,
   Card,
   CardContent,
   CardActions,
   Typography,
   Box,
   IconButton,
} from "@mui/material";
import {
   Visibility,
   VisibilityOff,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';


const AddLogin = ({ id, submitFunction, email, password, setEmail, setPassword, setLogin }) => {


   const [showPassword, setShowPassword] = useState(false);
   const toggleVisibility = () => {
      setShowPassword(!showPassword);
   }


    return (  
      <form id={ id && id }>
         <Card className='login-card' sx={{ width: 600 }}>
            <CardContent>
               <Typography sx={{ fontSize: 14 }} textAlign='center' color="text.secondary" gutterBottom>Enter Credentials</Typography>

               <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  "& .user-field": { marginX: 2, marginY: 1.5 }
               }}>
                  <TextField 
                     value={ email }
                     className='user-field'
                     variant='filled'   
                     label='Email'
                     onChange={ (e) => setEmail(e.target.value) } 
                  ></TextField>
                  <TextField 
                  value={ password }
                  className='user-field'
                  variant='filled'   
                  label='Password'
                  InputProps={{
                     endAdornment: showPassword 
                     ? <IconButton onClick={ toggleVisibility }><Visibility /></IconButton> 
                     : <IconButton onClick={ toggleVisibility }><VisibilityOff /></IconButton> 
                  }}
                  type={ showPassword ? 'text' : 'password' }
                  onChange={ (e) => setPassword(e.target.value) } />
                  
               </Box>
            </CardContent>

            <CardActions sx={{ 
               display: 'flex', 
               flexDirection: 'column', 
            }}>
               <Button 
               sx={{ mb: 2 }} 
               onClick={ () => setLogin(false) } 
               variant='text'>Not a user yet? Signup</Button>

               <Button 
               fullWidth
               onClick={ submitFunction } 
               variant='contained' 
               type='submit'
               endIcon={<AddIcon />}>Login</Button>
            </CardActions>
         </Card>
      </form>
   );
}

 
export default AddLogin;