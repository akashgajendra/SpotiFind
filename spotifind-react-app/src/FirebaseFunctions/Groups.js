import { firestore, firebaseAuth, firebaseStorageRef } from '../firebase';



export const SendMessage = async (groupID, message) => {

   let response = null, error = null;

   const senderID = firebaseAuth.currentUser.uid;
   const senderName = firebaseAuth.currentUser.displayName || firebaseAuth.currentUser.email;
   const timestamp = Date.now();
   const msg = { sender: senderName, message, senderID, timestamp }


   await firestore.collection('groups').doc(groupID).collection('messages').add(msg).then(res => {
      response = res;
   }).catch(err => {
      error = err;
   })


   return { response, error }
}


export const JoinGroup = async (groupID) => {

   let response = null, error = null;
   const id = firebaseAuth.currentUser.uid;

   await firestore.collection('groups').doc(groupID).collection('users').doc(id).set({
      id
   }).then(res => {
      response = res;
   }).catch(err => {
      error = err;
   })

   return { response, error };
} 


export const CreateGroup = async (groupName) => {

   let response = null, error = null;
   const userUID = firebaseAuth.currentUser.uid;

   // Make group
   await firestore.collection('groups').add({
      title: groupName,
      owner: userUID,
      img: null,
      imgPath: null,
   }).then(res => {
      response = res;
   }).catch(err => {
      error = err;
   })

   // Join Group (By Default)
   await firestore.collection('groups').doc(response.id).collection('users').add({
      id: userUID,
   }).catch(err => {
      error = err;
   })

   return { response, error }
}

export const CreateGroupWithImage = async (groupName, img) => {

   let response = null, error = null;
   let downloadURL = null;
   const path = 'groupImages/' + groupName + '.' + img.name.split('.').pop().toLowerCase();
   const userUID = firebaseAuth.currentUser.uid;


   // Upload image
   await firebaseStorageRef.child(path).put(img)
   .then(async res => {
      await res.ref.getDownloadURL().then(url => downloadURL = url);
   })
   .catch(err => error = err)

   if (error) return { response, error }

   // Make group
   await firestore.collection('groups').add({
      title: groupName,
      owner: userUID,
      img: downloadURL,
      imgPath: path,
   })
   .then(res => response = res)
   .catch(err => error = err)

   if (error) return { response, error }

   // Join Group (By Default)
   await firestore.collection('groups').doc(response.id).collection('users').add({
      id: userUID,
   }).catch(err => error = err)

   return { response, error }
}



export const DeleteGroup = async (groupID, imgPath) => {

   console.log("CHECKPOINT 0")

   let response = null, error = null;
   console.log(groupID);
   const ref = firestore.collection('groups').doc(groupID);
   console.log("CHECKPOINT 0.5")

   // Delete Messages subcollection
   await ref.collection('messages').get().then(snapshot => {
      snapshot.forEach(doc => {
         ref.collection('messages').doc(doc.id).delete().catch(err => error = err);
      })
   })
   console.log("CHECKPOINT 1")

   // Delete Users subcollection
   await ref.collection('users').get().then(snapshot => {
      snapshot.forEach(doc => {
         ref.collection('users').doc(doc.id).delete().catch(err => error = err);
      })
   })

   console.log("CHECKPOINT 2")


   // Delete image if applicable
   if (imgPath) {
      await firebaseStorageRef.child(imgPath).delete().catch(err => error = err);
   }
   console.log("CHECKPOINT 3")


   // Delete group
   await ref.delete()
   .then(res => response = res)
   .catch(err => error = err)
   console.log("CHECKPOINT 4")


   return { response, error };
}


export const UpdateGroup = async (groupID, group) => {

   let response = null, error = null;

   await firestore.collection('groups').doc(groupID).set(group, { merge: true })
   .then(res => response = res)
   .catch(err => error = err)

   return { response, error }
}



export const LeaveGroup = async (groupID, docID) => {
   
   let response = null, error = null;

   await firestore.collection('groups').doc(groupID).collection('users').doc(docID).delete().then(res => {
      response = res;
   }).catch(err => {
      error = err;
   });

   return { response, error };
}



export const SendGroupInvite = async (invitedID, groupID) => {
   
   let response = null, error = null;

   await firestore.collection('group-invitations').add({
      inviter: firebaseAuth.currentUser.uid,
      invited: invitedID,
      groupID: groupID,
      status: 'pending',
      read: false,
   })
   .then(res => response = res)
   .catch(err => error = err)

   return { response, error };
}


export const ReadInvite = async (inviteID) => {
   let response = null, error = null;

   await firestore.collection('group-invitations').doc(inviteID).set({
      read: true
   }, { merge: true })
   .then(res => response = res)
   .catch(err => error = err)

   return { response, error };
}


export const UnsendInvite = async (inviteID) => {

   let response = null, error = null;

   await firestore.collection('group-invitations').doc(inviteID).delete()
   .then(res => response = res)
   .catch(err => error = err)

   return { response, error };
}

export const AcceptInvite = async (docIDs, groupID) => {

   let response = null, error = null;

   // Generate promises
   const promises = [...docIDs].map(docID => {
      return firestore.collection('group-invitations').doc(docID).set({
         status: 'accepted'
      }, { merge: true })
   })

   // Concurrently execute promises
   await Promise.all(promises)
   .catch(err => error = err);

   // Join the group
   await firestore.collection('groups').doc(groupID).collection('users').add({
      id: firebaseAuth.currentUser.uid,
   }).then(res => {
      response = res;
   }).catch(err => {
      error = err;
   })

   return { response, error };
}



export const DeclineInvite = async (inviteID) => {
   
   let response = null, error = null;

   await firestore.collection('group-invitations').doc(inviteID).set({
      status: 'declined'
   }, { merge: true })
   .then(res => response = res)
   .catch(err => error = err)

   return { response, error };
}


export const DismissInvite = async (inviteID) => {

   let response = null, error = null;

   await firestore.collection('group-invitations').doc(inviteID).delete()
   .then(res => response = res)
   .catch(err => error = err)

   return { response, error };
}