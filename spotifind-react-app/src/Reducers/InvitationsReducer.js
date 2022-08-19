

const SET_INVITATION = 'SET_INVITATION';


export const SetInvitation = (payload) => ({
   type: SET_INVITATION,
   payload
});


const initialState = {};


export default (state = initialState, { type, payload }) => {
   switch (type) {
      case SET_INVITATION:

         const { groupID, userID, status, docID } = payload;
         const group = state[groupID] || {}     // Check if group exists
         const groupCopy = { ...group }
         groupCopy[userID] = { status, docID, userID };
         return { ...state, [groupID]: groupCopy };
         
      default:
         return state;
   }
}