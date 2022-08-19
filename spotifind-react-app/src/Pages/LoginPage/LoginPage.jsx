import React from "react";
import Button from '@mui/material/Button';
import { useHistory } from 'react-router';

const LoginPage = () => {
   const history = useHistory();


   return ( 
      <div className="login">
         <div className="sub_login">
            <h2>Login</h2>
            <Button onClick={ () => history.push("/home") } variant='outlined'>Go To Home</Button>
         </div>
      </div>


   );
}

 
export default LoginPage;