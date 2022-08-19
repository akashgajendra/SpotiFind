import { firestore } from "../firebase";



export const AddAdmin = async (userID, userName) => {

   let response = null, error = null;

   await firestore.collection('admins').doc(userID).set({
      user: userName,
      id: userID
   }).then(res => {
      response = res;
   }).catch(err => {
      error = err;
   })


   return { response, error };
}

export const RemoveAdmin = async (userID) => {
   let response = null, error = null;
   console.log(userID)


   await firestore.collection('admins').doc(userID).delete().then(res => {
      console.log("REMOVED")
      response = res;
   }).catch(err => {
      error = err;
   })

   return { response, error }
}