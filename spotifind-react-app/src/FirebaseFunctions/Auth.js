// Import the functions you need from the SDKs you need
import { firebaseAuth, firebaseStorageRef, firestore } from '../firebase';
import { DeleteGroup } from './Groups';
import { UpdateUserWithId } from './Users'


export const getPosition = () => {
    return new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject)
    );
}

export const SignupUser = async (email, username, password, firstName, lastName, age) => {
    /* Signs up a user and returns the newly created user object */
    
    let response = null, error = null;
    let coords = null, allowLocation = true;

    await getPosition()
    .then(res => coords = [res.coords.latitude, res.coords.longitude])
    .catch(err => allowLocation = false);

    // SIGN UP user
    await firebaseAuth.createUserWithEmailAndPassword(email, password).then(async user => {
        response = user.user;

        // CREATE user in database
        await firestore.collection('users').doc(user.user.uid).set({
            first_name: firstName,
            last_name: lastName,
            email,
            darkMode: true,
            bio: '',
            hasAgeRange: false,
            ageRange: [0, 100],
            username,
            coords,
            age,
            blocked: [],
            allowLocation,
            img: null,
            imgPath: null,
        }).catch(err => {
            error = err;
        })

    }).catch(err => {
        error = err;
    })


    return { response, error };
}

export const SignupUserWithImage = async (email, username, password, firstName, lastName, age, image) => {
    /* Signs up a user and returns the newly created user object */
    
    let response = null, error = null;
    let coords = null, allowLocation = true;

    await getPosition()
    .then(res => coords = [res.coords.latitude, res.coords.longitude])
    .catch(err => allowLocation = false);

    // SIGN UP user
    await firebaseAuth.createUserWithEmailAndPassword(email, password).then(async user => {

        response = user.user;
        let downloadURL = null;
        const path = 'profileImages/' + response.uid + '.' + image.name.split('.').pop().toLowerCase();

        await firebaseStorageRef.child(path).put(image)
        .then(async res => {
            await res.ref.getDownloadURL().then(url => downloadURL = url);
        })
        .catch(err => error = err)

        // CREATE user in database
        await firestore.collection('users').doc(user.user.uid).set({
            first_name: firstName,
            last_name: lastName,
            email,
            darkMode: true,
            username,
            hasAgeRange: false,
            ageRange: [0, 100],
            coords, 
            blocked: [],
            age,
            allowLocation,
            bio: '',
            img: downloadURL,
            imgPath: path,
        }).catch(err => {
            error = err;
        })

    }).catch(err => {
        error = err;
    })


    return { response, error };
}


export async function logoutAuth(){
    await firebaseAuth.signOut().then(() => {
        console.log("Sign Out Successful")
    }).catch(err => {
        console.error(err);
        console.log("Failed login")
    });
}

export const direct_login = async (email, pass) => {

    let response = null, error = null;
    await firebaseAuth.signInWithEmailAndPassword(email, pass).then(async user => {
        response = user; 


        // Check if user allows location use
        firestore.collection('users').doc(user.user.uid).get().then(async snapshot => {

            // If user allows us, we get their data location
            if (snapshot.data().allowLocation) {
                await getPosition()
                .then(async location => {

                    // Update coordinates
                    const res = await UpdateUserWithId(user.user.uid, { 
                        coords: [location.coords.latitude, location.coords.longitude] 
                    })
                    if (res.error) error = res.error;

                })
                .catch(async err => {

                    // Remove Coordinates
                    const res = await UpdateUserWithId(user.user.uid, { coords: null } )
                    if (res.error) error = res.error;

                });
            }
        })

        

        
    }).catch(err => {
        error = err;
    })
    return { response, error };
}



export const DeleteUser = async ({ 
    id, 
    imgPath, 
    ownedGroups,
    involvedGroupIDs, 
    followingDocIDs, 
    outgoingInviteIDs, 
    incomingInviteIDs 
}) => {

    let response = null, error = null;


    // Delete profile picture (If applicable)
    console.log("ImagePath:");
    console.log(imgPath)
    if (imgPath) {
        await firebaseStorageRef.child(imgPath).delete()
        .catch(err => error = err)
    }

    console.log("Deleted img");

    // Delete reference in groups
    await involvedGroupIDs.forEach(async groupID => {
        await firestore.collection('groups').doc(groupID).collection('users').doc(id).delete()
        .catch(err => error = err);
    })

    console.log("Deleted any docs where user was part of group")


    // Delete any owned groups
    await ownedGroups.forEach(async group => {
        await DeleteGroup(group.id, group.imgPath);
    })

    console.log("Deleted any owned groups")

    // Remove any friend connections
    await Promise.all(
        followingDocIDs.map(async docID => await firestore.collection('friends').doc(docID).delete())
    ).catch(err => error = err);

    console.log("removed any following connections");
    // TODO: Also remove docs of those following user

    // Remove any invitations 
    await Promise.all(
        [...outgoingInviteIDs, ...incomingInviteIDs].map(async docID => await firestore.collection('group-invitations').doc(docID).delete())
    ).catch(err => error = err);

    console.log("Removed all invitations, incoming/outgoing");

    // Delete account 
    await firestore.collection('users').doc(id).delete()
    .then(res => response = res)
    .catch(err => error = err)

    console.log("Removed user doc")

    // Delete authentication
    await firebaseAuth.currentUser.delete()
    .catch(err => error = err);

    console.log("Removed auth account")


    return { response, error };
}