// React
import React, { useState, useEffect } from "react";
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { AddUser } from "../../Reducers/UsersReducer";



// Material UI/Styles
import {
   DialogContentText,
   Box,
   Grid, 
   TextField,
   Typography,
   Dialog, 
   DialogActions,
   DialogContent,
   DialogTitle,
   Button,
} from '@mui/material';
import { 
   CheckCircleOutline,
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import './LoginPageContainer.scss';


// Components
import AddLogin from "../../Components/AddLogin/AddLogin";
import AddUserCard from "../../Components/AddUserCard/AddUserCard";
import DialogAlert from "../../Components/DialogAlert/DialogAlert";

// Firebase
import { direct_login, SignupUser } from "../../FirebaseFunctions/Auth";
import { SetWrapper } from "../../Reducers/WrapperReducer";

// API
import GetKanye from '../../API/Kanye';



// Used in the Singup User dialog popup
const Content = () => {
   return ( 
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
         <CheckCircleOutline sx={{ color: green[300], width: 60, height: 60 }} />
         <DialogContentText textAlign='center' marginTop='15px'>Your new account has been successfully created. Please head to your new console!</DialogContentText>
      </Box>
   );
}
 


const LoginPageContainer = () => {
   const history = useHistory();
   
   const [email, setEmail]             = useState("");
   const [password, setPassword]       = useState("");
   const [login, setLogin]             = useState(true);
   const [open, setOpen]               = useState(false);
   const [quote, setQuote]             = useState("");



   const goToConsole = () => {
      history.push('/console');
   }
   const goToTutorial = () => {
      history.push('/tutorial');
   }

   const loginUser = async (e) => {
      /* Logs a user into the site */
      e.preventDefault();

      if (!(email && password)) {
         alert("Fill out both fields");
         return;
      }


      const { response, error } = await direct_login(email, password);

      // Handle action
      if (!error) {
         history.push('/console');
      } else {
         alert("Wrong credentials", error);
      }
   }

   const getKanye = async () => {
      const { quote, status, statusText } = await GetKanye();
      if (status != 200) {
         alert(statusText);
         return;
      }
      setQuote(quote);
   }


   useEffect(() => {
      getKanye();
   }, [])
   
   return ( 
      <div className="login">

         <Dialog open={ open }>
            <DialogTitle>Go To Console</DialogTitle>
            <DialogContent>
               <Content />
            </DialogContent>
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
               <Button variant='outlined' onClick={ goToConsole }>Continue to Console</Button>
               <Button variant='outlined' color='success' onClick={ goToTutorial }>Go to Tutorial First!</Button>
            </DialogActions>
         </Dialog>


         <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={12} md={12} lg={6} sx={{ 
               display: 'flex', 
               justifyContent: 'center', 
               alignItems: 'center',
               padding: 6,
            }}>
               <Box sx={{
                  display: 'flex',
                  alignItems: 'center', 
                  flexDirection: 'column',
                  color: '#fff',
               }}>
                  <Typography variant='h4' sx={{
                     fontFamily: "'Oswald', sans-serif",
                     fontWeight: 200,
                     '& > span': { fontWeight: 400, fontSize: '1.2em'},
                     mb: 2,
                  }}>Discover how <span>Spotifind</span> can help you</Typography>
                  
                  <div className="expandableDivider" />

                  <Typography sx={{
                     fontSize: '1.2em',
                     textAlign: 'center',
                     mt: 3,
                  }}>Spotifind aims to connect you with others based on musical taste and preference. We provide you a social platform to branch out and share, discuss, and interact with your favorite music artists from various music streaming platforms. Follow other users you'd like to keep in touch with, see who you share common groups with, explore others in your surrounding area, and more! </Typography>

                  <div className="kanye">
                     <Typography sx={{
                        mt: 7,
                        fontSize: '1.6em',
                        fontFamily: "'Bebas Neue', cursive",
                        textAlign: 'center',
                     }}>
                        { quote }
                     </Typography>
                     <Typography>
                        —  Kanye West  —
                     </Typography>
                  </div>
                  
               </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} sx={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
            }}>
               {
                  login ?
                  <AddLogin 
                     reference
                     email={ email }
                     password={ password }
                     setEmail={ setEmail }
                     setPassword={ setPassword }
                     setLogin={ setLogin } 
                     submitFunction={ loginUser }
                  /> :
                  <AddUserCard login={ !login } setLogin={ setLogin } setSuccessDialog={ setOpen } />
               }
               
            </Grid>
         </Grid>




         
         

      </div>
   );
}


// Gets the users from the Redux Store
const mapStateToProps = (state) => ({ users: state.users });

export default connect(mapStateToProps)(LoginPageContainer);