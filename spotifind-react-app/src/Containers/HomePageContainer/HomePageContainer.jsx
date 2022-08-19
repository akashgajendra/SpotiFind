// React
import React, { useState } from "react";
import { connect, useDispatch } from 'react-redux';
import { AddUser } from "../../Reducers/UsersReducer";

// Material UI/Styles
import './HomeContainer.scss';

// Components
import AddUserCard from "../../Components/AddUserCard/AddUserCard";
import RecentlyAddedCards from "../../Components/RecentlyAddedCards/RecentlyAddedCards";

// Firebase
import CreateUser from '../../FirebaseFunctions/Users';
import { useHistory } from 'react-router';
import UserConsole from "../../Pages/UserConsole/UserConsole";





const HomePageContainer = (props) => {
   const dispatch = useDispatch();
   const history = useHistory();

   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [userName, setuserName] = useState("");
   const [passWord, setpassWord] = useState("");

   //Loading State to prevent button override
   //const [loading,setLoading]=useState(false)
   const [user, setUser]=useState({})


   const onSubmit_CreateUser = async () => {
      /* Contacts the database to create a user */

      if (!(firstName && lastName && userName && passWord)) {
         alert("Fill out all fields");
         return;
      }

      const user = {
          first_name: firstName,
          last_name: lastName
       }

      const user2={
         user: userName,
         pass: passWord
      }


   }



   
   return ( 
      <div className="home">
         <div className='sub_home'>
         <AddUserCard 
            submitFunction={ onSubmit_CreateUser }
            firstName={ firstName } 
            lastName={ lastName } 
            userName={userName}
            passWord={passWord}
            setFirstName={ setFirstName } 
            setLastName={ setLastName }
            setuserName={ setuserName } 
            setpassWord={ setpassWord }
            
         />

         </div>

      </div>
   );
}


// Gets the users from the Redux Store
const mapStateToProps = (state) => ({ users: state.users });

 
export default connect(mapStateToProps)(HomePageContainer);