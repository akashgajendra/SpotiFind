
const SET_GROUPS              = 'SET_GROUPS';
const REMOVE_GROUP            = 'REMOVE_GROUP';
const REMOVE_USER_FROM_GROUP  = 'REMOVE_USER_FROM_GROUP';
const ADD_GROUP               = 'ADD_GROUP';
const ADD_USER_TO_GROUP       = 'ADD_USER_TO_GROUP';
const ADD_MESSAGE_TO_GROUP    = 'ADD_MESSAGE_TO_GROUP';
const RESET_GROUPS            = 'RESET_GROUPS';
const UPDATE_GROUP            = 'UPDATE_GROUP';


// For completely resetting the users state (Used for batch updates or removal of users)
export const SetGroups = (payload) => ({
   type: SET_GROUPS,
   payload
});

export const RemoveGroup = (payload) => ({
   type: REMOVE_GROUP,
   payload
});

export const RemoveUserFromGroup = (payload) => ({
   type: REMOVE_USER_FROM_GROUP,
   payload
});

// For adding a single user
export const AddGroup = (payload) => ({
   type: ADD_GROUP,
   payload
});

export const AddUserToGroup = (payload) => ({
   type: ADD_USER_TO_GROUP,
   payload
});

export const AddMessageToGroup = (payload) => ({
   type: ADD_MESSAGE_TO_GROUP,
   payload
});

export const ResetGroups = () => ({
   type: RESET_GROUPS
});

export const UpdateGroup = (payload) => ({
   type: UPDATE_GROUP,
   payload
});



const initialState = {}

export default (state = initialState, { type, payload }) => {
   switch (type) {

      case REMOVE_GROUP:
         const copy = {...state};
         delete copy[payload];
         return copy;
      
      case REMOVE_USER_FROM_GROUP:
         const filteredUsers = [...state[payload.groupID].users].filter(user => user.userID !== payload.userID);
         return {...state, [payload.groupID]: { ...state[payload.groupID], users: filteredUsers }};

      case ADD_GROUP:
         const { id, group } = payload;
         return {...state, [id]: group};


      case SET_GROUPS:
         return {...payload};


      case ADD_USER_TO_GROUP:

         // Copy group and add user to group's user list
         const { groupID, userID, docID } = payload;
         const groupCopy = {...state[groupID]}
         groupCopy.users.push({ userID, docID })
 
         return {...state, [groupID]: groupCopy }

      case ADD_MESSAGE_TO_GROUP:
         const a = {...state[payload.groupID]}
         a.messages.push(payload.message)

         return {...state, [payload.groupID]: a }

      case RESET_GROUPS:
         return {};

      case UPDATE_GROUP:
         return {...state, [payload.groupID]: {...state[payload.groupID], ...payload.group}};

      default:
         return state;
   }
}