// React
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetWrapper } from "../../Reducers/WrapperReducer";
import { SetTopSongs } from "../../Reducers/APIData";



// Material UI/Styles
import {
   Grid,
   Box,
   Paper,
   Divider,
   Card,
   CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Components
import ConsoleColumn from "../../Components/ConsoleColumn/ConsoleColumn";
import ArtistCard from "../../Components/ArtistCard/ArtistCard";
import AdminProfileCard from '../../Components/AdminProfileCard/AdminProfileCard';
import UnblockUserCard from '../../Components/UnblockUserCard/UnblockUserCard';
import spotify from '../../Assets/Spotify.jpg';
import GroupCard from "../../Components/GroupCard/GroupCard";
import img from '../../Assets/VerticalTriangles.jpg';

// Firebase
import { firebaseAuth } from "../../firebase";
import { AddAdmin, RemoveAdmin } from "../../FirebaseFunctions/Admins";
import { GetFollowing, UpdateUserWithId } from '../../FirebaseFunctions/Users';




const Item = styled(Paper)(({ theme }) => ({
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: 'center',
   color: 'inherit',
   backgroundColor: 'rgb(55,73,87)'
 }));




const AdminConsoleContainer = () => {
   const users = useSelector(state => state.users);
   const apiData = useSelector(state => state.apiData);
   const groups = useSelector(state => state.groups);
   const friends = useSelector(state => state.friends);
   const admins = useSelector(state => state.admins);
   const [blocking, setBlocking]                   = useState(false);
   const dispatch = useDispatch();



   const addAdmin = async (id, userName) => {
      const userID = firebaseAuth.currentUser.uid;
      const { response, error } = await AddAdmin( id, userName);
      if (error) alert("ERROR", error);
   }

   const removeAdmin = async (userID) => {
      const { response, error } = await RemoveAdmin(userID);
      if (error) alert("ERROR", error);
   }

   const removeBlock = async (user, blockedID) => {
      setBlocking(true);
      const userID = blockedID

      const loggedInUser = () => users[user];

      const usr = loggedInUser();

      const { response, error } = await UpdateUserWithId(usr.id, {
         blocked: [ ...usr.blocked.filter(id => id !== userID) ]
      })

      if (error) alert("Error blocking:", error);
      setBlocking(false);
   }

   const blockedList = []



   Object.values(users).map(user => {
                     
      const { //get all the users
         id,
         blocked
      } = user;

      

      blocked.map(blockedID => {
         const curBlock = [id,blockedID]
         blockedList.push(curBlock)
         console.log(curBlock)
      })
   })

   

   

   return ( 
      <Box sx={{ flexGrow: 1 }}>
         <Grid container spacing={2}>
            <Grid item md={3}>
               <Item>Give/Remove Admins</Item>
               <ConsoleColumn cards={ 
                  Object.values(users).filter(user => user.id != firebaseAuth.currentUser.uid).map(user => {
                     const { //get all the users
                        first_name,
                        last_name,
                        email,
                        id,
                     } = user;
                     return <AdminProfileCard
                              img={ user['img'] }
                              key={ id }
                              firstname={ first_name } 
                              lastname={ last_name } 
                              email={ email } 
                              id={ id } // Object.keys(admins).includes(id)
                              admin={ Object.keys(admins).includes(id) } //basically whether or not this id is contained in the admins
                              addAdmin={ addAdmin }
                              removeAdmin={ removeAdmin }
                           />
                  })
               } />
            </Grid>
            
            <Grid item md={3}>
               <Item>Unblock Relationships</Item>
               <ConsoleColumn cards={ 
                  
                  blockedList.map(blockedArr => {
                     console.log(blockedArr)
                     return <UnblockUserCard
                           id={ blockedArr[0] }
                           blockedId = {blockedArr[1]}
                           removeBlock = {removeBlock}
                         />
                  })
                  
               } />
            </Grid>
            
         </Grid>
         
      </Box>
      
         
   );
}
 
 
export default AdminConsoleContainer;