


const ADD_FRIEND = 'ADD_FRIEND';
const REMOVE_FRIEND = 'REMOVE_FRIEND';
const RESET_FRIENDS = 'RESET_FRIENDS';


export const AddFriend = (payload) => ({
   type: ADD_FRIEND,
   payload
});

export const RemoveFriend = (payload) => ({
   type: REMOVE_FRIEND,
   payload
})

export const ResetFriends = () => ({
   type: RESET_FRIENDS,
})

const initialState = {};


export default (state = initialState, { type, payload }) => {
   switch (type) {
      case ADD_FRIEND:
         return {...state, [payload.friendID]: payload.relationshipID }

      case REMOVE_FRIEND:
         const friendListCopy = {...state}
         delete friendListCopy[payload]      // Payload should be the relationshipID
         return friendListCopy;

      case RESET_FRIENDS:
         return {};
         
      default:
         return state;
   }
}