
const ADD_ADMIN    = 'ADD_ADMIN';
const REMOVE_ADMIN = 'REMOVE_ADMIN';




// For adding a single ADMIN
export const AddAdmin = (payload) => ({
   type: ADD_ADMIN,
   payload
});

export const RemoveAdmin = () => ({
   type: REMOVE_ADMIN
});



const initialState = {}

export default (state = initialState, { type, payload }) => {
   switch (type) {
      case ADD_ADMIN:
         const { user, userID } = payload;
         return {...state, [user]: userID};
      case REMOVE_ADMIN:
         const copy = {...state};
         delete copy[payload];
         return copy;
      default:
         return state;
   }
}