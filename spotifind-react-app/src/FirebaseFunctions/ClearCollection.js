import { firestore } from "../firebase";


export default async (collection) => {

   let response = null;
   let error = null;


   await firestore.collection(collection).get().then(querySnapshot => {

      querySnapshot.docs.forEach(doc => {

         firestore.collection(collection).doc(doc.id).delete()
         .then(() => {
            console.log("Deleted ", doc.id);
         }).catch((err) => {
            error = err;
         })
      });

   })


   return { response, error };

}