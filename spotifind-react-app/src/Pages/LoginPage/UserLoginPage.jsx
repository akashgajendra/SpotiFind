import React from "react";
import Button from '@mui/material/Button';
import { useHistory } from 'react-router';
import LoginPageContainer from "../../Containers/LoginPageContainer/LoginPageContainer";

const UserLoginPage = () => {
   return ( 
      <div className="login-page">
         <LoginPageContainer/>
      </div>
   );
}

 
export default UserLoginPage;