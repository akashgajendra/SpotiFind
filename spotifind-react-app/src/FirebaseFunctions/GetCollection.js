

import { firestore } from '../firebase';


export default async (collection) => {
   /*
      This function will get all documents from
      a given collection
   */
   
   let error = null, response = null;

   const snapshot = await firestore.collection(collection).get()
   .catch(err => {
      error = err;
   })

   if (!error) response = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));

   return { response, error };
}