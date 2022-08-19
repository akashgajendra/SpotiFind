import { Route, Redirect } from 'react-router-dom';


const PublicRoute = ({ component: Component, authenticated, path, ...rest }) => {
   return (  
      <Route
         {...rest}
         render={(props) => authenticated === false
         ? <Component {...props} />
         : <Redirect to={ path } />}
      />
   );
}
 
export default PublicRoute;