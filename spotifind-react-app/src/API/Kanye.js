import Axios from 'axios';

export default async () => {

   let quote = null, status = null, statusText = null;


   await Axios.get("https://api.kanye.rest").then(response => {
      console.log(response);
      quote = response.data['quote'];
      status = response['status'];
      statusText = response['status'];
   }).catch(err => {
      console.log("ERROR IN KANYE: ", err);
   })

   return { quote, status, statusText };

}