// React
import React, { useState } from "react";

// Material UI
import { 
   TextField, 
   Button,
   Card,
   CardContent,
   CardActions,
   Box,
   IconButton,
   Typography,
   Slider,
   Dialog,
   DialogActions,
   DialogContent,
   DialogContentText,
   DialogTitle,
} from "@mui/material";
import {
   Visibility,
   VisibilityOff,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

// Components
import FileDrop from '../FileDrop/FileDrop';

// Firebase
import { SignupUser, SignupUserWithImage } from "../../FirebaseFunctions/Auth";





const AddUserCard = ({ setLogin, setSuccessDialog }) => {


   const [file, setFile]                  = useState(null);
   const [fileError, setFileError]        = useState("");
   const [email, setEmail]                = useState("");
   const [username, setUsername]          = useState("");
   const [password, setPassword]          = useState("");
   const [firstname, setFirstname]        = useState("");
   const [lastname, setLastname]          = useState("");
   const [age, setAge]                    = useState(0);
   const [showPassword, setShowPassword]  = useState(false);

   const toggleVisibility = () => {
      setShowPassword(!showPassword);
   }

   const signupUser = async () => {

      if (!(firstname && lastname && username && password && email) && !fileError) {
         alert("Fill out all fields");
         return;
      }
      const { response, error } = file 
      ? await SignupUserWithImage(email, username, password, firstname, lastname, age, file)
      : await SignupUser(email, username, password, firstname, lastname, age); 

      !error ? setSuccessDialog(true) : alert('Could not create user', error);
   }  



   return (  
      <Card className='user-card'>
         <CardContent>
            <Typography sx={{ fontSize: 14 }} textAlign='center' color="text.secondary" gutterBottom>Create Your Account</Typography>
            <Box sx={{ 
               display: 'flex', 
               flexDirection: 'column',
               "& .user-field": { marginX: 2, marginY: 1.5 }
            }}>
               <TextField 
               value={ firstname }
               className='user-field'
               variant='filled'   
               label='First Name'
               onChange={ (e) => setFirstname(e.target.value) } />
               
               <TextField
               value={ lastname }
               className='user-field'
               variant='filled'   
               label='Last Name'
               onChange={ (e) => setLastname(e.target.value) } />

               <TextField 
               className='user-field'
               type='number' 
               variant='outlined'
               label='Age'
               value={ age }
               onChange={ e => setAge(e.target.value) } />
                     

               

               <Box sx={{
                  display: 'flex', 
               }}>
                  <Box sx={{
                     display: 'flex', 
                     flexDirection: 'column',
                     width: '60%'
                  }}>
                     <TextField 
                     value={ email }
                     className='user-field'
                     variant='filled'   
                     label='Email'
                     onChange={ (e) => setEmail(e.target.value) } />
                     <TextField 
                     value={ username }
                     className='user-field'
                     variant='filled'   
                     label='Username'
                     onChange={ (e) => setUsername(e.target.value) } />
                        
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
                  <Box sx={{
                     width: '40%',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     flexDirection: 'column',
                  }}>
                     <Typography sx={{ color: '#adadad' }}>Profile Picture</Typography>
                     <FileDrop 
                     width='80%'
                     selectedFile={ file }
                     setSelectedFile={ setFile }
                     validateFile={ () => true }
                     id={ 'user-signup-image' }
                     error={ fileError }
                     setError={ setFileError }
                     padding={ fileError || file ? '20px 20px' : '40px 20px'}
                     />
                  </Box>
               </Box>
               
               

            </Box>
         </CardContent>

         <CardActions sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            "> *": { marginBottom: '15px' } 
         }}>

            <Button 
            sx={{ mb: 2 }} 
            onClick={ () => setLogin(true) } 
            variant='text'>Already a user? Login instead</Button>

            <Button 
            onClick={ signupUser } 
            fullWidth 
            variant='contained' 
            endIcon={ <AddIcon /> }>Create User</Button>

         </CardActions>
      </Card>
   );
}
 
export default AddUserCard;