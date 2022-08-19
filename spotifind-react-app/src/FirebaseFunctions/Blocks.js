import { firestore } from "../firebase";


export const RemoveAdmin = async (userID, blockedID) => {
   let response = null, error = null;
   console.log(userID + " has blocked " + blockedID)


   await firestore.collection('users').doc(userID).delete().then(res => {
      console.log("REMOVED")
      response = res;
   }).catch(err => {
      error = err;
   })

   return { response, error }
}