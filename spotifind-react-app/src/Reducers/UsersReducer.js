
const SET_USERS   = 'SET_USERS';
const ADD_USER    = 'ADD_USER';
const RESET_USERS = 'RESET_USERS';


// For completely resetting the users state (Used for batch updates or removal of users)
export const SetUsers = (payload) => ({
   type: SET_USERS,
   payload
});

// For adding a single user
export const AddUser = (payload) => ({
   type: ADD_USER,
   payload
});

export const ResetUsers = () => ({
   type: RESET_USERS
});



const initialState = {}

export default (state = initialState, { type, payload }) => {
   switch (type) {
      case ADD_USER:
         const { id, user } = payload;
         return {...state, [id]: user};
      case SET_USERS:
         return {...payload};
      case RESET_USERS:
         return {}
      default:
         return state;
   }
}