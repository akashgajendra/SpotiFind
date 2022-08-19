import { firestore } from "../firebase";


export const CreateUser = async (user) => {

   let response = null, error = null;
   
   await firestore.collection('users').add(user)
   .then(() => {     // Runs once firestore finishes (Asynchronous Action)
      response = user;
   }).catch((err) => {
      error = err;
   })

   return { response, error };

}


export const AddFriend = async (friendID, userID) => {

   let response = null, error = null;

   await firestore.collection('friends').add({
      friend1: userID,
      friend2: friendID,
   }).then(res => {
      response = res;
   }).catch(err => {
      error = err;
   })


   return { response, error };
}

export const RemoveFriend = async (relationshipID) => {
   let response = null, error = null;
   console.log(relationshipID)


   await firestore.collection('friends').doc(relationshipID).delete().then(res => {
      console.log("REMOVED")
      response = res;
   }).catch(err => {
      error = err;
   })

   return { response, error }
}



export const UpdateUser = async (user) => {

   let response = null, error = null;

   await firestore.collection('users').doc(user.id).set(user, { merge: true })
   .then(res => response = res)
   .catch(err => error = err);

   return { response, error }
}

export const UpdateUserWithId = async (userID, updates) => {
   
   let response = null, error = null;

   await firestore.collection('users').doc(userID).set(updates, { merge: true })
   .then(res => response = res)
   .catch(err => error = err);

   return { response, error }

}

export const GetFollowing = async (userID) => {
   let response = [], error = null;

   await firestore.collection('friends').where('friend1', '==', userID).get()
   .then(querySnapshot => {
      querySnapshot.forEach(doc => response.push({ docID: doc.id, ...doc.data() }))
   })
   .catch(err => error = err);

   return { response, error };
}
